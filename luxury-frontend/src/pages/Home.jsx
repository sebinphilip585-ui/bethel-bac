import React from 'react';
import Hero from '../components/Hero';
import Marquee from '../components/Marquee';
import AboutSection from '../components/AboutSection';
import LuxuryLiving from '../components/LuxuryLiving';
import ApartmentsShowcase from '../components/ApartmentsShowcase';
import Facilities from '../components/Facilities';
import Gallery from '../components/Gallery';
import SpecialOffers from '../components/SpecialOffers';
import Attractions from '../components/Attractions';
import Reviews from '../components/Reviews';
import FAQSection from '../components/FAQSection';
import ContactSection from '../components/ContactSection';

export default function Home() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)' }}>
      <Hero />
      <Marquee />
      <div id="about">
        <AboutSection />
      </div>
      <LuxuryLiving />
      <div id="apartments">
        <ApartmentsShowcase />
      </div>
      <div id="facilities">
        <Facilities />
      </div>
      <div id="gallery">
        <Gallery />
      </div>
      <SpecialOffers />
      <div id="attractions">
        <Attractions />
      </div>
      <div id="reviews">
        <Reviews />
      </div>
      <FAQSection />
      <div id="contact">
        <ContactSection />
      </div>
    </div>
  );
}
