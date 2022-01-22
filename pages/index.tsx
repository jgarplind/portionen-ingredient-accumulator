import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { ComboxboxMultiSelect } from "../components/ComboboxMultiSelect";
import { IngredientTable } from "../components/IngredientTable";
import styles from "../styles/Home.module.css";
import { recipes } from "../data/recipes";

const FUNCTIONS_BASE = "/.netlify/functions";
const INGREDIENT_ACCUMULATOR_PATH = "ingredient_accumulator";

const Home: NextPage = () => {
  const [ingredients, setIngredients] = React.useState<any[]>([]);
  const [selectedRecipes, setSelectedRecipes] = React.useState<string[]>([]);

  const accumulate = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    const queryParameters = new URLSearchParams();
    selectedRecipes.forEach((sr) => queryParameters.append("urls", sr));
    const response = await fetch(
      `${FUNCTIONS_BASE}/${INGREDIENT_ACCUMULATOR_PATH}?${queryParameters.toString()}`
    );
    try {
      const json = await response.json();
      if (response.status / 100 === 2) {
        setIngredients(json);
      }
      if (response.status / 100 === 4) {
        alert(json.message_from_backend);
      }
    } catch (error) {
      alert(
        "Ett fel som jag inte har tagit höjd för inträffade. Testa att ladda om sidan kanske?"
      );
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Inköpslistegenerator - Portionen under tian</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Inköpslistegenerator</h1>

        <h2 className={styles.description}>
          Skapa inköpslistor utifrån recept från{" "}
          <a href="https://undertian.com">Portionen under tian</a>
        </h2>

        <form className={styles.form} onSubmit={accumulate}>
          <ComboxboxMultiSelect
            options={recipes}
            setSelectedValues={setSelectedRecipes}
          />
          <button className={[styles.button].join(" ")}>
            Hämta ingredienslista
          </button>
        </form>

        <IngredientTable ingredients={ingredients} />
      </main>
    </div>
  );
};

export default Home;
