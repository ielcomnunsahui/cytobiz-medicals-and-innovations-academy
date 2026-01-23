import { motion } from "framer-motion";
import { Heart, GraduationCap, Users, Trophy, CheckCircle2, ArrowRight } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

const sponsorshipTiers = [
  {
    name: "Single Learner",
    amount: "₦50,000",
    description: "Sponsor one student's complete course enrollment",
    features: [
      "Full tuition coverage",
      "Course materials included",
      "Certification fees covered",
      "Recognition on our website"
    ]
  },
  {
    name: "Cohort Supporter",
    amount: "₦250,000",
    description: "Support 5 students through their learning journey",
    features: [
      "Everything in Single Learner",
      "Quarterly progress reports",
      "Meet your sponsored learners",
      "Social media recognition"
    ],
    popular: true
  },
  {
    name: "Program Champion",
    amount: "₦500,000+",
    description: "Sponsor an entire program or create a scholarship fund",
    features: [
      "Everything in Cohort Supporter",
      "Named scholarship opportunity",
      "Speaking opportunity at events",
      "Premium brand visibility"
    ]
  }
];

const impactStats = [
  { icon: GraduationCap, value: "500+", label: "Students Sponsored" },
  { icon: Users, value: "50+", label: "Active Sponsors" },
  { icon: Trophy, value: "92%", label: "Completion Rate" }
];

export default function Sponsor() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Thank you for your interest! We'll be in touch within 24 hours.");
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
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
                <Heart className="w-3 h-3 mr-1 text-red-500" />
                Change Lives
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
                Sponsor a <span className="text-primary">Learner</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Your sponsorship can transform someone's career in healthcare. 
                Help fund a student's education and create lasting impact in African healthcare.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-12 border-b border-border">
          <div className="container-wide">
            <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto">
              {impactStats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsorship Tiers */}
        <section className="py-20 md:py-28">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Sponsorship Tiers
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose a sponsorship level that aligns with your giving capacity. Every contribution makes a difference.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {sponsorshipTiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className={`h-full relative ${tier.popular ? 'border-primary shadow-lg' : ''}`}>
                    {tier.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pt-8">
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      <div className="text-3xl font-bold text-primary mt-2">{tier.amount}</div>
                      <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full mt-6" variant={tier.popular ? "default" : "outline"} asChild>
                        <a href="#sponsor-form">Choose This Tier</a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sponsor Form */}
        <section id="sponsor-form" className="py-20 md:py-28 bg-muted/50">
          <div className="container-wide">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  Become a Sponsor
                </h2>
                <p className="text-muted-foreground">
                  Fill out the form below and our team will reach out to finalize your sponsorship.
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
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" type="tel" placeholder="+234 800 000 0000" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tier">Sponsorship Tier</Label>
                        <Select name="tier" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a tier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single">Single Learner - ₦50,000</SelectItem>
                            <SelectItem value="cohort">Cohort Supporter - ₦250,000</SelectItem>
                            <SelectItem value="champion">Program Champion - ₦500,000+</SelectItem>
                            <SelectItem value="custom">Custom Amount</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message (Optional)</Label>
                        <Textarea 
                          id="message" 
                          name="message" 
                          placeholder="Tell us about your motivation for sponsoring or any specific preferences..."
                          rows={4}
                        />
                      </div>

                      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Sponsorship Interest"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
