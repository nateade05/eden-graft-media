import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HomeScrollRestore from "@/components/HomeScrollRestore";
import CredibilityStrip from "@/components/CredibilityStrip";
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import Process from "@/components/Process";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative bg-[#F7F6F2] min-h-screen">
      <HomeScrollRestore />
      <Navbar />
      <Hero />
      <CredibilityStrip />
      <Services />
      <Portfolio />
      <Process />
      <FinalCTA />
      <Footer />
    </main>
  );
}
