import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { getProducts, getCategories } from "../services/api";
import "./Shop.css";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || ""
  );

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);

    try {
      const [productData, categoryData] = await Promise.all([
        getProducts(),
        getCategories(),
      ]);

      setProducts(productData);
      setCategories(categoryData);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  function selectCategory(categoryId) {
    setActiveCategory(categoryId);

    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  }

  const filtered = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      !activeCategory ||
      String(product.category_id) === String(activeCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Navbar />

      <section className="shop container">

        <h1>Shop</h1>

        <div className="shop-toolbar">

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="shop-search"
          />

          <div className="shop-categories">

            <button
              className={activeCategory === "" ? "active" : ""}
              onClick={() => selectCategory("")}
            >
              All
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                className={
                  String(activeCategory) === String(category.id)
                    ? "active"
                    : ""
                }
                onClick={() => selectCategory(category.id)}
              >
                {category.name}
              </button>
            ))}

          </div>

        </div>

        {loading ? (

          <p className="shop-status">Loading products...</p>

        ) : filtered.length === 0 ? (

          <p className="shop-status">No products found.</p>

        ) : (

          <div className="shop-grid">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        )}

      </section>

      <Footer />
    </>
  );
}
