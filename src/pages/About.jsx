import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./About.css";

export default function About() {
  return (
    <>
      <Navbar />

      <section className="about container">

        <h1>About Gracie's Glamour</h1>

        <div className="about-content">

          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900"
            alt="Gracie's Glamour"
          />

          <div>

            <h2>Our Story</h2>

            <p>
              Gracie's Glamour was founded with a simple mission: to bring
              luxury imported fashion to everyone who wants to look and feel
              their best. We hand-pick every piece in our collection,
              blending timeless elegance with the latest global trends.
            </p>

            <p>
              From statement dresses to everyday essentials, every item is
              chosen with care, quality, and our customers in mind. We
              believe great style shouldn't be complicated — just confident.
            </p>

            <h2>Why Shop With Us</h2>

            <ul>
              <li>Carefully curated, imported collections</li>
              <li>Quality checked before every delivery</li>
              <li>Fast, reliable shipping</li>
              <li>Friendly support whenever you need it</li>
            </ul>

          </div>

        </div>

      </section>

      <Footer />
    </>
  );
}
