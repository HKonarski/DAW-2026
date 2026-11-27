import type { Product } from "../dtos/product";

const CSV_URL = "/produtos.csv";
const REQUIRED_COLUMNS = [
  "id",
  "name",
  "description",
  "price",
  "category",
  "image",
] as const;

function parseCsvRows(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let insideQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (insideQuotes) {
      if (character === '"') {
        if (csv[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          insideQuotes = false;
        }
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"' && field.length === 0) {
      insideQuotes = true;
    } else if (character === '"') {
      throw new Error(`Aspas inesperadas no CSV, caractere ${index + 1}.`);
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n" || character === "\r") {
      row.push(field);
      if (row.some((value) => value.trim() !== "")) {
        rows.push(row);
      }
      row = [];
      field = "";
      if (character === "\r" && csv[index + 1] === "\n") {
        index += 1;
      }
    } else {
      field += character;
    }
  }

  if (insideQuotes) {
    throw new Error("O CSV contém um campo com aspas não fechadas.");
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    if (row.some((value) => value.trim() !== "")) {
      rows.push(row);
    }
  }

  return rows;
}

function parseProductsCsv(csv: string): Product[] {
  const [headerRow, ...productRows] = parseCsvRows(csv);
  if (!headerRow) {
    throw new Error("O arquivo produtos.csv está vazio.");
  }

  const headers = headerRow.map((header, index) =>
    (index === 0 ? header.replace(/^\uFEFF/, "") : header).trim(),
  );
  const missingColumns = REQUIRED_COLUMNS.filter(
    (column) => !headers.includes(column),
  );
  if (missingColumns.length > 0) {
    throw new Error(
      `Colunas ausentes em produtos.csv: ${missingColumns.join(", ")}.`,
    );
  }

  return productRows.map((row, index) => {
    if (row.length !== headers.length) {
      throw new Error(
        `Quantidade de campos inválida no registro ${index + 2} de produtos.csv.`,
      );
    }

    const value = (column: (typeof REQUIRED_COLUMNS)[number]) =>
      row[headers.indexOf(column)].trim();
    const id = Number(value("id"));
    const price = Number(value("price").replace(",", "."));

    if (!Number.isInteger(id) || !Number.isFinite(price)) {
      throw new Error(
        `ID ou preço inválido no registro ${index + 2} de produtos.csv.`,
      );
    }

    return {
      id,
      name: value("name"),
      description: value("description"),
      price,
      category: value("category"),
      image: value("image"),
    };
  });
}

export const ProductService = {
  async listAll(): Promise<Product[]> {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(
        `Não foi possível carregar produtos.csv (HTTP ${response.status}).`,
      );
    }

    return parseProductsCsv(await response.text());
  },
};
