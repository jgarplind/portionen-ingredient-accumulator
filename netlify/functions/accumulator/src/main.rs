extern crate reqwest;
extern crate select;

use select::document::Document;
use select::predicate::Attr;
use std::str::FromStr;
use std::collections::HashMap;
use serde::{Serialize, Deserialize};

use aws_lambda_events::event::apigw::{ApiGatewayProxyRequest, ApiGatewayProxyResponse};
use aws_lambda_events::encodings::Body;
use http::header::HeaderMap;
use lambda_runtime::{handler_fn, Context, Error};
// use log::LevelFilter;
// use simple_logger::SimpleLogger;

const KNOWN_VOLUME_UNITS: [&str; 6] = ["l", "dl", "ml", "msk", "tsk", "krm"];
const SEPARATOR: &str = "¤";

fn is_volume(unit: &str) -> bool {
    if KNOWN_VOLUME_UNITS.into_iter().any(|known_unit| known_unit == unit) {
        return true
    }
    false
}

fn is_compatible_units(unit1: &str, unit2: &str) -> bool {
    is_volume(unit1) && is_volume(unit2)
}

fn convert_amount_to_existing_unit<'a>(amount_in_old_unit: f32, old_unit: &str, existing_unit: &'a str) -> Option<(f32, &'a str)> {
    if !is_compatible_units(old_unit, existing_unit) {
        return None
    }

    let amount_in_ml = match old_unit {
        "l" => 1000.0 * amount_in_old_unit,
        "dl" => 100.0 * amount_in_old_unit,
        "ml" => amount_in_old_unit,
        "msk" => 15.0 * amount_in_old_unit,
        "tsk" => 5.0 * amount_in_old_unit,
        "krm" => amount_in_old_unit,
        _ => 1.0
    };
    let amount_in_existing_unit = match existing_unit {
        "l" => amount_in_ml / 1000.0,
        "dl" => amount_in_ml / 100.0,
        "ml" => amount_in_ml,
        "msk" => amount_in_ml / 15.0,
        "tsk" => amount_in_ml / 5.0,
        "krm" => amount_in_ml,
        _ => 1.0
    };

    Some((amount_in_existing_unit, existing_unit))
}

fn normalize(amount: f32, unit: &str) -> (f32, &str) {
    return match unit {
        "dl" => if amount >= 10.0 { (amount / 10.0, "l") } else { (amount, unit) } 
        "ml" | "krm" => 
            if amount >= 1000.0 { (amount / 1000.0, "l") } 
            else if amount >= 100.0 { (amount / 100.0, "dl") } 
            else if amount >= 15.0 { (amount / 15.0, "msk") } 
            else if amount >= 5.0 { (amount / 5.0, "tsk") } 
            else { (amount, unit) } 
        "msk" => 
            if amount >= 1000.0 / 15.0 { (amount * 15.0 / 1000.0, "l") } 
            else if amount >= 100.0 / 15.0 { (amount * 15.0 / 100.0, "dl") } 
            else { (amount, unit) } 
        "tsk" => 
            if amount >= 200.0 { (amount / 200.0, "l") } 
            else if amount >= 20.0 { (amount / 20.0, "dl") } 
            else if amount >= 3.0 { (amount / 3.0, "msk") } 
            else { (amount, unit) }
        _ => (amount, unit)
    };
}

fn deduplicate(ingredients: Vec<Ingredient>) -> Vec<Ingredient> {
    let mut dict: HashMap<String, (f32, String)> = HashMap::new();
    for ingredient in ingredients {
        let key = ingredient.name;
        if dict.contains_key(&key) {
            let (existing_amount, existing_unit) = dict.get(&key).unwrap();
            let mut amount_and_unit_to_add = (ingredient.amount, ingredient.unit.clone());
            if existing_unit != &ingredient.unit {
                amount_and_unit_to_add = match convert_amount_to_existing_unit(ingredient.amount, &ingredient.unit, &existing_unit) {
                    Some(x) => (x.0 + existing_amount, String::from(x.1)),
                    None => amount_and_unit_to_add
                };
            }
            if existing_unit == &amount_and_unit_to_add.1 {
                dict.insert(key, (existing_amount + amount_and_unit_to_add.0, String::from(existing_unit)));
            } else {
                let necessary_duplicate_key = format!("{}{}{}", key, SEPARATOR, &amount_and_unit_to_add.1);
                let entry = dict.entry(necessary_duplicate_key).or_insert((0.0, amount_and_unit_to_add.1));
                entry.0 += amount_and_unit_to_add.0;
            }
        } else {
            dict.insert(key, (ingredient.amount, ingredient.unit));
        }
    }

    let mut accumulated_ingredients: Vec<Ingredient> = Vec::new();
    for (mut name, (amount, unit)) in dict {
        if name.contains(SEPARATOR) {
            name = String::from(name.split_once(SEPARATOR).unwrap().0);
        }
        accumulated_ingredients.push(Ingredient { amount, name, unit })
    }
    accumulated_ingredients
}

