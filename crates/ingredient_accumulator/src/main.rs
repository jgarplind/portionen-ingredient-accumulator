extern crate reqwest;

mod scraper;
mod ingredient;
use ingredient::Ingredient;
use ingredient::list_accumulated_ingredients;

use aws_lambda_events::event::apigw::{ApiGatewayProxyRequest, ApiGatewayProxyResponse};
use aws_lambda_events::encodings::Body;
use http::header::HeaderMap;
use lambda_runtime::{handler_fn, Context, Error};

#[tokio::main]
async fn main() -> Result<(), Error> {
    let func = handler_fn(my_handler);
    lambda_runtime::run(func).await?;
    Ok(())
}

pub(crate) async fn my_handler(event: ApiGatewayProxyRequest, _ctx: Context) -> Result<ApiGatewayProxyResponse, Error> {
    let slugs_query_parameter = event.query_string_parameters.get("urls").unwrap();

    let slugs: Vec<&str> = slugs_query_parameter.split(", ").collect();

    let mut ingredients: Vec<Ingredient> = Vec::new(); 
    for slug in slugs {
        let mut ingredients_from_url = scraper::list_ingredients(slug).await;
        ingredients.append(&mut ingredients_from_url);
    }
    
    let accumulated_ingredients = list_accumulated_ingredients(ingredients).await;

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

// TODO:
// Filter out more things like water 
// Maybe present filtered out things it in some nice way too?
// Simplify working code into more idiomatic Rust
// Fix lint warnings
