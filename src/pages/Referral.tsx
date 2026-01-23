import { motion } from "framer-motion";
import { Gift, Wallet, Users, Share2, CheckCircle2, ArrowRight, Copy, Sparkles } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

const howItWorks = [
  {
    step: 1,
    icon: Share2,
    title: "Sign Up",
    description: "Register for our referral program and get your unique referral link."
  },
  {
    step: 2,
    icon: Users,
    title: "Share & Refer",
    description: "Share your link with friends, family, or your network who want to learn."
  },
  {
    step: 3,
    icon: Wallet,
    title: "Earn Rewards",
    description: "Get commission for every successful enrollment through your referral."
  }
];

const rewardTiers = [
  {
    referrals: "1-5",
    commission: "10%",
    bonus: "₦5,000 bonus on 5th referral"
  },
  {
    referrals: "6-15",
    commission: "15%",
    bonus: "₦10,000 bonus on 15th referral"
  },
  {
    referrals: "16+",
    commission: "20%",
    bonus: "VIP status + exclusive perks"
  }
];

const faqs = [
  {
    question: "How much can I earn per referral?",
    answer: "You earn 10-20% commission on each successful enrollment, depending on your tier. For a ₦50,000 course, that's ₦5,000 - ₦10,000 per referral!"
  },
  {
    question: "When do I get paid?",
    answer: "Payments are processed within 7 days after the referred student completes their enrollment and payment is confirmed."
  },
  {
    question: "Is there a limit to how many people I can refer?",
    answer: "No limits! The more you refer, the higher your commission tier and the more you earn."
  },
  {
    question: "How do I track my referrals?",
    answer: "You'll have access to a personal dashboard where you can track all your referrals, pending enrollments, and earnings."
  }
];

export default function Referral() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralCode] = useState("CYTO-XXXXX");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("You're in! Check your email for your unique referral link and dashboard access.");
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://cytobiz.com/ref/${referralCode}`);
    toast.success("Referral link copied to clipboard!");
  };

  return (
    <PageTransition>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-4">
                <Gift className="w-3 h-3 mr-1" />
                Earn While You Share
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
                Refer & <span className="text-primary">Earn</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Share the gift of education and earn rewards. Get up to 20% commission 
                for every student you refer to Cytobiz Medical Academy.
              </p>
              <Button size="lg" asChild>
                <a href="#join-program">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Join the Program
                </a>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 md:py-28">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Start earning in three simple steps
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {howItWorks.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center relative"
                >
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-border" />
                  )}
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 relative">
                    <item.icon className="w-10 h-10 text-primary" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {item.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Commission Tiers */}
        <section className="py-20 md:py-28 bg-muted/50">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Commission Tiers
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The more you refer, the more you earn. Level up your commission rate!
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {rewardTiers.map((tier, index) => (
                <motion.div
                  key={tier.referrals}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`h-full text-center ${index === 2 ? 'border-primary bg-primary/5' : ''}`}>
                    <CardHeader>
                      <CardDescription className="text-sm uppercase tracking-wide">
                        {tier.referrals} Referrals
                      </CardDescription>
                      <CardTitle className="text-4xl text-primary">{tier.commission}</CardTitle>
                      <CardDescription>Commission Rate</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        {tier.bonus}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Join Form */}
        <section id="join-program" className="py-20 md:py-28">
          <div className="container-wide">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  Join the Referral Program
                </h2>
                <p className="text-muted-foreground">
                  Sign up now and start earning with every successful referral.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" name="firstName" placeholder="John" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" name="lastName" placeholder="Doe" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">WhatsApp Number</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+234 800 000 0000" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="audience">Who will you be referring?</Label>
                        <Select name="audience" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your primary audience" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="students">University Students</SelectItem>
                            <SelectItem value="professionals">Healthcare Professionals</SelectItem>
                            <SelectItem value="friends">Friends & Family</SelectItem>
                            <SelectItem value="social">Social Media Followers</SelectItem>
                            <SelectItem value="mixed">Mixed Audience</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input id="bankName" name="bankName" placeholder="e.g., GTBank" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number</Label>
                        <Input id="accountNumber" name="accountNumber" placeholder="0123456789" required />
                      </div>

                      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? "Signing Up..." : "Join Referral Program"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 md:py-28 bg-muted/50">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