async fn list_accumulated_ingredients(slugs: Vec<&str>) -> Vec<Ingredient> {
    let mut ingredients: Vec<Ingredient> = Vec::new(); 
    for slug in slugs {
        let mut ingredients_from_url = list_ingredients(slug).await;
        ingredients.append(&mut ingredients_from_url);
    }

    let accumulated_ingredients = accumulate(ingredients);

    // TODO: Extend logic to consider:
    // - weights
    // - UNIT TEST: incompatible units like "st" and "kg" (probably need additional dictionary entry then..)

    let deduplicated_ingredients = deduplicate(accumulated_ingredients);

    let mut normalized_ingredients: Vec<Ingredient> = deduplicated_ingredients.into_iter()
    .map(|di| {
        let (amount, unit) = normalize(di.amount, &di.unit);
        return Ingredient { name: di.name, amount, unit: String::from(unit)};
    }).collect();

    normalized_ingredients.sort_by(|a, b| a.name.cmp(&b.name));

    normalized_ingredients
}

#[derive(Serialize, Deserialize, Debug)]
struct Ingredient {
    amount: f32,
    unit: String,
    name: String
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    // SimpleLogger::new().with_level(LevelFilter::Info).init().unwrap();

    let func = handler_fn(my_handler);
    lambda_runtime::run(func).await?;
    Ok(())
}

pub(crate) async fn my_handler(event: ApiGatewayProxyRequest, _ctx: Context) -> Result<ApiGatewayProxyResponse, Error> {
    // let fallback_urls = vec!["https://undertian.com/recept/pizza-med-gronkal-och-pumpatopping/", "https://undertian.com/recept/griljerad-seitan-till-julbordet/"];

    // let serialized_fallback_urls = serde_json::to_string(&fallback_urls).unwrap();

    let slugs_query_parameter = event.query_string_parameters.get("urls").unwrap();

    let slugs = slugs_query_parameter.split(", ").collect();
    
    let accumulated_ingredients = list_accumulated_ingredients(slugs).await;

    let serialized = serde_json::to_string(&accumulated_ingredients).unwrap();

    let resp = ApiGatewayProxyResponse {
        status_code: 200,
        headers: HeaderMap::new(),
        multi_value_headers: HeaderMap::new(),
        body: Some(Body::Text(serialized)),
        is_base64_encoded: Some(false),
    };

    Ok(resp)
}

fn accumulate(ingredients: Vec<Ingredient>) -> Vec<Ingredient> {
    let mut dict = HashMap::new();
    for ingredient in ingredients {
        let key = format!("{}{}{}", ingredient.name, SEPARATOR, ingredient.unit);
        *dict.entry(key).or_insert(0.0) += ingredient.amount;
    }
    let mut accumulated_ingredients: Vec<Ingredient> = Vec::new();
    for (name_unit, amount) in dict {
        let mut name_unit_vector = name_unit.split(SEPARATOR);
        let name = String::from(name_unit_vector.next().unwrap());
        let unit = String::from(name_unit_vector.next().unwrap());
        accumulated_ingredients.push(Ingredient { amount, name: String::from(name), unit: String::from(unit) })
    }
    accumulated_ingredients
}

fn purchasable(ingredient_name: &str) -> bool {
    if ingredient_name.contains(" vatten") || ingredient_name.contains("vatten,") || ingredient_name == "vatten" {
        return false;
    }
    return true;
}

fn text_to_relevant_ingredient(text: &str) -> Option<Ingredient> {
    let normalized_text = text.trim();
    let mut tokens_iterator = normalized_text.split_whitespace();

    let probable_amount = f32::from_str(tokens_iterator.next().unwrap());

    // No amount, so not relevant to accumulate.
    // TODO: Present in some way?
    if probable_amount.is_err() {
        return None;
    }

    let amount = probable_amount.unwrap();

    let unit = String::from(tokens_iterator.next().unwrap());

    let name = tokens_iterator.collect::<Vec<&str>>().join(" ");

    // Not something we're buying, so not relevant to accumulate.
    // TODO: Present in some way?
    if !purchasable(&name) {
        return None;
    }

    Some(Ingredient { 
        amount,
        name,
        unit
    })
}

async fn list_ingredients(slug: &str) -> Vec<Ingredient> {
    let url = format!("https://undertian.com/recept/{}", slug);
    let resp = reqwest::get(&url).await.unwrap();
    assert!(resp.status().is_success(), "Url was: {} and slug was: {}", &url, slug);
    let str = resp.text().await.unwrap();
    let body = str.as_str(); // clean up
    // println!("{}", body); // Debug to see whole document as seen by scraper

    let mut ingredients: Vec<Ingredient> = Vec::new();

    const IDENTIFYING_ATTRIBUTE: &str = "itemprop";
    const IDENTIFYING_VALUE: &str = "recipeIngredient";
    let document = Document::from(body);
    document
        .find(Attr(IDENTIFYING_ATTRIBUTE, IDENTIFYING_VALUE))
        .map(|n| text_to_relevant_ingredient(n.text().as_str())) // map -> filter -> map. Maybe filter_map can be used?
        .filter(|oi| oi.is_some() )
        .map(|oi| oi.unwrap())
        .for_each(|i| ingredients.push(i)); // Maybe excessive?

    ingredients
}

// TODO:
// X Allow non-hardcoded URL:s
// / Filter out things like water (maybe present it in some nice way too?)
// - Fuse similar ingredients -> Can be done manually for the most part, not a priority
// / Introduce named constants with proper naming
// - Simplify working code
// - Separate code to files
// - Make code callable as Netlify function
// - Capitalize first letter