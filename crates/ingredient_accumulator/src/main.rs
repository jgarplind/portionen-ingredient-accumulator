mod scraper;
use scraper::list_ingredients;

mod ingredient;
use ingredient::Ingredient;
use ingredient::list_accumulated_ingredients;

use aws_lambda_events::event::apigw::{ApiGatewayProxyRequest, ApiGatewayProxyResponse};
use aws_lambda_events::encodings::Body;
use http::header::HeaderMap;
use lambda_runtime::{handler_fn, Context, Error};

#[tokio::main]
async fn main() -> Result<(), Error> {
    let handler = handler_fn(list_ingredients_handler);
    lambda_runtime::run(handler).await?;
    Ok(())
}

async fn list_ingredients_handler(request: ApiGatewayProxyRequest, _ctx: Context) -> Result<ApiGatewayProxyResponse, Error> {
    let slugs_query_parameter = request.query_string_parameters.get("urls").unwrap();

    let slugs: Vec<&str> = slugs_query_parameter.split(", ").collect();

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
// Simplify working code into more idiomatic Rust
// Fix lint warnings (check Netlify build log)
// Combine more units (like mass)
// Consider adopting original site's color theme
// Mobile (small screen) friendlyness
// Mobile (big thumb) friendlyness
// Filter out more things like water 
// Maybe present filtered out things it in some nice way too?