import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, ArrowRight, Twitter, Linkedin, Instagram, Youtube, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logoIcon from "@/assets/logo-icon.png";

const footerLinks = {
  learning: [
    { name: "All Courses", href: "/courses" },
    { name: "Cohort Programs", href: "/courses?type=cohort" },
    { name: "Self-Paced", href: "/courses?type=self-paced" },
    { name: "Certifications", href: "/certifications" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Team", href: "/team" },
    { name: "Contact", href: "/contact" },
  ],
  resources: [
    { name: "Alumni Network", href: "/alumni" },
    { name: "Partners", href: "/partners" },
    { name: "FAQ", href: "/faq" },
    { name: "Install App", href: "/install" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "Instagram", icon: Instagram, href: "#" },
  { name: "YouTube", icon: Youtube, href: "#" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async () => {
    if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setIsSubscribing(true);
    try {
      // Send welcome email
      await supabase.functions.invoke("send-enrollment-email", {
        body: {
          type: "newsletter_welcome",
          userEmail: email,
          userName: email.split("@")[0],
        },
      });
      setSubscribed(true);
      toast.success("🎉 Subscription Confirmed! Welcome to Cytobiz Medical & Innovation Academy.");
    } catch (err) {
      console.error("Subscribe error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-navy text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container-wide py-12 md:py-16">
          {subscribed ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">🎉 Subscription Confirmed!</h3>
              <p className="text-white/70 max-w-lg mx-auto">
                Welcome to Cytobiz Medical & Innovation Academy. You'll now receive updates on new courses, innovation insights, and exclusive learning opportunities directly in your inbox.
              </p>
              <p className="text-white/50 text-sm mt-3">Stay ahead in healthcare innovation.</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="max-w-lg">
                <h3 className="font-display text-2xl md:text-3xl font-bold mb-3">
                  Stay Ahead in Healthcare Innovation
                </h3>
                <p className="text-white/70">
                  Get the latest courses, insights, and industry updates delivered to your inbox.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 max-w-sm focus:border-primary focus:ring-primary"
                />
                <Button
                  className="bg-primary hover:bg-primary/90 text-white shrink-0 shadow-lg"
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                >
                  {isSubscribing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4 mr-2" />
                  )}
                  Subscribe
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img 
                src={logoIcon} 
                alt="Cytobiz Logo" 
                className="h-10 w-10 object-contain brightness-0 invert"
              />
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight">
                  Cytobiz
                </span>
                <span className="text-xs font-medium text-white/70 leading-tight">
                  Medical Academy
                </span>
              </div>
            </Link>
            <p className="text-white/70 text-sm mb-6 max-w-xs leading-relaxed">
              Practical, innovation-driven medical education for healthcare leaders building the future of patient care.
            </p>
            <div className="space-y-3 text-sm text-white/70">
              <a href="mailto:hello@cytobiz.academy" className="flex items-center gap-3 hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
                <span>hello@cytobiz.academy</span>
              </a>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4" />
                <span>Global Online Learning</span>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          <div>
            <h4 className="font-semibold mb-4 text-white">Learning</h4>
            <ul className="space-y-3">
              {footerLinks.learning.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-wide py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Cytobiz Medical & Innovation Academy. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-white/60">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
