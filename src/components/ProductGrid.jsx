import { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import ProductCard from "./ProductCard";
import "./ProductGrid.css";

export default function ProductGrid({ title, filter }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  const filtered = filter
    ? products.filter((product) =>
        Object.entries(filter).every(
          ([key, value]) => product[key] === value
        )
      )
    : products;

  if (loading) {
    return (
      <section className="product-grid-section container">
        <h2>{title}</h2>
        <p>Loading products...</p>
      </section>
    );
  }

  if (filtered.length === 0) {
    return null;
  }

  return (
    <section className="product-grid-section container">
      <h2>{title}</h2>

      <div className="product-grid">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
