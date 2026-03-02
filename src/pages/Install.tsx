import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { PageTransition } from "@/components/PageTransition";
import { Download, Smartphone, Monitor, Share2, Plus, MoreVertical, CheckCircle2, Zap, Wifi, WifiOff, Clock } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android" | "desktop">("desktop");

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) {
      setPlatform("ios");
    } else if (/Android/.test(ua)) {
      setPlatform("android");
    } else {
      setPlatform("desktop");
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setIsInstalled(true);
    setDeferredPrompt(null);
  };

  const benefits = [
    { icon: Zap, title: "Faster Loading", description: "App loads instantly from your home screen" },
    { icon: WifiOff, title: "Offline Access", description: "Access cached content without internet" },
    { icon: Smartphone, title: "Native Feel", description: "Full-screen experience like a real app" },
    { icon: Clock, title: "Quick Access", description: "One tap from your home screen" },
  ];

  return (
    <>
      <SEOHead
        title="Install App | Cytobiz Medical Academy"
        description="Install Cytobiz Medical Academy as a mobile app on your device for faster access and offline learning."
      />
      <Navbar />
      <PageTransition>
        <main className="min-h-screen bg-background">
          {/* Hero */}
          <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
                <Download className="h-4 w-4" />
                Install Our App
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Get Cytobiz Academy on Your Device
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Install our app directly from your browser — no app store needed. Access courses, track progress, and learn on the go.
              </p>

              {isInstalled ? (
                <div className="inline-flex items-center gap-2 rounded-xl bg-accent border border-border px-6 py-4 text-primary">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">App is already installed!</span>
                </div>
              ) : deferredPrompt ? (
                <Button size="lg" onClick={handleInstall} className="text-lg px-8 py-6 rounded-xl">
                  <Download className="h-5 w-5 mr-2" />
                  Install App Now
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Follow the instructions below for your device.
                </p>
              )}
            </div>
          </section>

          {/* Benefits */}
          <section className="py-16 container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center text-foreground mb-10">Why Install?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {benefits.map((b) => (
                <Card key={b.title} className="text-center border-border/50">
                  <CardContent className="pt-6">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <b.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{b.title}</h3>
                    <p className="text-sm text-muted-foreground">{b.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Platform Instructions */}
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-2xl font-bold text-center text-foreground mb-10">How to Install</h2>

              <div className="grid md:grid-cols-2 gap-8">
                {/* iOS */}
                <Card className={`border-2 transition-colors ${platform === "ios" ? "border-primary" : "border-border/50"}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Smartphone className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">iPhone & iPad</h3>
                        <p className="text-xs text-muted-foreground">Safari browser</p>
                      </div>
                      {platform === "ios" && (
                        <span className="ml-auto text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Your device</span>
                      )}
                    </div>
                    <ol className="space-y-4">
                      <li className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                        <div>
                          <p className="font-medium text-foreground">Open in Safari</p>
                          <p className="text-sm text-muted-foreground">Make sure you're using Safari browser</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                        <div>
                          <p className="font-medium text-foreground flex items-center gap-1">Tap the Share button <Share2 className="h-4 w-4 text-muted-foreground" /></p>
                          <p className="text-sm text-muted-foreground">At the bottom of the screen</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">3</span>
                        <div>
                          <p className="font-medium text-foreground flex items-center gap-1">Tap "Add to Home Screen" <Plus className="h-4 w-4 text-muted-foreground" /></p>
                          <p className="text-sm text-muted-foreground">Scroll down if needed</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">4</span>
                        <div>
                          <p className="font-medium text-foreground">Tap "Add"</p>
                          <p className="text-sm text-muted-foreground">The app icon will appear on your home screen</p>
                        </div>
                      </li>
                    </ol>
                  </CardContent>
                </Card>

                {/* Android */}
                <Card className={`border-2 transition-colors ${platform === "android" ? "border-primary" : "border-border/50"}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Smartphone className="h-5 w-5 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">Android</h3>
                        <p className="text-xs text-muted-foreground">Chrome browser</p>
                      </div>
                      {platform === "android" && (
                        <span className="ml-auto text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Your device</span>
                      )}
                    </div>
                    <ol className="space-y-4">
                      <li className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">1</span>
                        <div>
                          <p className="font-medium text-foreground">Open in Chrome</p>
                          <p className="text-sm text-muted-foreground">Use Google Chrome browser</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">2</span>
                        <div>
                          <p className="font-medium text-foreground flex items-center gap-1">Tap the menu <MoreVertical className="h-4 w-4 text-muted-foreground" /></p>
                          <p className="text-sm text-muted-foreground">Three dots at the top right</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">3</span>
                        <div>
                          <p className="font-medium text-foreground">Tap "Install app" or "Add to Home screen"</p>
                          <p className="text-sm text-muted-foreground">You may see a banner at the bottom too</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">4</span>
                        <div>
                          <p className="font-medium text-foreground">Tap "Install"</p>
                          <p className="text-sm text-muted-foreground">The app will be added to your home screen</p>
                        </div>
                      </li>
                    </ol>
                  </CardContent>
                </Card>
              </div>

              {/* Desktop */}
              <Card className={`mt-8 border-2 transition-colors ${platform === "desktop" ? "border-primary" : "border-border/50"}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      <Monitor className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">Desktop (Chrome / Edge)</h3>
                      <p className="text-xs text-muted-foreground">Windows, Mac, or Linux</p>
                    </div>
                    {platform === "desktop" && (
                      <span className="ml-auto text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">Your device</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Click the <strong>install icon</strong> in the address bar (right side), or go to <strong>Menu → Install Cytobiz Academy</strong>. The app will open in its own window.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </PageTransition>
      <Footer />
    </>
  );
};

export default Install;
