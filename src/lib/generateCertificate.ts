/**
 * Generates a branded Cytobiz Medical Academy certificate as a downloadable image.
 * Uses Cytobiz brand colors: Navy (#1a1a3e), Primary Blue (#4400ff), Gold (#d4a843)
 */

interface CertificateParams {
  recipientName: string;
  courseTitle: string;
  courseType: "cohort" | "self_paced";
  verificationCode: string;
  issuedDate: string;
  logoUrl: string;
}

// ─── Canvas Rendering ────────────────────────────────────────────────────────

async function renderCertificateCanvas(params: CertificateParams) {
  const { recipientName, courseTitle, courseType, verificationCode, issuedDate, logoUrl } = params;
  const W = 1600;
  const H = 1130;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Brand Colors
  const navy = "#1a1a3e";
  const primaryBlue = "#4400ff";
  const gold = "#d4a843";
  const textDark = "#1a1a3e";
  const textMuted = "#64648a";

  // ── Background ──
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, W, H);

  // Subtle radial glow
  const glow = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W * 0.7);
  glow.addColorStop(0, "rgba(68,0,255,0.025)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ── Outer Border (triple line) ──
  ctx.strokeStyle = gold;
  ctx.lineWidth = 8;
  ctx.strokeRect(24, 24, W - 48, H - 48);

  ctx.strokeStyle = primaryBlue;
  ctx.lineWidth = 2;
  ctx.strokeRect(38, 38, W - 76, H - 76);

  ctx.strokeStyle = gold;
  ctx.lineWidth = 1;
  ctx.strokeRect(46, 46, W - 92, H - 92);

  // ── Corner Ornaments ──
  drawCornerOrnaments(ctx, W, H, gold, primaryBlue);

  // ── Top Decorative Line ──
  drawGoldLine(ctx, 180, 95, W - 180, 95, gold);

  // ── Logo (large & proportional) ──
  try {
    const logo = await loadImage(logoUrl);
    const logoH = 220;
    const logoW = (logo.width / logo.height) * logoH;
    ctx.drawImage(logo, (W - logoW) / 2, 80, logoW, logoH);
  } catch {
    ctx.fillStyle = primaryBlue;
    ctx.font = "bold 42px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.fillText("CYTOBIZ MEDICAL & INNOVATION HUB", W / 2, 200);
  }

  // ── Academy Name ──
  ctx.fillStyle = navy;
  ctx.font = "600 15px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("C Y T O B I Z   M E D I C A L   &   I N N O V A T I O N   A C A D E M Y", W / 2, 280);

  // ── Ornate Divider ──
  drawDivider(ctx, W / 2, 305, 200, gold);

  // ── Certificate Title ──
  const certType = courseType === "cohort" ? "DIPLOMA" : "COMPLETION";
  ctx.fillStyle = textMuted;
  ctx.font = "300 15px 'Segoe UI', sans-serif";
  ctx.fillText("CERTIFICATE OF", W / 2, 340);

  ctx.fillStyle = primaryBlue;
  ctx.font = "bold 56px 'Georgia', serif";
  ctx.fillText(certType, W / 2, 400);

  drawDivider(ctx, W / 2, 430, 160, gold);

  // ── "This is to certify that" ──
  ctx.fillStyle = textMuted;
  ctx.font = "italic 19px 'Georgia', serif";
  ctx.fillText("This is to certify that", W / 2, 468);

  // ── Recipient Name (bold & prominent) ──
  ctx.fillStyle = navy;
  ctx.font = "bold 52px 'Georgia', serif";
  ctx.fillText(recipientName, W / 2, 535);

  // Gold underline for name
  const nameW = ctx.measureText(recipientName).width;
  const nameGrad = ctx.createLinearGradient((W - nameW) / 2 - 50, 550, (W + nameW) / 2 + 50, 550);
  nameGrad.addColorStop(0, "rgba(212,168,67,0)");
  nameGrad.addColorStop(0.15, gold);
  nameGrad.addColorStop(0.85, gold);
  nameGrad.addColorStop(1, "rgba(212,168,67,0)");
  ctx.strokeStyle = nameGrad;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo((W - nameW) / 2 - 50, 552);
  ctx.lineTo((W + nameW) / 2 + 50, 552);
  ctx.stroke();

  // ── "has successfully completed" ──
  ctx.fillStyle = textMuted;
  ctx.font = "italic 19px 'Georgia', serif";
  ctx.fillText("has successfully completed the course", W / 2, 595);

  // ── Course Title ──
  ctx.fillStyle = navy;
  ctx.font = "bold 30px 'Georgia', serif";
  const lines = wrapText(ctx, courseTitle, W - 320);
  let y = 645;
  for (const line of lines) {
    ctx.fillText(line, W / 2, y);
    y += 40;
  }

  drawDivider(ctx, W / 2, y + 18, 130, gold);

  // ── Date & Verification ──
  const infoY = y + 58;
  ctx.fillStyle = textMuted;
  ctx.font = "500 14px 'Segoe UI', sans-serif";
  ctx.fillText(`Issued: ${issuedDate}`, W / 2, infoY);
  ctx.fillText(`Certificate No: ${verificationCode}`, W / 2, infoY + 24);

  // ── E-Signature ──
  const sigY = H - 210;
  drawESignature(ctx, W / 2, sigY, "Jimoh Habibullahi", "GMD", "Cytobiz Group", navy, textMuted, primaryBlue);

  // ── Accreditation Section ──
  const accY = H - 108;
  ctx.fillStyle = primaryBlue;
  ctx.fillRect(60, accY - 22, W - 120, 2);

  ctx.fillStyle = textMuted;
  ctx.font = "400 12px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Accredited by", W / 2, accY + 2);

  drawAccreditationBadge(ctx, W / 2 - 180, accY + 32, "WAHBS", primaryBlue, gold);
  ctx.fillStyle = textDark;
  ctx.font = "500 11px 'Segoe UI', sans-serif";
  ctx.fillText("West Africa Health Business Society", W / 2 - 180, accY + 58);

  drawAccreditationBadge(ctx, W / 2 + 180, accY + 32, "SDCC", primaryBlue, gold);
  ctx.fillStyle = textDark;
  ctx.font = "500 11px 'Segoe UI', sans-serif";
  ctx.fillText("Skill Development Council Canada", W / 2 + 180, accY + 58);

  // ── Bottom Decorative Line ──
  drawGoldLine(ctx, 180, H - 50, W - 180, H - 50, gold);

  return canvas;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Returns a data URL for previewing the certificate inline */
