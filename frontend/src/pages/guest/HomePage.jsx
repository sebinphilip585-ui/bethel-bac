import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from '../../components/guest/Hero';
import AboutSection from '../../components/guest/AboutSection';
import ApartmentsShowcase from '../../components/guest/ApartmentsShowcase';
import Facilities from '../../components/guest/Facilities';
import WhyChooseUs from '../../components/guest/WhyChooseUs';
import Gallery from '../../components/guest/Gallery';
import Attractions from '../../components/guest/Attractions';
import Marquee from '../../components/guest/Marquee';
import Reviews from '../../components/guest/Reviews';
import '../../styles/luxury.css';

export default function HomePage() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return (
    <div className="luxury-theme" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Hero />
      <div id="about">
        <AboutSection />
      </div>
      <div id="apartments">
        <ApartmentsShowcase />
      </div>
      <div id="facilities">
        <Facilities />
      </div>
      <div id="why-choose-us">
        <WhyChooseUs />
      </div>
      <div id="gallery">
        <Gallery />
      </div>
      <div id="attractions">
        <Attractions />
      </div>
      <Marquee />
      <div id="reviews">
        <Reviews />
      </div>
    </div>
  );
}
