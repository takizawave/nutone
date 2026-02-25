import { Header } from "../components/Header";
import { HeroSection } from "../components/HeroSection";
import { PromiseSection } from "../components/PromiseSection";
import { ServicesSection } from "../components/ServicesSection";
import { FeaturesSection } from "../components/FeaturesSection";
import { PortfolioSection } from "../components/PortfolioSection";
import { CompanySection } from "../components/CompanySection";
import { NewsTicker } from "../components/NewsTicker";
import { ContactSection } from "../components/ContactSection";
import { Footer } from "../components/Footer";

export function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--void)] relative">
      <Header />
      <HeroSection />
      <PromiseSection />
      <ServicesSection />
      <FeaturesSection />
      <PortfolioSection />
      <CompanySection />
      <NewsTicker />
      <ContactSection />
      <Footer />
    </div>
  );
}
