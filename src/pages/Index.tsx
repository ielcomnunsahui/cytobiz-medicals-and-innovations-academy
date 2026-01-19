import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { LearningModelsSection } from "@/components/home/LearningModelsSection";
import { LearningAreasSection } from "@/components/home/LearningAreasSection";
import { FeaturedCoursesSection } from "@/components/home/FeaturedCoursesSection";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <LearningModelsSection />
        <FeaturedCoursesSection />
        <LearningAreasSection />
        <WhyChooseSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
