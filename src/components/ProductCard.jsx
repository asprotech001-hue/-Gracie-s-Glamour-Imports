import { Heart, Eye, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const imageUrl =
    product.product_images?.[0]?.image_url ||
    "https://placehold.co/400x400?text=No+Image";

  function goToProduct() {
    navigate(`/product/${product.id}`);
  }

  return (
    <div className="product-card">

      <div className="image-box">

        <span className="price">
          GH₵ {product.price}
        </span>

        {product.new_arrival && (
          <span className="new">
            NEW
          </span>
        )}

        <Heart className="wish" />

        <img
          src={imageUrl}
          alt={product.name}
          onClick={goToProduct}
          style={{ cursor: "pointer" }}
        />

        <button className="quick" onClick={goToProduct}>
          <Eye size={18} />
          Quick View
        </button>

      </div>

      <div className="product-info">

        <h3 onClick={goToProduct} style={{ cursor: "pointer" }}>
          {product.name}
        </h3>

        <div className="stars">

          <Star fill="#f4b400" size={18} />

          <Star fill="#f4b400" size={18} />

          <Star fill="#f4b400" size={18} />

          <Star fill="#f4b400" size={18} />

          <Star fill="#f4b400" size={18} />

        </div>

        <button
          className="cart"
          onClick={() => addToCart(product, 1)}
        >
          Add To Cart
        </button>

      </div>

    </div>
  );
}
