import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Check,
  X,
  Users,
  Clock,
  Calendar,
  Video,
  MessageCircle,
  Award,
  BookOpen,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const comparisonFeatures = [
  {
    feature: "Duration",
    cohort: "8-16 weeks (structured)",
    selfPaced: "Flexible (learn anytime)",
    cohortIcon: Calendar,
    selfPacedIcon: Clock,
  },
  {
    feature: "Format",
    cohort: "Live sessions + recorded content",
    selfPaced: "100% pre-recorded videos",
    cohortIcon: Video,
    selfPacedIcon: BookOpen,
  },
  {
    feature: "Start Dates",
    cohort: "Fixed cohort schedule",
    selfPaced: "Start immediately",
    cohortIcon: Calendar,
    selfPacedIcon: Zap,
  },
  {
    feature: "Mentorship",
    cohort: true,
    selfPaced: false,
  },
  {
    feature: "Peer Learning",
    cohort: true,
    selfPaced: false,
  },
  {
    feature: "Live Q&A Sessions",
    cohort: true,
    selfPaced: false,
  },
  {
    feature: "Capstone Project",
    cohort: true,
    selfPaced: false,
  },
  {
    feature: "Community Access",
    cohort: true,
    selfPaced: true,
  },
  {
    feature: "Certificate",
    cohort: "Diploma Certificate",
    selfPaced: "Completion Certificate",
    cohortIcon: Award,
    selfPacedIcon: Award,
  },
  {
    feature: "Best For",
    cohort: "Structured learners seeking accountability",
    selfPaced: "Busy professionals with flexible schedules",
    cohortIcon: Users,
    selfPacedIcon: Clock,
  },
];

export function ProgramComparisonSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <BookOpen className="w-4 h-4" />
            Choose Your Path
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Compare Learning Formats
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Not sure which format is right for you? Compare our cohort-based programs 
            with self-paced courses to find your perfect fit.
          </p>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          {/* Desktop Table */}
          <div className="hidden md:block overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-muted/50">
              <div className="p-6 font-semibold text-foreground border-r border-border">
                Features
              </div>
              <div className="p-6 text-center border-r border-border">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold mb-2">
                  <Users className="w-4 h-4" />
                  Cohort Programs
                </div>
                <p className="text-sm text-muted-foreground">Collaborative learning</p>
              </div>
              <div className="p-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold text-foreground font-semibold mb-2">
                  <Clock className="w-4 h-4" />
                  Self-Paced Courses
                </div>
                <p className="text-sm text-muted-foreground">Learn at your own pace</p>
              </div>
            </div>

            {/* Table Body */}
            {comparisonFeatures.map((item, index) => (
              <motion.div
                key={item.feature}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                className="grid grid-cols-3 border-t border-border hover:bg-muted/30 transition-colors"
              >
                <div className="p-5 font-medium text-foreground border-r border-border">
                  {item.feature}
                </div>
                <div className="p-5 text-center border-r border-border">
                  {typeof item.cohort === "boolean" ? (
                    item.cohort ? (
                      <Check className="w-6 h-6 text-success mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-muted-foreground/50 mx-auto" />
                    )
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-foreground">
                      {item.cohortIcon && <item.cohortIcon className="w-4 h-4 text-primary" />}
                      <span className="text-sm">{item.cohort}</span>
                    </div>
                  )}
                </div>
                <div className="p-5 text-center">
                  {typeof item.selfPaced === "boolean" ? (
                    item.selfPaced ? (
                      <Check className="w-6 h-6 text-success mx-auto" />
                    ) : (
                      <X className="w-6 h-6 text-muted-foreground/50 mx-auto" />
                    )
                  ) : (
                    <div className="flex items-center justify-center gap-2 text-foreground">
                      {item.selfPacedIcon && <item.selfPacedIcon className="w-4 h-4 text-gold" />}
                      <span className="text-sm">{item.selfPaced}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}

            {/* CTA Row */}
            <div className="grid grid-cols-3 border-t border-border bg-muted/30">
              <div className="p-6"></div>
              <div className="p-6 text-center border-x border-border">
                <Button asChild className="bg-primary hover:bg-primary/90">
                  <Link to="/courses?type=cohort">View Cohort Programs</Link>
                </Button>
              </div>
              <div className="p-6 text-center">
                <Button asChild variant="outline" className="border-gold text-foreground hover:bg-gold/10">
                  <Link to="/courses?type=self_paced">View Self-Paced Courses</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-6">
            {/* Cohort Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card border-2 border-primary rounded-2xl overflow-hidden"
            >
              <div className="p-6 bg-primary text-primary-foreground text-center">
                <div className="inline-flex items-center gap-2 font-bold text-lg mb-1">
                  <Users className="w-5 h-5" />
                  Cohort Programs
                </div>
                <p className="text-sm opacity-90">Collaborative, structured learning</p>
              </div>
              <div className="p-6 space-y-4">
                {comparisonFeatures.map((item) => (
                  <div key={`cohort-${item.feature}`} className="flex items-start justify-between gap-4">
                    <span className="text-sm font-medium text-muted-foreground">{item.feature}</span>
                    <div className="text-right">
                      {typeof item.cohort === "boolean" ? (
                        item.cohort ? (
                          <Check className="w-5 h-5 text-success" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/50" />
                        )
                      ) : (
                        <span className="text-sm text-foreground">{item.cohort}</span>
                      )}
                    </div>
                  </div>
                ))}
                <Button asChild className="w-full mt-4 bg-primary hover:bg-primary/90">
                  <Link to="/courses?type=cohort">View Cohort Programs</Link>
                </Button>
              </div>
            </motion.div>

            {/* Self-Paced Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card border-2 border-gold rounded-2xl overflow-hidden"
            >
              <div className="p-6 bg-gold text-foreground text-center">
                <div className="inline-flex items-center gap-2 font-bold text-lg mb-1">
                  <Clock className="w-5 h-5" />
                  Self-Paced Courses
                </div>
                <p className="text-sm opacity-90">Flexible, learn on your schedule</p>
              </div>
              <div className="p-6 space-y-4">
                {comparisonFeatures.map((item) => (
                  <div key={`self-${item.feature}`} className="flex items-start justify-between gap-4">
                    <span className="text-sm font-medium text-muted-foreground">{item.feature}</span>
                    <div className="text-right">
                      {typeof item.selfPaced === "boolean" ? (
                        item.selfPaced ? (
                          <Check className="w-5 h-5 text-success" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground/50" />
                        )
                      ) : (
                        <span className="text-sm text-foreground">{item.selfPaced}</span>
                      )}
                    </div>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full mt-4 border-gold hover:bg-gold/10">
                  <Link to="/courses?type=self_paced">View Self-Paced Courses</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Help text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-muted-foreground mt-8"
        >
          Still not sure?{" "}
          <Link to="/contact" className="text-primary hover:underline font-medium">
            Talk to our learning advisors
          </Link>{" "}
          for personalized guidance.
        </motion.p>
      </div>
    </section>
  );
}