export async function generateCertificatePreviewURL(params: CertificateParams): Promise<string> {
  const canvas = await renderCertificateCanvas(params);
  return canvas.toDataURL("image/png", 1.0);
}

/** Downloads the certificate as a JPEG file */
export async function generateCertificateJPEG(params: CertificateParams) {
  const canvas = await renderCertificateCanvas(params);
  const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
  triggerDownload(dataUrl, `Cytobiz-Certificate-${params.verificationCode}.jpeg`);
}

/** Downloads the certificate as a PNG file */
export async function generateCertificatePNG(params: CertificateParams) {
  const canvas = await renderCertificateCanvas(params);
  const dataUrl = canvas.toDataURL("image/png", 1.0);
  triggerDownload(dataUrl, `Cytobiz-Certificate-${params.verificationCode}.png`);
}

/** Downloads the certificate as a PDF file */
export async function generateCertificatePDF(params: CertificateParams) {
  const canvas = await renderCertificateCanvas(params);
  const imgData = canvas.toDataURL("image/png", 1.0);

  // Build a minimal single-page PDF with the certificate image embedded
  const W = canvas.width;
  const H = canvas.height;
  const pdfWidth = W * 0.75; // points (1px ≈ 0.75pt)
  const pdfHeight = H * 0.75;

  // Convert image to raw binary
  const raw = atob(imgData.split(",")[1]);
  const imgBytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) imgBytes[i] = raw.charCodeAt(i);

  const imgLen = imgBytes.length;

  // PDF structure
  const objects: string[] = [];
  objects.push(""); // placeholder for 0-index

  // 1 – Catalog
  objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj");
  // 2 – Pages
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj`);
  // 3 – Page
  objects.push(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfWidth} ${pdfHeight}] /Contents 4 0 R /Resources << /XObject << /Img0 5 0 R >> >> >>\nendobj`);
  // 4 – Content stream
  const stream = `q ${pdfWidth} 0 0 ${pdfHeight} 0 0 cm /Img0 Do Q`;
  objects.push(`4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`);
  // 5 – Image XObject (will be built separately due to binary)

  // Build the PDF bytes manually
  const header = "%PDF-1.4\n";
  const encoder = new TextEncoder();

  const parts: (Uint8Array | string)[] = [];
  parts.push(header);

  const offsets: number[] = [0]; // 0 index unused
  let pos = header.length;

  for (let i = 1; i <= 4; i++) {
    offsets.push(pos);
    const s = objects[i] + "\n";
    parts.push(s);
    pos += s.length;
  }

  // Object 5 – Image
  offsets.push(pos);
  const imgHeader = `5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${W} /Height ${H} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imgLen} >>\nstream\n`;
  parts.push(imgHeader);
  pos += imgHeader.length;

  // Re-encode canvas as JPEG for PDF embedding
  const jpegData = canvas.toDataURL("image/jpeg", 0.95);
  const jpegRaw = atob(jpegData.split(",")[1]);
  const jpegBytes = new Uint8Array(jpegRaw.length);
  for (let i = 0; i < jpegRaw.length; i++) jpegBytes[i] = jpegRaw.charCodeAt(i);

  // Fix lengths for JPEG
  const imgHeader2 = `5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${W} /Height ${H} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`;
  // Recalculate – replace last entry
  parts[parts.length - 1] = imgHeader2;
  pos = pos - imgHeader.length + imgHeader2.length;

  parts.push(jpegBytes);
  pos += jpegBytes.length;

  const imgFooter = "\nendstream\nendobj\n";
  parts.push(imgFooter);
  pos += imgFooter.length;

  // xref
  const xrefPos = pos;
  let xref = `xref\n0 6\n0000000000 65535 f \n`;
  for (let i = 1; i <= 5; i++) {
    xref += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  xref += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  parts.push(xref);

  // Combine all parts into a single blob
  const totalLen = parts.reduce((s, p) => s + (typeof p === "string" ? encoder.encode(p).length : p.length), 0);
  const pdf = new Uint8Array(totalLen);
  let offset = 0;
  for (const p of parts) {
    const bytes = typeof p === "string" ? encoder.encode(p) : p;
    pdf.set(bytes, offset);
    offset += bytes.length;
  }

  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, `Cytobiz-Certificate-${params.verificationCode}.pdf`);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function triggerDownload(url: string, filename: string) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0];
  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + " " + words[i];
    if (ctx.measureText(testLine).width > maxWidth) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  return lines;
}

