mod scraper;
use scraper::list_ingredients;

mod ingredient;
use ingredient::Ingredient;
use ingredient::list_accumulated_ingredients;

use aws_lambda_events::event::apigw::{ApiGatewayProxyRequest, ApiGatewayProxyResponse};
use aws_lambda_events::encodings::Body;
use http::header::HeaderMap;
use lambda_runtime::{handler_fn, Context, Error};

use serde::{Serialize, Deserialize};

#[tokio::main]
async fn main() -> Result<(), Error> {
    let handler = handler_fn(list_ingredients_handler);
    lambda_runtime::run(handler).await?;
    Ok(())
}

#[derive(Serialize, Deserialize, Debug)]
struct ErrorMessageWrapper {
    message_from_backend: String
}

fn construct_error_response(error_code: i64, error_message: &str) -> ApiGatewayProxyResponse {
    ApiGatewayProxyResponse {
        status_code: error_code,
        headers: HeaderMap::new(),
        multi_value_headers: HeaderMap::new(),
        body: Some(Body::Text(serde_json::to_string(&ErrorMessageWrapper{message_from_backend: error_message.to_string()}).unwrap())),
        is_base64_encoded: Some(false)
    }
}

async fn list_ingredients_handler(request: ApiGatewayProxyRequest, _ctx: Context) -> Result<ApiGatewayProxyResponse, Error> {
    let slugs: Vec<&str> = match request.query_string_parameters.get("urls") {
        Some(slugs_as_csv) => slugs_as_csv.split(", ").collect(),
        _ => return Ok(construct_error_response(400, "Du måste välja minst ett recept"))
    };

    let mut ingredients: Vec<Ingredient> = Vec::new(); 
    for slug in slugs {
        let mut ingredients_from_url = list_ingredients(slug).await;
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
// Fix lint warnings (check Netlify build log)
// Simplify working code into more idiomatic Rust
// Combine more units (like mass)
// Consider adopting original site's color theme
// Mobile (small screen) friendlyness
// Mobile (big thumb) friendlyness
// Filter out more things like water 
// Maybe present filtered out things it in some nice way too?