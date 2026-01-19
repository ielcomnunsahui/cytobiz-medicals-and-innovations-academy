import { motion } from "framer-motion";
import { 
  GraduationCap, 
  Users, 
  Briefcase, 
  Award,
  Shield,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: GraduationCap,
    title: "Expert-Led Curriculum",
    description: "Learn from practicing physicians, researchers, and industry leaders who bring real-world experience to every lesson.",
  },
  {
    icon: Users,
    title: "Global Community",
    description: "Connect with healthcare professionals worldwide. Build relationships that last beyond the classroom.",
  },
  {
    icon: Briefcase,
    title: "Career Impact",
    description: "Practical projects and capstones designed to enhance your portfolio and advance your career trajectory.",
  },
  {
    icon: Award,
    title: "Recognized Credentials",
    description: "Earn certificates valued by employers, institutions, and healthcare organizations globally.",
  },
  {
    icon: Shield,
    title: "Evidence-Based Approach",
    description: "Curriculum grounded in the latest research, clinical guidelines, and best practices in healthcare education.",
  },
  {
    icon: Zap,
    title: "Innovation Focus",
    description: "Stay ahead with cutting-edge content on AI, digital health, and emerging technologies in medicine.",
  },
];

export function WhyChooseSection() {
  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
              Why Cytobiz
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              Education Designed for{" "}
              <span className="text-secondary">Real-World Impact</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              We don't just teach theory. Every course is designed to help you 
              apply knowledge immediately in clinical settings, research projects, 
              or healthcare innovation initiatives.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.slice(0, 4).map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="shrink-0 w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden">
              {/* Main Image Placeholder */}
              <div className="aspect-[4/3] bg-gradient-to-br from-primary via-navy-light to-secondary/80 rounded-2xl p-8 flex items-end">
                <div className="w-full">
                  <div className="grid grid-cols-2 gap-4">
                    {features.slice(4).map((feature, index) => (
                      <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.15 }}
                        className="bg-card/95 backdrop-blur-lg rounded-xl p-4"
                      >
                        <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                          <feature.icon className="w-5 h-5 text-secondary" />
                        </div>
                        <h4 className="font-semibold text-card-foreground text-sm mb-1">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {feature.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gold/20 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
