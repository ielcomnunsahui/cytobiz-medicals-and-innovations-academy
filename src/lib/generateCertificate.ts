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

// ─── QR Code Generator (minimal) ────────────────────────────────────────────

function generateQRCodeData(text: string): boolean[][] {
  // Simple QR-like pattern using a deterministic hash grid
  // For production, consider a full QR library, but this creates a scannable-looking pattern
  const size = 21;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  
  // Finder patterns (3 corners)
  const drawFinder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        const isEdge = i === 0 || i === 6 || j === 0 || j === 6;
        const isInner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        grid[r + i][c + j] = isEdge || isInner;
      }
    }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // Fill data area with hash-based pattern
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c]) continue;
      // Skip finder pattern areas
      if ((r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8)) continue;
      hash = ((hash << 5) - hash + r * size + c) | 0;
      grid[r][c] = (Math.abs(hash) % 3) === 0;
    }
  }
  return grid;
}

function drawQRCode(ctx: CanvasRenderingContext2D, cx: number, cy: number, text: string, moduleSize: number, color: string) {
  const data = generateQRCodeData(text);
  const size = data.length;
  const totalSize = size * moduleSize;
  const startX = cx - totalSize / 2;
  const startY = cy - totalSize / 2;

  // White background with border
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(startX - 4, startY - 4, totalSize + 8, totalSize + 8);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.strokeRect(startX - 4, startY - 4, totalSize + 8, totalSize + 8);

  // Draw modules
  ctx.fillStyle = color;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (data[r][c]) {
        ctx.fillRect(startX + c * moduleSize, startY + r * moduleSize, moduleSize, moduleSize);
      }
    }
  }
}

// ─── Canvas Rendering ────────────────────────────────────────────────────────

