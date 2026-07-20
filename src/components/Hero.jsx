import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";

import "swiper/css";
import "./Hero.css";

const slides = [
  {
    title: "GLOBAL CHIC",
    subtitle: "Imported Fashion For You",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1800"
  },
  {
    title: "NEW COLLECTION",
    subtitle: "Luxury Imported Styles",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800"
  },
  {
    title: "LOOK AMAZING",
    subtitle: "Dress With Confidence",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1800"
  }
];

export default function Hero() {
  const navigate = useNavigate();

  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 4000 }}
      loop
    >
      {slides.map((slide, index) => (
        <SwiperSlide key={index}>
          <section
            className="hero"
            style={{
              backgroundImage: `url(${slide.image})`
            }}
          >
            <div className="overlay">

              <h1>{slide.title}</h1>

              <p>{slide.subtitle}</p>

              <button onClick={() => navigate("/shop")}>
                SHOP NOW
              </button>

            </div>
          </section>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
