import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  Target, 
  Users, 
  Lightbulb, 
  GraduationCap, 
  Heart,
  Award 
} from "lucide-react";

const reasons = [
  {
    icon: Target,
    title: "Practical, Case-Based Learning",
    description: "Every course is designed around real healthcare challenges, not abstract theory.",
  },
  {
    icon: Heart,
    title: "Real Healthcare Problems",
    description: "Work on actual public health and healthcare innovation challenges.",
  },
  {
    icon: Lightbulb,
    title: "Innovation-Driven Approach",
    description: "Project-based learning that encourages creative problem-solving.",
  },
  {
    icon: GraduationCap,
    title: "Expert Facilitators & Mentors",
    description: "Learn from practicing healthcare leaders and researchers.",
  },
  {
    icon: Users,
    title: "Strong Learning Community",
    description: "Connect with peers and join our growing alumni network.",
  },
  {
    icon: Award,
    title: "Recognized Certification",
    description: "Earn a Certificate of Completion from Cytobiz Academy.",
  },
];

export function WhyChooseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-background relative">
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium mb-4 text-sm uppercase tracking-widest">
            Why Cytobiz Academy
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Education That Makes a Difference
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're committed to developing healthcare leaders who drive meaningful change
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group"
            >
              <div className="flex gap-5">
                <motion.div 
                  className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <reason.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors" />
                </motion.div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {reason.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
