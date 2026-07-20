import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { Search, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getSettings } from "../services/api";
import "./Navbar.css";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const { count, setIsOpen } = useCart();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      const data = await getSettings();
      setSettings(data);
    } catch (err) {
      console.error(err);
    }
  }

  function whatsappLink() {
    if (!settings?.whatsapp) return null;
    const phone = settings.whatsapp.replace(/[^0-9]/g, "");
    return `https://wa.me/${phone}`;
  }

  return (
    <>
      <div className="topbar">

        {settings?.facebook && (
          <a href={settings.facebook} target="_blank" rel="noreferrer">
            Facebook
          </a>
        )}

        {settings?.instagram && (
          <a href={settings.instagram} target="_blank" rel="noreferrer">
            Instagram
          </a>
        )}

        {settings?.tiktok && (
          <a href={settings.tiktok} target="_blank" rel="noreferrer">
            TikTok
          </a>
        )}

        {whatsappLink() && (
          <a href={whatsappLink()} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        )}

        {!settings?.facebook &&
          !settings?.instagram &&
          !settings?.tiktok &&
          !settings?.whatsapp && (
            <span>Facebook | Instagram | TikTok | WhatsApp</span>
          )}

      </div>

      <header className="navbar container">
        <h1 className="logo">
          Gracie's Glamour
        </h1>
        
        <SearchBar />
        
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <div className="icons">
          <Search size={20}/>
          <Heart size={20}/>

          <div className="cart-icon" onClick={() => setIsOpen(true)}>
            <ShoppingCart size={24} />
            {count > 0 && (
              <span className="cart-badge">{count}</span>
            )}
          </div>

        </div>
      </header>
    </>
  );
}
