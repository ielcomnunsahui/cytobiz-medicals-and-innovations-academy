import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  GraduationCap, 
  Users, 
  Target, 
  Globe, 
  Award, 
  MessageCircle 
} from "lucide-react";

const reasons = [
  {
    icon: Target,
    title: "Practical Learning",
    description: "Every course is designed around real-world healthcare challenges, not abstract theory. Apply what you learn immediately.",
  },
  {
    icon: GraduationCap,
    title: "Expert Facilitators",
    description: "Learn from practicing healthcare leaders, researchers, and innovators with decades of combined experience.",
  },
  {
    icon: Users,
    title: "Peer Community",
    description: "Join a global network of healthcare professionals. Collaborate, share insights, and build lasting connections.",
  },
  {
    icon: Award,
    title: "Recognized Credentials",
    description: "Earn certificates that demonstrate your expertise. Verified credentials you can share with employers and networks.",
  },
  {
    icon: MessageCircle,
    title: "Personalized Support",
    description: "Get guidance from dedicated advisors. We're here to help you choose the right path and succeed.",
  },
  {
    icon: Globe,
    title: "Global Perspective",
    description: "Courses draw from healthcare systems worldwide. Gain insights applicable across diverse contexts and settings.",
  },
];

export function WhyChooseSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-muted/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium mb-3 text-sm uppercase tracking-wider">
            Why Cytobiz Academy
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Education That Makes a Difference
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We're committed to developing healthcare leaders who drive meaningful change
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <reason.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-2">
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
