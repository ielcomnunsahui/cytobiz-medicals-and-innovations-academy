import { motion } from "framer-motion";
import { Award, Download, Share2, Shield, BadgeCheck, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

interface CertificatePreviewProps {
  courseType: "cohort" | "self_paced";
  courseTitle: string;
}

export function CertificatePreview({ courseType, courseTitle }: CertificatePreviewProps) {
  const certificateType = courseType === "cohort" ? "Diploma" : "Completion";

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">
        Your Certificate
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8 items-center">
        {/* Certificate Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative bg-gradient-to-br from-card via-card to-muted border-2 border-primary/20 rounded-xl p-8 shadow-2xl">
            {/* Certificate Border Pattern */}
            <div className="absolute inset-2 border border-dashed border-primary/20 rounded-lg pointer-events-none" />
            
            {/* Certificate Content */}
            <div className="text-center space-y-4 relative z-10">
              {/* Logo/Award Icon */}
              <div className="flex justify-center mb-4">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg"
                >
                  <Award className="w-8 h-8 text-primary-foreground" />
                </motion.div>
              </div>
              
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground font-medium">
                Certificate of {certificateType}
              </div>
              
              <div className="text-lg font-serif text-foreground">
                This is to certify that
              </div>
              
              <div className="text-xl font-bold text-primary border-b border-primary/30 pb-2 mx-8">
                [Your Name]
              </div>
              
              <div className="text-sm text-muted-foreground">
                has successfully completed
              </div>
              
              <div className="text-lg font-semibold text-foreground leading-tight">
                {courseTitle}
              </div>
              
              {/* Accreditation Logos */}
              <div className="flex justify-center gap-6 pt-4 mt-4 border-t border-border">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">WAHBS</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-gold" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">SDCC</span>
                </div>
              </div>
            </div>
            
            {/* Decorative Corner Elements */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/30 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/30 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/30 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30 rounded-br-lg" />
            
            {/* Verified Badge */}
            <div className="absolute -top-3 -right-3 bg-success text-success-foreground text-xs font-medium px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
              <BadgeCheck className="w-3 h-3" />
              Verified
            </div>
          </div>
        </motion.div>

        {/* Certificate Info */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Upon completion, you'll receive:
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Award className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-foreground">
                    {certificateType} Certificate
                  </span>
                  <p className="text-sm text-muted-foreground">
                    {courseType === "cohort" 
                      ? "Official diploma recognizing your expertise and commitment"
                      : "Digital certificate verifying your course completion"
                    }
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Download className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Downloadable PDF</span>
                  <p className="text-sm text-muted-foreground">
                    High-resolution certificate ready for printing or sharing
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Linkedin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-foreground">LinkedIn Ready</span>
                  <p className="text-sm text-muted-foreground">
                    One-click sharing to your LinkedIn profile
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* Accreditation Info */}
          <div className="p-4 rounded-xl bg-muted/50 border border-border">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Accredited By
            </h4>
            <div className="space-y-2">
              <Link 
                to="/partners" 
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    West Africa Health Business Society (WAHBS)
                  </p>
                </div>
              </Link>
              <Link 
                to="/partners" 
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                  <BadgeCheck className="w-4 h-4 text-gold" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Skill Development Council Canada (SDCC)
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
