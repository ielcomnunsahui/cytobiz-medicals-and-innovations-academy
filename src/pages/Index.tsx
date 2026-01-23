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
import { PartnersSection } from "@/components/home/PartnersSection";
import { ProgramComparisonSection } from "@/components/home/ProgramComparisonSection";
import { GraduateEmployersSection } from "@/components/home/GraduateEmployersSection";
const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* 1. Hero - Authority + Impact Statement */}
        <HeroSection />
        
        {/* 2. Partners - Trust Signals */}
        <PartnersSection />
        
        {/* 3. What We Do - Mission Statement */}
        <WhatWeDoSection />
        
        {/* 4. Course Types - Cohort vs Self-Paced */}
        <LearningModelsSection />
        
        {/* 5. Learning Areas - Explore by Specialty */}
        <LearningAreasSection />
        
        {/* 6. Featured Courses - Entry Points */}
        <FeaturedCoursesSection />
        
        {/* 7. Program Comparison - Side by Side */}
        <ProgramComparisonSection />
        
        {/* 8. How Learning Works - Process Steps */}
        <HowItWorksSection />
        
        {/* 9. Who Can Apply - Target Audience */}
        <WhoCanApplySection />
        
        {/* 10. Why Choose - Value Propositions */}
        <WhyChooseSection />
        
        {/* 11. Certification - Credential Value */}
        <CertificationSection />
        
        {/* 12. Testimonials - Social Proof */}
        <TestimonialsSection />
        
        {/* 13. Where Our Learners Work - Career Outcomes */}
        <GraduateEmployersSection />
        
        {/* 14. Final CTA - Conversion */}
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
