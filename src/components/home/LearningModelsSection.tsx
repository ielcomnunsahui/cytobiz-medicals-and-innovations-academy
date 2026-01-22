import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Users, User, Calendar, Clock, CheckCircle, Video, BookOpen, GraduationCap, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const learningModels = [
  {
    id: "cohort",
    icon: Users,
    title: "Cohort-Based Programs",
    tagline: "Live & Interactive",
    description: "Live, time-bound learning with facilitators, peer collaboration, capstone projects, and graduation.",
    features: [
      { icon: Calendar, text: "Fixed start dates" },
      { icon: Video, text: "Live sessions" },
      { icon: Users, text: "Peer collaboration" },
      { icon: GraduationCap, text: "Graduation ceremony" },
    ],
    cta: "View Cohort Programs",
    ctaLink: "/courses?type=cohort",
    gradient: "from-primary via-primary to-primary/80",
  },
  {
    id: "self-paced",
    icon: User,
    title: "Self-Paced Courses",
    tagline: "Flexible & On-Demand",
    description: "Flexible, on-demand learning with recorded content, assessments, and certification at your own pace.",
    features: [
      { icon: Clock, text: "Start anytime" },
      { icon: BookOpen, text: "Recorded content" },
      { icon: CheckCircle, text: "Assessments" },
      { icon: Award, text: "Certification" },
    ],
    cta: "Explore Self-Paced",
    ctaLink: "/courses?type=self-paced",
    gradient: "from-gold via-gold to-warning",
  },
];

export function LearningModelsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="container-wide relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            className="text-primary font-medium mb-4 text-sm uppercase tracking-widest"
          >
            Our Course Types
          </motion.p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Choose Your Learning Path
          </h2>
          <p className="text-lg text-muted-foreground">
            Select the format that fits your schedule, goals, and learning style
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {learningModels.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              <div className="relative bg-card rounded-3xl border border-border overflow-hidden transition-all duration-500 hover:border-transparent hover:shadow-2xl">
                {/* Gradient top bar */}
                <div className={`h-1.5 bg-gradient-to-r ${model.gradient}`} />
                
                {/* Hover glow effect */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${model.gradient} blur-3xl -z-10`} style={{ transform: 'scale(0.8)' }} />

                <div className="p-8 md:p-10">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div 
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${model.gradient} flex items-center justify-center shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <model.icon className="w-7 h-7 text-white" />
                    </motion.div>
                    <div>
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {model.tagline}
                      </span>
                      <h3 className="font-display text-2xl font-bold text-foreground mt-1">
                        {model.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                    {model.description}
                  </p>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    {model.features.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                          <feature.icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {feature.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button
                    asChild
                    size="lg"
                    className={`w-full bg-gradient-to-r ${model.gradient} hover:opacity-90 text-white border-0 h-14 text-base font-semibold group/btn transition-all duration-300`}
                  >
                    <Link to={model.ctaLink}>
                      {model.cta}
                      <ArrowRight className="w-5 h-5 ml-2 group-hover/btn:translate-x-1.5 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center text-muted-foreground mt-12"
        >
          Not sure which format is right for you?{" "}
          <Link to="/contact" className="text-primary hover:underline font-medium">
            Speak with an advisor
          </Link>
        </motion.p>
      </div>
    </section>
  );
}
