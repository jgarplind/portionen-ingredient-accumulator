extern crate reqwest;
extern crate select;

use select::document::Document;
use select::node::Node;
use select::predicate::{Class, Name, Predicate};
use serde::{Serialize, Deserialize};

use aws_lambda_events::event::apigw::{ApiGatewayProxyRequest, ApiGatewayProxyResponse};
use aws_lambda_events::encodings::Body;
use http::header::HeaderMap;
use lambda_runtime::{handler_fn, Context, Error};

#[derive(Serialize, Deserialize, Debug)]
struct Recipe {
    name: String,
    slug: String
}

#[tokio::main]
async fn main() -> Result<(), Error> {
    let func = handler_fn(my_handler);
    lambda_runtime::run(func).await?;
    Ok(())
}

pub(crate) async fn my_handler(event: ApiGatewayProxyRequest, _ctx: Context) -> Result<ApiGatewayProxyResponse, Error> {
    let recipes = list_all_known_recipes().await;

    let serialized = serde_json::to_string(&recipes).unwrap();

    let resp = ApiGatewayProxyResponse {
        status_code: 200,
        headers: HeaderMap::new(),
        multi_value_headers: HeaderMap::new(),
        body: Some(Body::Text(serialized)),
        is_base64_encoded: Some(false),
    };

    Ok(resp)
}

fn transform_link_to_recipe(node: &Node) -> Recipe {
    let slug = String::from(node.attr("href").unwrap());

    // TODO: More precise iteration
    let name = node.first_child().unwrap().next().unwrap().next().unwrap().next().unwrap().text();

    Recipe {
        name,
        slug
    }
}

async fn list_recipes(page_number: u32, identifying_class: &str) -> Vec<Recipe> {
    let mut recipes: Vec<Recipe> = Vec::new();
    let url = format!("https://undertian.com/page/{}?s=&post_type=recept&orderby=post_date&order=desc", page_number);
    let resp = reqwest::get(url).await.unwrap();
    assert!(resp.status().is_success());
    let str = resp.text().await.unwrap();
    let body = str.as_str();
    // println!("{}", body); // Debug to see whole document as seen by scraper

    let document = Document::from(body);
    document
        .find(Class(identifying_class).descendant(Name("ul")).descendant(Name("li").descendant(Name("a"))))
        .map(|n| transform_link_to_recipe(&n))
        .for_each(|r| recipes.push(r));
    recipes
}

async fn list_all_known_recipes() -> Vec<Recipe> {
    let mut recipes: Vec<Recipe> = Vec::new();
    for page in 1..=7 {
        let mut recipes_from_page = list_recipes(page, "search-recipe-grid").await;
        recipes.append(&mut recipes_from_page);
    }
    
    let special_section_identifying_class = "recipe-collection-banner";
    let mut recipes_from_special_sections = list_recipes(1, special_section_identifying_class).await;
    recipes.append(&mut recipes_from_special_sections);
        
    recipes.sort_by(|a, b| a.name.cmp(&b.name));

    recipes
}