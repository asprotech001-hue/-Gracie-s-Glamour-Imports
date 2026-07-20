import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCategories } from "../services/api";
import "./Categories.css";

export default function Categories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  if (loading || categories.length === 0) {
    return null;
  }

  return (
    <section className="categories container">

      <h2>Shop By Category</h2>

      <div className="category-grid">

        {categories.map((category) => (

          <div
            className="category-card"
            key={category.id}
            onClick={() => navigate(`/shop?category=${category.id}`)}
          >

            <img
              src={category.image || "https://placehold.co/160x160"}
              alt={category.name}
            />

            <h4>{category.name}</h4>

          </div>

        ))}

      </div>

    </section>
  );
}
