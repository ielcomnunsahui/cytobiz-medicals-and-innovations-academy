import { useState, useRef } from "react";
import { Upload, Package, Loader2, CheckCircle, AlertCircle, FileArchive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import JSZip from "jszip";

interface ScormUploadProps {
  currentUrl: string;
  onUrlChange: (url: string) => void;
  courseId?: string;
}

/**
 * Extracts a SCORM ZIP, uploads all files to Supabase storage,
 * and returns the public URL to the launch file (index.html or from imsmanifest.xml).
 */
export function ScormUpload({ currentUrl, onUrlChange, courseId }: ScormUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async (file: File) => {
    if (!file.name.endsWith(".zip")) {
      setError("Please upload a .zip file");
      return;
    }

    setUploading(true);
    setError("");
    setProgress("Reading ZIP file…");

    try {
      const zip = await JSZip.loadAsync(file);
      const entries = Object.entries(zip.files).filter(([, f]) => !f.dir);

      if (entries.length === 0) {
        throw new Error("ZIP file is empty");
      }

      // Find launch file from imsmanifest.xml or fall back to index.html
      let launchFile = await findLaunchFile(zip);
      if (!launchFile) {
        throw new Error(
          "Could not find a valid SCORM launch file. " +
          "The ZIP must contain imsmanifest.xml with a launch resource, or an index.html."
        );
      }

      // Determine the base folder prefix (e.g. "scorm_package/") that wraps the content
      const manifestEntry = zip.file("imsmanifest.xml") ? "" : findCommonPrefix(entries.map(([name]) => name));

      // Generate a unique folder for this upload
      const folderName = `scorm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const storagePath = courseId ? `${courseId}/${folderName}` : folderName;

      setProgress(`Uploading ${entries.length} files…`);

      // Upload files in batches of 5
      const batchSize = 5;
      let uploaded = 0;

      for (let i = 0; i < entries.length; i += batchSize) {
        const batch = entries.slice(i, i + batchSize);
        await Promise.all(
          batch.map(async ([name, zipEntry]) => {
            const blob = await zipEntry.async("blob");
            const contentType = guessContentType(name);

            // Remove common prefix so files are at root of the storage folder
            let relativePath = name;
            if (manifestEntry && relativePath.startsWith(manifestEntry)) {
              relativePath = relativePath.slice(manifestEntry.length);
            }

            const uploadPath = `${storagePath}/${relativePath}`;

            const { error: uploadError } = await supabase.storage
              .from("scorm-packages")
              .upload(uploadPath, blob, {
                contentType,
                upsert: true,
              });

            if (uploadError) {
              console.warn(`Failed to upload ${name}:`, uploadError.message);
            }
          })
        );
        uploaded += batch.length;
        setProgress(`Uploaded ${uploaded}/${entries.length} files…`);
      }

      // Build the public URL for the launch file
      let launchRelative = launchFile;
      if (manifestEntry && launchRelative.startsWith(manifestEntry)) {
        launchRelative = launchRelative.slice(manifestEntry.length);
      }

      const { data: urlData } = supabase.storage
        .from("scorm-packages")
        .getPublicUrl(`${storagePath}/${launchRelative}`);

      onUrlChange(urlData.publicUrl);
      setProgress("");
      toast.success("SCORM package uploaded and extracted successfully!");
    } catch (err) {
      const message = (err as Error).message;
      setError(message);
      toast.error(`SCORM upload failed: ${message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      <Label>SCORM Package</Label>

      {/* Upload area */}
      <div className="border-2 border-dashed border-border rounded-xl p-6 text-center space-y-3 bg-muted/30">
        <input
          ref={fileInputRef}
          type="file"
          accept=".zip"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />

        {uploading ? (
          <div className="space-y-2">
            <Loader2 className="w-8 h-8 mx-auto animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">{progress}</p>
          </div>
        ) : currentUrl ? (
          <div className="space-y-2">
            <CheckCircle className="w-8 h-8 mx-auto text-green-600" />
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              SCORM package uploaded
            </p>
            <p className="text-xs text-muted-foreground truncate max-w-md mx-auto">
              {currentUrl}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Replace Package
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <FileArchive className="w-10 h-10 mx-auto text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Upload SCORM ZIP Package</p>
              <p className="text-xs text-muted-foreground">
                SCORM 1.2 packages supported. The ZIP will be extracted and hosted automatically.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose ZIP File
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Manual URL input as fallback */}
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Or enter URL manually</Label>
        <Input
          value={currentUrl}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://your-scorm-host.com/package/index.html"
        />
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────

async function findLaunchFile(zip: JSZip): Promise<string | null> {
  // Try to parse imsmanifest.xml at root or one level deep
  const manifestPaths = [
    "imsmanifest.xml",
    ...Object.keys(zip.files).filter((n) => n.endsWith("/imsmanifest.xml") && n.split("/").length === 2),
  ];

  for (const path of manifestPaths) {
    const entry = zip.file(path);
    if (entry) {
      try {
        const xml = await entry.async("text");
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "text/xml");

        // Look for <resource> with href attribute
        const resources = doc.querySelectorAll("resource");
        for (const res of resources) {
          const href = res.getAttribute("href");
          if (href) {
            // If manifest is in a subfolder, prepend that
            const prefix = path.includes("/") ? path.substring(0, path.lastIndexOf("/") + 1) : "";
            return prefix + href;
          }
        }
      } catch {
        // Couldn't parse manifest, try next
      }
    }
  }

  // Fallback: look for index.html
  const indexPaths = Object.keys(zip.files)
    .filter((n) => n.endsWith("index.html"))
    .sort((a, b) => a.split("/").length - b.split("/").length);

  return indexPaths[0] || null;
}

function findCommonPrefix(paths: string[]): string {
  if (paths.length === 0) return "";
  const firstSlash = paths[0].indexOf("/");
  if (firstSlash === -1) return "";
  const prefix = paths[0].substring(0, firstSlash + 1);
  if (paths.every((p) => p.startsWith(prefix))) return prefix;
  return "";
}

function guessContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    html: "text/html",
    htm: "text/html",
    css: "text/css",
    js: "application/javascript",
    json: "application/json",
    xml: "application/xml",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    svg: "image/svg+xml",
    webp: "image/webp",
    mp3: "audio/mpeg",
    mp4: "video/mp4",
    wav: "audio/wav",
    pdf: "application/pdf",
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
    eot: "application/vnd.ms-fontobject",
    swf: "application/x-shockwave-flash",
  };
  return map[ext] || "application/octet-stream";
}
