import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, CheckCircle, Download, Share2, Shield, BadgeCheck } from "lucide-react";

const accreditations = [
  {
    type: "Certified by",
    name: "West Africa Health Business Society",
    icon: Shield,
  },
  {
    type: "Accredited by",
    name: "Skill Development Council Canada",
    icon: BadgeCheck,
  },
];

export function CertificationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-muted/30">
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Certificate Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative max-w-md mx-auto">
              {/* Certificate mockup */}
              <motion.div
                className="relative bg-card border-2 border-border rounded-2xl p-8 shadow-2xl"
                whileHover={{ y: -8, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {/* Header decoration */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary via-primary/80 to-primary rounded-t-xl" />
                
                {/* Certificate content */}
                <div className="text-center pt-4">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6"
                  >
                    <Award className="w-8 h-8 text-primary" />
                  </motion.div>
                  
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                    Certificate of Completion
                  </p>
                  <h4 className="font-display text-xl font-bold text-foreground mb-4">
                    Cytobiz Medical & Innovation Academy
                  </h4>
                  
                  <div className="w-32 h-1 bg-gradient-to-r from-primary/30 via-primary to-primary/30 mx-auto mb-4 rounded-full" />
                  
                  <p className="text-sm text-muted-foreground mb-6">
                    This certifies that the holder has successfully completed all requirements
                  </p>
                  
                  {/* Signature line */}
                  <div className="flex justify-between items-end pt-4 border-t border-border mt-4">
                    <div className="text-left">
                      <div className="w-24 h-px bg-foreground/30 mb-1" />
                      <p className="text-xs text-muted-foreground">Director</p>
                    </div>
                    <div className="text-right">
                      <div className="w-24 h-px bg-foreground/30 mb-1" />
                      <p className="text-xs text-muted-foreground">Date</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -top-4 -right-4 bg-success text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                Verified
              </motion.div>
            </div>
          </motion.div>

          {/* Right - Content */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="text-primary font-medium mb-4 text-sm uppercase tracking-widest"
            >
              Certification
            </motion.p>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight"
            >
              Earn Your
              <br />
              <span className="text-primary">Certificate</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
            >
              Participants who meet course requirements receive a Certificate of Completion 
              from Cytobiz Medical & Innovation Academy. Showcase your achievement and 
              join our growing network of certified professionals.
            </motion.p>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {[
                { icon: CheckCircle, text: "Verified digital certificate" },
                { icon: Download, text: "Download and print anytime" },
                { icon: Share2, text: "Share on LinkedIn and portfolios" },
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Accreditations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
              className="pt-6 border-t border-border"
            >
              <p className="text-sm text-muted-foreground uppercase tracking-widest mb-4">
                Accreditations & Certifications
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {accreditations.map((acc, index) => (
                  <motion.div
                    key={acc.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <acc.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{acc.type}</p>
                      <p className="text-sm font-medium text-foreground">{acc.name}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
