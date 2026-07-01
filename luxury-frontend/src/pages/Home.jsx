import React from 'react';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import ApartmentsShowcase from '../components/ApartmentsShowcase';
import Facilities from '../components/Facilities';
import WhyChooseUs from '../components/WhyChooseUs';
import Gallery from '../components/Gallery';
import Attractions from '../components/Attractions';
import Reviews from '../components/Reviews';

export default function Home() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)' }}>
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
      <div id="reviews">
        <Reviews />
      </div>
    </div>
  );
}
