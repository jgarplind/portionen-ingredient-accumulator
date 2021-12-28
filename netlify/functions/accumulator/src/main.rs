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

async fn list_accumulated_ingredients(slugs: Vec<&str>) -> Vec<Ingredient> {
    // let args: Vec<String> = env::args().collect();

    // let urls = &args[1..];
    // Example arguments: 
    // let urls = vec!["https://undertian.com/recept/pizza-med-gronkal-och-pumpatopping/", "https://undertian.com/recept/griljerad-seitan-till-julbordet/"];

    // TODO: Validate urls

    let mut ingredients: Vec<Ingredient> = Vec::new(); 
    for slug in slugs {
        let mut ingredients_from_url = list_ingredients(slug).await;
        ingredients.append(&mut ingredients_from_url);
    }

    assert!(true==true);

    let mut accumulated_ingredients = accumulate(ingredients);
    
    accumulated_ingredients.sort_by(|a, b| a.name.cmp(&b.name));

    accumulated_ingredients
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
    const SEPARATOR: &str = "¤";
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