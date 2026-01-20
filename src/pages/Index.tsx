import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSectionEnhanced } from "@/components/home/HeroSectionEnhanced";
import { CourseCarousel } from "@/components/home/CourseCarousel";
import { LearningPathsSection } from "@/components/home/LearningPathsSection";
import { TopicsSection } from "@/components/home/TopicsSection";
import { StatsSection } from "@/components/home/StatsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FinalCTASection } from "@/components/home/FinalCTASection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSectionEnhanced />
        <StatsSection />
        <CourseCarousel />
        <LearningPathsSection />
        <TopicsSection />
        <TestimonialsSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
