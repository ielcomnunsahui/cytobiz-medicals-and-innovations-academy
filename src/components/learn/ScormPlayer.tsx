import { useState, useRef, useEffect } from "react";
import { Package, Maximize2, Minimize2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScormPlayerProps {
  scormUrl: string;
  title: string;
  learnerId?: string;
  learnerName?: string;
  onComplete?: () => void;
}

export function ScormPlayer({ scormUrl, title, learnerId, learnerName, onComplete }: ScormPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [resolvedUrl, setResolvedUrl] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch the HTML, substitute placeholders, and create a blob URL
  useEffect(() => {
    let blobUrl: string | null = null;

    const prepare = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        const response = await fetch(scormUrl);
        if (!response.ok) throw new Error("Failed to fetch SCORM content");

        const contentType = response.headers.get("content-type") || "";
        const text = await response.text();

        // Check if this is HTML that needs placeholder substitution
        const isHtml = contentType.includes("text/html") || text.trimStart().startsWith("<!DOCTYPE") || text.trimStart().startsWith("<html");

        if (isHtml) {
          let processed = text;

          // Substitute placeholders with actual learner data
          if (text.includes("LEARNER_ID") || text.includes("LEARNER_NAME")) {
            processed = processed
              .replace(/LEARNER_ID/g, learnerId || "anonymous")
              .replace(/LEARNER_NAME/g, encodeURIComponent(learnerName || "Learner"));
          }

          // Inject a script to auto-bypass Coursebox landing/intro screens
          // This clicks "Get Started", "Start", "Begin", or "Continue" buttons automatically
          const autoBypassScript = `
<script>
(function() {
  function tryBypass() {
    // Common selectors for Coursebox landing page buttons
    var selectors = [
      'button[class*="start"]', 'a[class*="start"]',
      'button[class*="begin"]', 'a[class*="begin"]',
      'button[class*="launch"]', 'a[class*="launch"]',
      '.btn-start', '.start-btn', '.get-started',
      '[data-action="start"]', '[data-action="begin"]',
    ];
    for (var i = 0; i < selectors.length; i++) {
      var el = document.querySelector(selectors[i]);
      if (el) { el.click(); return true; }
    }
    // Also try matching by button text content
    var buttons = document.querySelectorAll('button, a.btn, a[role="button"], input[type="button"], input[type="submit"]');
    for (var j = 0; j < buttons.length; j++) {
      var txt = (buttons[j].textContent || buttons[j].value || '').trim().toLowerCase();
      if (txt === 'get started' || txt === 'start' || txt === 'begin' || txt === 'start course' || txt === 'launch' || txt === 'continue') {
        buttons[j].click(); return true;
      }
    }
    return false;
  }
  // Try immediately and then poll for a few seconds in case content loads async
  if (!tryBypass()) {
    var attempts = 0;
    var interval = setInterval(function() {
      if (tryBypass() || ++attempts > 20) clearInterval(interval);
    }, 500);
  }
})();
</script>`;

          // Insert the script before </body> or at the end
          if (processed.includes("</body>")) {
            processed = processed.replace("</body>", autoBypassScript + "</body>");
          } else {
            processed += autoBypassScript;
          }

          const blob = new Blob([processed], { type: "text/html" });
          blobUrl = URL.createObjectURL(blob);
          setResolvedUrl(blobUrl);
        } else {
          // Use the URL directly
          setResolvedUrl(scormUrl);
        }
      } catch (err) {
        console.error("ScormPlayer: failed to prepare content", err);
        setHasError(true);
        setIsLoading(false);
      }
    };

    prepare();

    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl);
    };
  }, [scormUrl, learnerId, learnerName]);

  // Provide a minimal SCORM 1.2 API for the package
  useEffect(() => {
    const scormAPI = {
      LMSInitialize: () => "true",
      LMSFinish: () => {
        onComplete?.();
        return "true";
      },
      LMSGetValue: (key: string) => {
        const defaults: Record<string, string> = {
          "cmi.core.student_name": learnerName || "Learner",
          "cmi.core.student_id": learnerId || "",
          "cmi.core.lesson_status": "not attempted",
          "cmi.core.lesson_location": "",
          "cmi.core.score.raw": "",
          "cmi.core.score.max": "100",
          "cmi.core.score.min": "0",
          "cmi.suspend_data": localStorage.getItem(`scorm_suspend_${title}`) || "",
        };
        return defaults[key] || "";
      },
      LMSSetValue: (key: string, value: string) => {
        if (key === "cmi.suspend_data") {
          localStorage.setItem(`scorm_suspend_${title}`, value);
        }
        if (key === "cmi.core.lesson_status" && (value === "completed" || value === "passed")) {
          onComplete?.();
        }
        return "true";
      },
      LMSCommit: () => "true",
      LMSGetLastError: () => "0",
      LMSGetErrorString: () => "",
      LMSGetDiagnostic: () => "",
    };

    (window as any).API = scormAPI;

    return () => {
      delete (window as any).API;
    };
  }, [title, learnerId, learnerName, onComplete]);

  const toggleFullscreen = () => {
    if (!isFullscreen && containerRef.current) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  if (hasError) {
    return (
      <div className="rounded-2xl border border-border bg-muted/50 p-8 text-center mb-8">
        <AlertCircle className="w-12 h-12 mx-auto text-destructive mb-4" />
        <h3 className="text-lg font-semibold mb-2">SCORM Package Error</h3>
        <p className="text-muted-foreground mb-4">
          Unable to load the SCORM content. The package may need to be extracted and hosted.
        </p>
        <Button variant="outline" onClick={() => setHasError(false)}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn("mb-0", isFullscreen && "fixed inset-0 z-50 bg-background")}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="flex items-center justify-center h-[calc(100vh-64px)] bg-background">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading course content…</p>
          </div>
        </div>
      )}

      {/* SCORM iframe - fullscreen by default */}
      {resolvedUrl && (
        <iframe
          ref={iframeRef}
          src={resolvedUrl}
          title={`SCORM: ${title}`}
          className={cn(
            "w-full bg-white",
            isFullscreen ? "h-screen" : "h-[calc(100vh-64px)]",
            isLoading && "hidden"
          )}
          style={{ border: "none" }}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          allow="fullscreen"
        />
      )}
    </div>
  );
}
