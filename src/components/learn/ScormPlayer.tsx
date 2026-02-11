import { useState, useRef, useEffect } from "react";
import { Package, Maximize2, Minimize2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScormPlayerProps {
  scormUrl: string;
  title: string;
  onComplete?: () => void;
}

export function ScormPlayer({ scormUrl, title, onComplete }: ScormPlayerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
          "cmi.core.student_name": "Learner",
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

    // Expose the API on the window so the SCORM content can find it
    (window as any).API = scormAPI;

    return () => {
      delete (window as any).API;
    };
  }, [title, onComplete]);

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

  // Determine the launch URL
  // If it's a zip URL, we need the extracted index.html path
  // For hosted packages, use the URL directly
  const launchUrl = scormUrl;

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
    <div ref={containerRef} className={cn("mb-8", isFullscreen && "fixed inset-0 z-50 bg-background")}>
      {/* Player Header */}
      <div className="flex items-center justify-between p-3 bg-muted/50 border border-border rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          <span className="font-medium text-sm">SCORM Content: {title}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="flex items-center justify-center h-96 border-x border-border bg-background">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">Loading SCORM content…</p>
          </div>
        </div>
      )}

      {/* SCORM iframe */}
      <iframe
        ref={iframeRef}
        src={launchUrl}
        title={`SCORM: ${title}`}
        className={cn(
          "w-full border-x border-b border-border rounded-b-2xl bg-white",
          isFullscreen ? "h-[calc(100vh-48px)]" : "h-[600px]",
          isLoading && "hidden"
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        allow="fullscreen"
      />
    </div>
  );
}
