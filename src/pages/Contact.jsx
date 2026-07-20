import { useEffect, useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getSettings } from "../services/api";
import toast from "react-hot-toast";
import "./Contact.css";

export default function Contact() {
  const [settings, setSettings] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

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

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }

    // Note: this currently only confirms locally.
    // Wire this up to an email service or a gg_messages table
    // in Supabase when you're ready to receive real submissions.
    toast.success("Message sent! We'll get back to you soon.");

    setForm({ name: "", email: "", message: "" });
  }

  return (
    <>
      <Navbar />

      <section className="contact container">

        <h1>Contact Us</h1>

        <div className="contact-content">

          <div className="contact-details">

            <h2>Get In Touch</h2>

            <p>
              Have a question about an order, a product, or anything else?
              Reach out — we'd love to hear from you.
            </p>

            <div className="contact-item">
              <Phone size={20} />
              <span>{settings?.phone || "Not set yet"}</span>
            </div>

            <div className="contact-item">
              <Mail size={20} />
              <span>{settings?.email || "Not set yet"}</span>
            </div>

            <div className="contact-item">
              <MapPin size={20} />
              <span>{settings?.address || "Not set yet"}</span>
            </div>

          </div>

          <form className="contact-form" onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
            />

            <textarea
              rows="6"
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
            />

            <button type="submit">
              Send Message
            </button>

          </form>

        </div>

      </section>

      <Footer />
    </>
  );
}
