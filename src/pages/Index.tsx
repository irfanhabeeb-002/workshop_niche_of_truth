import Hero from "@/components/Hero";
import EventDetails from "@/components/EventDetails";
import RegistrationForm from "@/components/RegistrationForm";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";

const Index = () => {
  return (
    <div className="min-h-screen w-full">
      <Hero />
      <EventDetails />
      <RegistrationForm />
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Index;
