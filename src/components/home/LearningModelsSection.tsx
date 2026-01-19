import { motion } from "framer-motion";
import { Users, Clock, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const learningModels = [
  {
    id: "cohort",
    title: "Cohort-Based Learning",
    description: "Join a structured program with peers, live sessions, and expert facilitators. Perfect for deep learning and networking.",
    icon: Users,
    features: [
      "Live weekly sessions with experts",
      "Peer collaboration & networking",
      "Structured 8-12 week programs",
      "Capstone projects with feedback",
      "Certificate upon completion",
    ],
    badge: "Most Popular",
    badgeColor: "bg-secondary text-secondary-foreground",
    cta: "View Cohort Programs",
    href: "/courses?type=cohort",
    gradient: "from-secondary/10 to-secondary/5",
    borderColor: "border-secondary/30",
    iconBg: "bg-secondary/20",
    iconColor: "text-secondary",
  },
  {
    id: "self-paced",
    title: "Self-Paced Learning",
    description: "Learn at your own pace with on-demand video content, quizzes, and flexible scheduling. Start anytime.",
    icon: Clock,
    features: [
      "Learn anytime, anywhere",
      "Video lessons & resources",
      "Progress at your own speed",
      "Quizzes & assessments",
      "Certificate upon completion",
    ],
    badge: "Flexible",
    badgeColor: "bg-gold/20 text-foreground",
    cta: "Browse Self-Paced Courses",
    href: "/courses?type=self-paced",
    gradient: "from-gold/10 to-gold/5",
    borderColor: "border-gold/30",
    iconBg: "bg-gold/20",
    iconColor: "text-gold",
  },
];

export function LearningModelsSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Learning Models
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Learning Path
          </h2>
          <p className="text-muted-foreground text-lg">
            Whether you thrive in collaborative environments or prefer independent study, 
            we have the perfect format for your learning journey.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {learningModels.map((model, index) => (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="group"
            >
              <div
                className={cn(
                  "relative h-full rounded-2xl border-2 p-8 transition-all duration-300",
                  "bg-gradient-to-br hover:shadow-lg hover:-translate-y-1",
                  model.gradient,
                  model.borderColor
                )}
              >
                {/* Badge */}
                <span
                  className={cn(
                    "absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-semibold",
                    model.badgeColor
                  )}
                >
                  {model.badge}
                </span>

                {/* Icon */}
                <div
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-6",
                    model.iconBg
                  )}
                >
                  <model.icon className={cn("w-7 h-7", model.iconColor)} />
                </div>

                {/* Content */}
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                  {model.title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {model.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {model.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className={cn("w-5 h-5 mt-0.5 shrink-0", model.iconColor)} />
                      <span className="text-foreground text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  asChild
                  variant="outline"
                  className={cn(
                    "w-full group/btn border-2",
                    model.borderColor,
                    "hover:bg-card"
                  )}
                >
                  <Link to={model.href}>
                    {model.cta}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
