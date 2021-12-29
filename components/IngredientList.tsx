import styles from "./IngredientList.module.css";

export interface IIngredient {
  name: string;
  amount: number;
  unit: string;
}

export const IngredientList = ({
  ingredients,
}: {
  ingredients: IIngredient[];
}) => (
  <ul className={styles.list}>
    {ingredients.map(({ name, amount, unit }) => (
      <li key={`${name}${unit}`}>
        {name}: {amount} {unit}
      </li>
    ))}
  </ul>
);
