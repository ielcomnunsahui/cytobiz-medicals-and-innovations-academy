import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { WhatWeDoSection } from "@/components/home/WhatWeDoSection";
import { LearningModelsSection } from "@/components/home/LearningModelsSection";
import { LearningAreasSection } from "@/components/home/LearningAreasSection";
import { FeaturedCoursesSection } from "@/components/home/FeaturedCoursesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { WhoCanApplySection } from "@/components/home/WhoCanApplySection";
import { WhyChooseSection } from "@/components/home/WhyChooseSection";
import { CertificationSection } from "@/components/home/CertificationSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { FinalCTASection } from "@/components/home/FinalCTASection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* 1. Hero - Authority + Impact Statement */}
        <HeroSection />
        
        {/* 2. What We Do - Mission Statement */}
        <WhatWeDoSection />
        
        {/* 3. Course Types - Cohort vs Self-Paced */}
        <LearningModelsSection />
        
        {/* 4. Learning Areas - Explore by Specialty */}
        <LearningAreasSection />
        
        {/* 5. Featured Courses - Entry Points */}
        <FeaturedCoursesSection />
        
        {/* 6. How Learning Works - Process Steps */}
        <HowItWorksSection />
        
        {/* 7. Who Can Apply - Target Audience */}
        <WhoCanApplySection />
        
        {/* 8. Why Choose - Value Propositions */}
        <WhyChooseSection />
        
        {/* 9. Certification - Credential Value */}
        <CertificationSection />
        
        {/* 10. Testimonials - Social Proof */}
        <TestimonialsSection />
        
        {/* 11. Final CTA - Conversion */}
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