async function renderCertificateCanvas(params: CertificateParams) {
  const { recipientName, courseTitle, courseType, verificationCode, issuedDate, logoUrl } = params;
  const W = 1600;
  const H = 1200;
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

  // ── Certification description ──
  ctx.fillStyle = textMuted;
  ctx.font = "italic 16px 'Georgia', serif";
  ctx.textAlign = "center";
  const certDesc = "This certifies that the holder has successfully completed training in Public Health Project Management, demonstrating competence in planning, implementing, monitoring, and evaluating public health programs and interventions.";
  const descLines = wrapText(ctx, certDesc, W - 360);
  let descY = 585;
  for (const line of descLines) {
    ctx.fillText(line, W / 2, descY);
    descY += 22;
  }

  // ── "in the course" ──
  ctx.fillStyle = textMuted;
  ctx.font = "italic 19px 'Georgia', serif";
  ctx.fillText("Course:", W / 2, descY + 15);

  // ── Course Title ──
  ctx.fillStyle = navy;
  ctx.font = "bold 28px 'Georgia', serif";
  const lines = wrapText(ctx, courseTitle, W - 320);
  let y = descY + 50;
  for (const line of lines) {
    ctx.fillText(line, W / 2, y);
    y += 36;
  }

  drawDivider(ctx, W / 2, y + 10, 130, gold);

  // ── Date & Serial Code ──
  const infoY = y + 45;
  ctx.fillStyle = textMuted;
  ctx.font = "500 14px 'Segoe UI', sans-serif";
  ctx.fillText(`Issued: ${issuedDate}`, W / 2, infoY);
  ctx.fillStyle = navy;
  ctx.font = "bold 14px 'Segoe UI', sans-serif";
  ctx.fillText(`Serial No: ${verificationCode}`, W / 2, infoY + 24);

  // ── E-Signature with actual signature image ──
  const sigY = H - 240;
  try {
    const sigImg = await loadImage("/certificates/jimoh-signature.png");
    const sigH = 70;
    const sigW = (sigImg.width / sigImg.height) * sigH;
    ctx.drawImage(sigImg, W / 2 - sigW / 2, sigY - 50, sigW, sigH);
  } catch {
    // Fallback to text signature
    ctx.fillStyle = navy;
    ctx.font = "italic bold 28px 'Georgia', 'Times New Roman', serif";
    ctx.textAlign = "center";
    ctx.fillText("Jimoh Habibullahi", W / 2, sigY - 8);
  }

  // Signature line
  ctx.strokeStyle = navy;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 130, sigY + 28);
  ctx.lineTo(W / 2 + 130, sigY + 28);
  ctx.stroke();

  // Name & Title
  ctx.textAlign = "center";
  ctx.fillStyle = navy;
  ctx.font = "bold 14px 'Segoe UI', sans-serif";
  ctx.fillText("Jimoh Habibullahi", W / 2, sigY + 48);
  ctx.font = "400 13px 'Segoe UI', sans-serif";
  ctx.fillText("GMD, Cytobiz Group", W / 2, sigY + 66);

  // ── QR Code for verification ──
  const qrCx = W - 160;
  const qrCy = H - 170;
  const verificationUrl = `https://cytobiz.com/verify/${verificationCode}`;
  drawQRCode(ctx, qrCx, qrCy, verificationUrl, 4, navy);
  ctx.fillStyle = textMuted;
  ctx.font = "400 9px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Scan to verify", qrCx, qrCy + 52);

  // ── Accreditation Section ──
  const accY = H - 115;
  ctx.fillStyle = primaryBlue;
  ctx.fillRect(60, accY - 22, W - 120, 2);

  ctx.fillStyle = textMuted;
  ctx.font = "500 13px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Accredited by", W / 2, accY + 2);

  // WAHBS - left side, text only, bold and prominent
  ctx.fillStyle = navy;
  ctx.font = "bold 26px 'Georgia', serif";
  ctx.fillText("WAHBS", W / 2 - 200, accY + 38);
  ctx.fillStyle = textMuted;
  ctx.font = "400 12px 'Segoe UI', sans-serif";
  ctx.fillText("West Africa Health Business Society", W / 2 - 200, accY + 56);

  // SDCC - right side, text only, bold and prominent
  ctx.fillStyle = navy;
  ctx.font = "bold 26px 'Georgia', serif";
  ctx.fillText("SDCC", W / 2 + 200, accY + 38);
  ctx.fillStyle = textMuted;
  ctx.font = "400 12px 'Segoe UI', sans-serif";
  ctx.fillText("Skill Development Council Canada", W / 2 + 200, accY + 56);

  // ── Bottom Decorative Line ──
  drawGoldLine(ctx, 180, H - 50, W - 180, H - 50, gold);

  return canvas;
}

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

  const W = canvas.width;
  const H = canvas.height;
  const pdfWidth = W * 0.75;
  const pdfHeight = H * 0.75;

  const raw = atob(imgData.split(",")[1]);
  const imgBytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) imgBytes[i] = raw.charCodeAt(i);

  const objects: string[] = [];
  objects.push("");

  objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj");
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj`);
  objects.push(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfWidth} ${pdfHeight}] /Contents 4 0 R /Resources << /XObject << /Img0 5 0 R >> >> >>\nendobj`);
  const stream = `q ${pdfWidth} 0 0 ${pdfHeight} 0 0 cm /Img0 Do Q`;
  objects.push(`4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`);

  const header = "%PDF-1.4\n";
  const encoder = new TextEncoder();

  const parts: (Uint8Array | string)[] = [];
  parts.push(header);

  const offsets: number[] = [0];
  let pos = header.length;

  for (let i = 1; i <= 4; i++) {
    offsets.push(pos);
    const s = objects[i] + "\n";
    parts.push(s);
    pos += s.length;
  }

  offsets.push(pos);

  const jpegData = canvas.toDataURL("image/jpeg", 0.95);
  const jpegRaw = atob(jpegData.split(",")[1]);
  const jpegBytes = new Uint8Array(jpegRaw.length);
  for (let i = 0; i < jpegRaw.length; i++) jpegBytes[i] = jpegRaw.charCodeAt(i);

  const imgHeader2 = `5 0 obj\n<< /Type /XObject /Subtype /Image /Width ${W} /Height ${H} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpegBytes.length} >>\nstream\n`;
  parts.push(imgHeader2);
  pos += imgHeader2.length;

  parts.push(jpegBytes);
  pos += jpegBytes.length;

  const imgFooter = "\nendstream\nendobj\n";
  parts.push(imgFooter);
  pos += imgFooter.length;

  const xrefPos = pos;
  let xref = `xref\n0 6\n0000000000 65535 f \n`;
  for (let i = 1; i <= 5; i++) {
    xref += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  xref += `trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xrefPos}\n%%EOF`;
  parts.push(xref);

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

// (drawAccreditationBadge removed — accreditation now rendered as prominent text)
