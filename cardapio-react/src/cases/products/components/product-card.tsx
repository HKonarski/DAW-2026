import type { Product } from "../dtos/product";

const priceFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

type ProductCardProps = {
    product: Product;
  };


export function ProductCard({ 
  product 
}: ProductCardProps) {
    return (
        <article>
            <figure>
              <img src={product.image} alt={product.name} />
              <figcaption>{product.category}</figcaption>
            </figure>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>{priceFormatter.format(Number(product.price))}</p>
            <button type="button">Adicionar</button>
          </article>
    )
}