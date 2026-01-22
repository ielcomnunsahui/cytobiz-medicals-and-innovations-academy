import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { UserPlus, MonitorPlay, ClipboardCheck, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Register for a Course",
    description: "Browse our catalog and enroll in a program that matches your goals",
  },
  {
    number: "02",
    icon: MonitorPlay,
    title: "Get Onboarded",
    description: "Access the learning platform and connect with your cohort or materials",
  },
  {
    number: "03",
    icon: ClipboardCheck,
    title: "Learn & Complete Projects",
    description: "Attend sessions, complete assignments, and apply your knowledge",
  },
  {
    number: "04",
    icon: Award,
    title: "Get Certified",
    description: "Receive your certificate and join our alumni network",
  },
];

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-hero-gradient relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent" />
      </div>

      <div className="container-wide relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-primary-foreground/60 font-medium mb-4 text-sm uppercase tracking-widest">
            How Learning Works
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
            Your Journey to Success
          </h2>
          <p className="text-lg text-primary-foreground/50 max-w-2xl mx-auto">
            A simple, structured path from enrollment to certification
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-full w-full h-px">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-white/30 to-transparent"
                    initial={{ scaleX: 0, originX: 0 }}
                    animate={isInView ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.2 }}
                  />
                </div>
              )}

              <div className="text-center">
                {/* Step number & Icon */}
                <motion.div 
                  className="relative mx-auto w-24 h-24 mb-6"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 rotate-3 group-hover:rotate-6 transition-transform" />
                  <div className="absolute inset-0 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 -rotate-3 group-hover:-rotate-6 transition-transform" />
                  <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md flex items-center justify-center border border-white/20">
                    <step.icon className="w-10 h-10 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground border-2 border-white/20">
                    {step.number}
                  </span>
                </motion.div>

                <h3 className="font-display text-xl font-semibold text-primary-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-primary-foreground/50 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            className="bg-white text-foreground hover:bg-white/90 h-14 px-10 text-base font-semibold group"
          >
            <Link to="/courses">
              Start Learning Today
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
