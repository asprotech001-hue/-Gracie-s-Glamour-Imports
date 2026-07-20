import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { getSettings } from "../services/api";
import "./CartDrawer.css";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    setIsOpen,
    updateQuantity,
    removeFromCart,
    total,
  } = useCart();

  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    loadWhatsapp();
  }, []);

  async function loadWhatsapp() {
    try {
      const settings = await getSettings();
      setWhatsapp(settings?.whatsapp || "");
    } catch (err) {
      console.error(err);
    }
  }

  function checkoutOnWhatsapp() {
    if (items.length === 0) return;

    const lines = items.map(
      (item) =>
        `- ${item.name} x${item.quantity} (GH₵ ${item.price * item.quantity})`
    );

    const message =
      `Hi, I'd like to order:\n\n${lines.join("\n")}\n\nTotal: GH₵ ${total}`;

    const phone = whatsapp.replace(/[^0-9]/g, "");

    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
  }

  if (!isOpen) return null;

  return (
    <div className="cart-overlay" onClick={() => setIsOpen(false)}>

      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>

        <div className="cart-header">
          <h2>Your Cart</h2>

          <button onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </div>

        {items.length === 0 ? (

          <p className="cart-empty">Your cart is empty.</p>

        ) : (

          <>

            <div className="cart-items">

              {items.map((item) => (

                <div className="cart-item" key={item.id}>

                  <img src={item.image} alt={item.name} />

                  <div className="cart-item-info">

                    <h4>{item.name}</h4>

                    <p>GH₵ {item.price}</p>

                    <div className="cart-qty">

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus size={14} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <Plus size={14} />
                      </button>

                    </div>

                  </div>

                  <button
                    className="cart-remove"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              ))}

            </div>

            <div className="cart-footer">

              <div className="cart-total">
                <span>Total</span>
                <span>GH₵ {total}</span>
              </div>

              <button
                className="cart-checkout-btn"
                onClick={checkoutOnWhatsapp}
              >
                Checkout on WhatsApp
              </button>

            </div>

          </>

        )}

      </div>

    </div>
  );
}
