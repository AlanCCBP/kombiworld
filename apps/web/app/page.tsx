import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import ForWho from "@/components/ForWho";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Hero />
      <HowItWorks />
      <ForWho />
      <CTA />
      <Footer />
    </main>
  );
}
