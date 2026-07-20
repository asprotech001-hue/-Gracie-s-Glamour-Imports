import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getSettings } from "../services/api";
import "./Footer.css";

export default function Footer() {
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
    <footer>
      <div className="container footer">

        <div>
          <h2>
            Gracie's Glamour
          </h2>
          <p>
            Luxury imported fashion.
          </p>
        </div>

        <div>
          <h3>
            Quick Links
          </h3>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
        </div>

        <div>
          <h3>
            Follow Us
          </h3>

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

          {settings?.email && (
            <a href={`mailto:${settings.email}`}>
              {settings.email}
            </a>
          )}

          {!settings?.facebook &&
            !settings?.instagram &&
            !settings?.tiktok &&
            !settings?.whatsapp &&
            !settings?.email && (
              <p>Contact details coming soon.</p>
            )}

        </div>

      </div>
    </footer>
  );
}
