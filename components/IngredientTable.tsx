import styles from "./IngredientTable.module.css";
import * as rt from "react-table";

export interface IIngredient {
  name: string;
  amount: number;
  unit: string;
}

const columns: rt.Column<IIngredient>[] = [
  {
    Header: "Ingrediens",
    accessor: "name", // accessor is the "key" in the data
  },
  {
    Header: "Mängd",
    accessor: "amount",
  },
  {
    Header: "Enhet",
    accessor: "unit",
  },
];

export const IngredientTable = ({
  ingredients,
}: {
  ingredients: IIngredient[];
}) => {
  const tableInstance = rt.useTable({ columns, data: ingredients });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;
  return (
    <table {...getTableProps()} className={styles.table}>
      <thead>
        {headerGroups.map((hg, hgIndex) => (
          <tr {...hg.getHeaderGroupProps()} key={hgIndex}>
            {hg.headers.map((column, columnIndex) => (
              <th
                {...column.getHeaderProps()}
                key={columnIndex}
                className={[styles.tableHeaderCell, styles.tableCell].join(" ")}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, rowIndex) => {
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps()}
              key={rowIndex}
              className={styles.tableRow}
            >
              {row.cells.map((cell, cellIndex) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    key={cellIndex}
                    className={styles.tableCell}
                  >
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
