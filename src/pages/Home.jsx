import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Banner from "../components/Banner";
import Categories from "../components/Categories";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Categories />

      <ProductGrid
        title="Featured Products"
        filter={{ featured: true }}
      />

      <Banner />

      <ProductGrid
        title="New Arrivals"
        filter={{ new_arrival: true }}
      />

      <Footer />
    </>
  );
}
