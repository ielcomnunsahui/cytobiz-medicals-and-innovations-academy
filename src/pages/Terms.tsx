import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PageTransition } from "@/components/PageTransition";

export default function Terms() {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 pt-24 pb-16">
          <div className="container-wide max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-muted-foreground mb-6">
                  Last updated: January 22, 2026
                </p>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing and using Cytobiz Academy's website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use our services.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">2. Use License</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Permission is granted to temporarily access the materials (information or software) on Cytobiz Academy's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Modify or copy the materials</li>
                    <li>Use the materials for any commercial purpose or for any public display</li>
                    <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                    <li>Remove any copyright or other proprietary notations from the materials</li>
                    <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">3. Course Enrollment</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    When you enroll in a course, you agree to complete the registration process accurately and pay all applicable fees. Course access is granted upon successful payment verification. For cohort-based programs, enrollment is subject to availability and start dates.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">4. Payment Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    All payments are processed securely through our approved payment providers (Stripe, Paystack, or Bank Transfer). Prices are displayed in the applicable currency and include all fees unless otherwise stated. Refunds are subject to our refund policy.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    All course content, materials, videos, documents, and other educational resources are the intellectual property of Cytobiz Academy and its content creators. You may not reproduce, distribute, or create derivative works without explicit written permission.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">6. User Conduct</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    As a user of our platform, you agree to:
                  </p>
                  <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                    <li>Provide accurate and complete information during registration</li>
                    <li>Maintain the confidentiality of your account credentials</li>
                    <li>Not share your account access with others</li>
                    <li>Engage respectfully with facilitators and fellow learners</li>
                    <li>Submit original work for all assignments and projects</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">7. Certificates</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Certificates of completion are issued upon successful completion of all course requirements. Certificates are verifiable through our platform and remain valid indefinitely. Misrepresentation of certificate credentials may result in revocation.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Cytobiz Academy shall not be held liable for any damages arising from the use or inability to use our services, including but not limited to direct, indirect, incidental, punitive, and consequential damages.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">9. Modifications</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the platform after changes constitutes acceptance of the modified terms.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-4">10. Contact Information</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us at{" "}
                    <a href="mailto:legal@cytobiz.com" className="text-primary hover:underline">
                      legal@cytobiz.com
                    </a>
                  </p>
                </section>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
