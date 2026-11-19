import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { DashboardGreetingSection } from '../components/home/DashboardGreetingSection';
import { ShoppingClassesStrip } from '../components/home/ShoppingClassesStrip';
import { NewArrivalsSection } from '../components/home/NewArrivalsSection';
import { CompleteLookBanner } from '../components/home/CompleteLookBanner';
import { AllProductsCatalogue } from '../components/home/AllProductsCatalogue';
import { BenefitsStrip } from '../components/home/BenefitsStrip';
import { PhysicalStoresSection } from '../components/home/PhysicalStoresSection';
import { INITIAL_PRODUCTS } from '../data/products';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const { isAuthenticated, user, orders } = useAuth();

  return (
    <div className="w-full">
      {/* SECTION 1 — HERO (Guest View) OR GREETINGS & STATS CARD (Dashboard View) */}
      {isAuthenticated ? (
        <DashboardGreetingSection user={user} orders={orders} />
      ) : (
        <HeroSection />
      )}

      {/* SECTION 2 — SHOPPING CLASSES (Audience & Style horizontal shortcut strip) */}
      <ShoppingClassesStrip />

      {/* SECTION 3 — NEW ARRIVALS */}
      <NewArrivalsSection products={INITIAL_PRODUCTS} />

      {/* SECTION 4 — COMPLETE YOUR LOOK (Up to 30% Off) */}
      <CompleteLookBanner />

      {/* SECTION 5 — ALL PRODUCTS / SHOP EVERYTHING */}
      <AllProductsCatalogue
        products={INITIAL_PRODUCTS}
        title="All Products"
        subtitle="Explore the entire collection in and around Egerton"
      />

      {/* SECTION 6 — 2 PHYSICAL CAMPUS STORES & FITTING ROOM GUIDANCE */}
      <PhysicalStoresSection />

      {/* SECTION 7 — BENEFITS STRIP */}
      <BenefitsStrip />
    </div>
  );
};
