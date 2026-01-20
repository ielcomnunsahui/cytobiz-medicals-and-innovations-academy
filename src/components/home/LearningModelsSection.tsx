import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Users, User, Calendar, Clock, CheckCircle, Video, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const learningModels = [
  {
    id: "cohort",
    badge: "Live & Interactive",
    icon: Users,
    title: "Cohort-Based Programs",
    subtitle: "Structured learning with peers",
    description: "Join a community of learners progressing together. Experience live sessions, peer collaboration, and expert mentorship in time-bound programs.",
    features: [
      { icon: Calendar, text: "Fixed start dates with structured schedules" },
      { icon: Video, text: "Live sessions and interactive workshops" },
      { icon: Users, text: "Peer collaboration and networking" },
      { icon: CheckCircle, text: "Direct access to facilitators" },
    ],
    cta: "View Cohort Programs",
    ctaLink: "/courses?type=cohort",
    accent: "from-primary to-primary/80",
    bgAccent: "bg-primary/5",
  },
  {
    id: "self-paced",
    badge: "Flexible & On-Demand",
    icon: User,
    title: "Self-Paced Courses",
    subtitle: "Learn at your own schedule",
    description: "Access comprehensive content anytime, anywhere. Progress through courses at your own pace with lifetime access to materials and updates.",
    features: [
      { icon: Clock, text: "Start immediately, learn anytime" },
      { icon: BookOpen, text: "Lifetime access to all materials" },
      { icon: CheckCircle, text: "Complete at your own pace" },
      { icon: Users, text: "Community forum support" },
    ],
    cta: "Explore Self-Paced",
    ctaLink: "/courses?type=self-paced",
    accent: "from-gold to-warning",
    bgAccent: "bg-gold/5",
  },
];

export function LearningModelsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium mb-3 text-sm uppercase tracking-wider">
            How You'll Learn
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Learning Model
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Select the format that fits your schedule, goals, and learning style
          </p>
        </motion.div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {learningModels.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`group relative rounded-2xl border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden ${model.bgAccent}`}
            >
              {/* Gradient Border Top */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${model.accent}`} />

              <div className="p-8">
                {/* Badge */}
                <Badge variant="secondary" className="mb-4 text-xs font-medium">
                  {model.badge}
                </Badge>

                {/* Icon & Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${model.accent} flex items-center justify-center flex-shrink-0`}>
                    <model.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {model.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{model.subtitle}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {model.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {model.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-foreground">
                      <feature.icon className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature.text}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground group/btn"
                >
                  <Link to={model.ctaLink}>
                    {model.cta}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center text-muted-foreground mt-10 text-sm"
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
