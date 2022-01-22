use select::{document::Document, predicate::Attr};

use super::Ingredient;
use std::str::FromStr;

pub async fn list_ingredients(slug: &str) -> Vec<Ingredient> {
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


fn purchasable(ingredient_name: &str) -> bool {
    if ingredient_name.contains(" vatten") || ingredient_name.contains("vatten,") || ingredient_name == "vatten" {
        return false;
    }
    return true;
}