import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getProduct } from "../services/api";
import { useCart } from "../context/CartContext";
import "./Product.css";

export default function Product() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    setLoading(true);
    setActiveImage(0);
    setQuantity(1);

    try {
      const data = await getProduct(id);
      setProduct(data);
    } catch (err) {
      console.error(err);
      setProduct(null);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <p className="product-status">Loading product...</p>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="product-status">
          <p>Product not found.</p>
          <Link to="/shop">Back to Shop</Link>
        </div>
        <Footer />
      </>
    );
  }

  const images =
    product.product_images?.length > 0
      ? product.product_images.map((img) => img.image_url)
      : ["https://placehold.co/600x600?text=No+Image"];

  return (
    <>
      <Navbar />

      <section className="product-detail container">

        <div className="product-gallery">

          <div className="main-image">
            <img src={images[activeImage]} alt={product.name} />
          </div>

          {images.length > 1 && (
            <div className="thumbnails">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt=""
                  className={index === activeImage ? "active" : ""}
                  onClick={() => setActiveImage(index)}
                />
              ))}
            </div>
          )}

        </div>

        <div className="product-info-panel">

          <h1>{product.name}</h1>

          {product.categories?.name && (
            <p className="product-category">
              {product.categories.name}
              {product.subcategories?.name &&
                ` / ${product.subcategories.name}`}
            </p>
          )}

          <div className="product-price">
            <span className="current">
              GH₵ {product.price}
            </span>

            {product.old_price && (
              <span className="old">
                GH₵ {product.old_price}
              </span>
            )}
          </div>

          <p className="product-description">
            {product.description}
          </p>

          <p className="product-stock">
            {product.stock > 0
              ? `${product.stock} in stock`
              : "Out of stock"}
          </p>

          <div className="quantity-selector">

            <button
              onClick={() =>
                setQuantity((q) => Math.max(1, q - 1))
              }
            >
              −
            </button>

            <span>{quantity}</span>

            <button
              onClick={() =>
                setQuantity((q) =>
                  Math.min(product.stock || 1, q + 1)
                )
              }
            >
              +
            </button>

          </div>

          <button
            className="add-to-cart-btn"
            disabled={product.stock === 0}
            onClick={() => addToCart(product, quantity)}
          >
            Add To Cart
          </button>

        </div>

      </section>

      <Footer />
    </>
  );
}
