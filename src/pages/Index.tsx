import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { LearningModelsSection } from "@/components/home/LearningModelsSection";
import { FeaturedCoursesSection } from "@/components/home/FeaturedCoursesSection";
import { PracticeAreasSection } from "@/components/home/PracticeAreasSection";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FinalCTASection } from "@/components/home/FinalCTASection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* 1. Hero - Authority + Clarity */}
        <HeroSection />
        
        {/* 2. Stats - Trust Section */}
        <StatsSection />
        
        {/* 3. Learning Models - Cohort vs Self-Paced */}
        <LearningModelsSection />
        
        {/* 4. Featured Courses - Guided Entry */}
        <FeaturedCoursesSection />
        
        {/* 5. Practice Areas - Exploration */}
        <PracticeAreasSection />
        
        {/* 6. Why Choose - Trust Reinforcement */}
        <WhyChooseSection />
        
        {/* 7. Testimonials - Social Proof */}
        <TestimonialsSection />
        
        {/* 8. Final CTA - Conversion */}
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
