use std::collections::HashMap;

use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Ingredient {
    pub amount: f32,
    pub unit: String,
    pub name: String
}

const KNOWN_VOLUME_UNITS: [&str; 6] = ["l", "dl", "ml", "msk", "tsk", "krm"];
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

const SEPARATOR: &str = "¤";
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

pub async fn list_accumulated_ingredients(ingredients: Vec<Ingredient>) -> Vec<Ingredient> {
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