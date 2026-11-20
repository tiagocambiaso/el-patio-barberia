import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/features/hero/HeroSection";
import { ServiciosSection } from "@/features/servicios/ServiciosSection";
import { TurnosSection } from "@/features/turnos/TurnosSection";
import { ContactoSection } from "@/features/contacto/ContactoSection";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ServiciosSection />
        <TurnosSection />
        <ContactoSection />
      </main>
      <Footer />
    </>
  );
}