function drawGoldLine(ctx: CanvasRenderingContext2D, x1: number, y: number, x2: number, _y2: number, color: string) {
  const grad = ctx.createLinearGradient(x1, y, x2, y);
  grad.addColorStop(0, "rgba(212,168,67,0)");
  grad.addColorStop(0.2, color);
  grad.addColorStop(0.8, color);
  grad.addColorStop(1, "rgba(212,168,67,0)");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
}

function drawDivider(ctx: CanvasRenderingContext2D, cx: number, y: number, halfW: number, color: string) {
  const grad = ctx.createLinearGradient(cx - halfW, y, cx + halfW, y);
  grad.addColorStop(0, "rgba(212,168,67,0)");
  grad.addColorStop(0.25, color);
  grad.addColorStop(0.75, color);
  grad.addColorStop(1, "rgba(212,168,67,0)");

  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx - halfW, y);
  ctx.lineTo(cx - 10, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 10, y);
  ctx.lineTo(cx + halfW, y);
  ctx.stroke();

  // Diamond
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, y - 6);
  ctx.lineTo(cx + 7, y);
  ctx.lineTo(cx, y + 6);
  ctx.lineTo(cx - 7, y);
  ctx.closePath();
  ctx.fill();
}

function drawCornerOrnaments(ctx: CanvasRenderingContext2D, W: number, H: number, gold: string, blue: string) {
  const offset = 52;
  const size = 40;

  ctx.strokeStyle = gold;
  ctx.lineWidth = 3.5;

  // Top-left
  ctx.beginPath();
  ctx.moveTo(offset, offset + size);
  ctx.lineTo(offset, offset);
  ctx.lineTo(offset + size, offset);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(W - offset - size, offset);
  ctx.lineTo(W - offset, offset);
  ctx.lineTo(W - offset, offset + size);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(offset, H - offset - size);
  ctx.lineTo(offset, H - offset);
  ctx.lineTo(offset + size, H - offset);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(W - offset - size, H - offset);
  ctx.lineTo(W - offset, H - offset);
  ctx.lineTo(W - offset, H - offset - size);
  ctx.stroke();

  // Blue accent dots
  ctx.fillStyle = blue;
  const dotR = 4;
  [[offset, offset], [W - offset, offset], [offset, H - offset], [W - offset, H - offset]].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, dotR, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawESignature(
  ctx: CanvasRenderingContext2D, cx: number, y: number,
  name: string, title: string, org: string,
  navy: string, muted: string, blue: string
) {
  ctx.textAlign = "center";

  // Stylised cursive signature
  ctx.fillStyle = navy;
  ctx.font = "italic bold 28px 'Georgia', 'Times New Roman', serif";
  ctx.fillText(name, cx, y - 8);

  // Signature line
  ctx.strokeStyle = navy;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(cx - 130, y + 8);
  ctx.lineTo(cx + 130, y + 8);
  ctx.stroke();

  // Title
  ctx.fillStyle = navy;
  ctx.font = "bold 14px 'Segoe UI', sans-serif";
  ctx.fillText(title, cx, y + 30);

  // Org
  ctx.fillStyle = muted;
  ctx.font = "400 11px 'Segoe UI', sans-serif";
  ctx.fillText(org, cx, y + 48);
}

function drawAccreditationBadge(
  ctx: CanvasRenderingContext2D, cx: number, cy: number, label: string,
  blue: string, gold: string
) {
  ctx.beginPath();
  ctx.arc(cx, cy, 18, 0, Math.PI * 2);
  ctx.strokeStyle = gold;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fillStyle = blue;
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 9px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, cx, cy);
  ctx.textBaseline = "alphabetic";
}
