/**
 * Generates a branded Cytobiz Medical Academy certificate.
 * Modern premium design with abstract shapes, gradients, and refined layout.
 */

interface CertificateParams {
  recipientName: string;
  courseTitle: string;
  courseType: "cohort" | "self_paced";
  verificationCode: string;
  issuedDate: string;
  logoUrl: string;
}

// ─── QR Code Generator ──────────────────────────────────────────────────────

function generateQRCodeData(text: string): boolean[][] {
  const size = 21;
  const grid: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));
  const drawFinder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++)
      for (let j = 0; j < 7; j++) {
        const isEdge = i === 0 || i === 6 || j === 0 || j === 6;
        const isInner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
        grid[r + i][c + j] = isEdge || isInner;
      }
  };
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);
  let hash = 0;
  for (let i = 0; i < text.length; i++) hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++) {
      if (grid[r][c]) continue;
      if ((r < 8 && c < 8) || (r < 8 && c >= size - 8) || (r >= size - 8 && c < 8)) continue;
      hash = ((hash << 5) - hash + r * size + c) | 0;
      grid[r][c] = Math.abs(hash) % 3 === 0;
    }
  return grid;
}

function drawQRCode(ctx: CanvasRenderingContext2D, cx: number, cy: number, text: string, moduleSize: number, color: string) {
  const data = generateQRCodeData(text);
  const size = data.length;
  const totalSize = size * moduleSize;
  const startX = cx - totalSize / 2;
  const startY = cy - totalSize / 2;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(startX - 6, startY - 6, totalSize + 12, totalSize + 12);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  roundRect(ctx, startX - 6, startY - 6, totalSize + 12, totalSize + 12, 4);
  ctx.stroke();
  ctx.fillStyle = color;
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (data[r][c])
        ctx.fillRect(startX + c * moduleSize, startY + r * moduleSize, moduleSize, moduleSize);
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ─── Abstract Shapes & Decorative Elements ───────────────────────────────────

function drawAbstractShapes(ctx: CanvasRenderingContext2D, W: number, H: number) {
  // Top-left geometric cluster
  ctx.save();
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = "#4400ff";
  ctx.beginPath();
  ctx.arc(-40, -40, 220, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.03;
  ctx.fillStyle = "#d4a843";
  ctx.beginPath();
  ctx.arc(80, 60, 140, 0, Math.PI * 2);
  ctx.fill();

  // Top-right abstract triangle cluster
  ctx.globalAlpha = 0.035;
  ctx.fillStyle = "#4400ff";
  ctx.beginPath();
  ctx.moveTo(W - 60, 0);
  ctx.lineTo(W, 0);
  ctx.lineTo(W, 180);
  ctx.closePath();
  ctx.fill();

  ctx.globalAlpha = 0.025;
  ctx.fillStyle = "#d4a843";
  ctx.beginPath();
  ctx.moveTo(W - 200, 0);
  ctx.lineTo(W, 0);
  ctx.lineTo(W, 100);
  ctx.closePath();
  ctx.fill();

  // Bottom-right geometric
  ctx.globalAlpha = 0.04;
  ctx.fillStyle = "#4400ff";
  ctx.beginPath();
  ctx.arc(W + 30, H + 30, 200, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 0.03;
  ctx.fillStyle = "#d4a843";
  ctx.beginPath();
  ctx.arc(W - 100, H - 40, 130, 0, Math.PI * 2);
  ctx.fill();

  // Bottom-left abstract shape
  ctx.globalAlpha = 0.025;
  ctx.fillStyle = "#4400ff";
  ctx.beginPath();
  ctx.moveTo(0, H);
  ctx.lineTo(0, H - 160);
  ctx.lineTo(120, H);
  ctx.closePath();
  ctx.fill();

  // Floating hexagons (scattered)
  ctx.globalAlpha = 0.02;
  ctx.strokeStyle = "#d4a843";
  ctx.lineWidth = 2;
  drawHexagon(ctx, 120, H / 2, 35);
  drawHexagon(ctx, W - 100, H / 2 - 80, 25);
  drawHexagon(ctx, W / 2 + 350, 120, 20);
  drawHexagon(ctx, W / 2 - 400, H - 180, 28);

  // Dotted arcs
  ctx.globalAlpha = 0.03;
  ctx.strokeStyle = "#4400ff";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 8]);
  ctx.beginPath();
  ctx.arc(W / 2, -200, 450, 0.3, Math.PI - 0.3);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(W / 2, H + 250, 500, Math.PI + 0.3, -0.3);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.restore();
}

function drawHexagon(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.stroke();
}

function drawModernBorder(ctx: CanvasRenderingContext2D, W: number, H: number, gold: string, blue: string) {
  // Outer gold border with rounded corners
  ctx.strokeStyle = gold;
  ctx.lineWidth = 6;
  roundRect(ctx, 20, 20, W - 40, H - 40, 12);
  ctx.stroke();

  // Inner blue hairline
  ctx.strokeStyle = blue;
  ctx.lineWidth = 1.5;
  roundRect(ctx, 34, 34, W - 68, H - 68, 8);
  ctx.stroke();

  // Corner accents (modern L-shapes with dots)
  const corners = [
    { x: 44, y: 44, dx: 1, dy: 1 },
    { x: W - 44, y: 44, dx: -1, dy: 1 },
    { x: 44, y: H - 44, dx: 1, dy: -1 },
    { x: W - 44, y: H - 44, dx: -1, dy: -1 },
  ];
  corners.forEach(({ x, y, dx, dy }) => {
    ctx.strokeStyle = gold;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, y + dy * 50);
    ctx.lineTo(x, y);
    ctx.lineTo(x + dx * 50, y);
    ctx.stroke();

    // Accent dot
    ctx.fillStyle = blue;
    ctx.beginPath();
    ctx.arc(x + dx * 6, y + dy * 6, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Small gold diamond
    ctx.fillStyle = gold;
    ctx.beginPath();
    ctx.moveTo(x + dx * 28, y);
    ctx.lineTo(x + dx * 32, y + dy * 4);
    ctx.lineTo(x + dx * 36, y);
    ctx.lineTo(x + dx * 32, y - dy * 4);
    ctx.closePath();
    ctx.fill();
  });
}

function drawModernDivider(ctx: CanvasRenderingContext2D, cx: number, y: number, halfW: number, gold: string) {
  const grad = ctx.createLinearGradient(cx - halfW, y, cx + halfW, y);
  grad.addColorStop(0, "rgba(212,168,67,0)");
  grad.addColorStop(0.2, gold);
  grad.addColorStop(0.45, gold);
  grad.addColorStop(0.5, "rgba(212,168,67,0)");
  grad.addColorStop(0.55, gold);
  grad.addColorStop(0.8, gold);
  grad.addColorStop(1, "rgba(212,168,67,0)");
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(cx - halfW, y);
  ctx.lineTo(cx + halfW, y);
  ctx.stroke();

  // Center diamond
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.moveTo(cx, y - 5);
  ctx.lineTo(cx + 6, y);
  ctx.lineTo(cx, y + 5);
  ctx.lineTo(cx - 6, y);
  ctx.closePath();
  ctx.fill();

  // Side dots
  ctx.beginPath();
  ctx.arc(cx - 18, y, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx + 18, y, 2, 0, Math.PI * 2);
  ctx.fill();
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

  const navy = "#1a1a3e";
  const primaryBlue = "#4400ff";
  const gold = "#d4a843";
  const textDark = "#1a1a3e";
  const textMuted = "#5a5a7a";
  const cream = "#fdfbf7";

  // ── Premium background with warm cream tone ──
  ctx.fillStyle = cream;
  ctx.fillRect(0, 0, W, H);

  // Subtle vertical gradient overlay
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, "rgba(255,255,255,0.6)");
  bgGrad.addColorStop(0.5, "rgba(255,255,255,0)");
  bgGrad.addColorStop(1, "rgba(212,168,67,0.03)");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Central radial glow
  const glow = ctx.createRadialGradient(W / 2, H / 2 - 50, 60, W / 2, H / 2, W * 0.6);
  glow.addColorStop(0, "rgba(68,0,255,0.02)");
  glow.addColorStop(0.5, "rgba(212,168,67,0.015)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // ── Abstract geometric shapes ──
  drawAbstractShapes(ctx, W, H);

  // ── Modern rounded border ──
  drawModernBorder(ctx, W, H, gold, primaryBlue);

  // ── Top gold accent bar ──
  const topBarGrad = ctx.createLinearGradient(200, 58, W - 200, 58);
  topBarGrad.addColorStop(0, "rgba(212,168,67,0)");
  topBarGrad.addColorStop(0.15, "rgba(212,168,67,0.4)");
  topBarGrad.addColorStop(0.5, gold);
  topBarGrad.addColorStop(0.85, "rgba(212,168,67,0.4)");
  topBarGrad.addColorStop(1, "rgba(212,168,67,0)");
  ctx.fillStyle = topBarGrad;
  ctx.fillRect(200, 56, W - 400, 3);

  // ── Logo ──
  try {
    const logo = await loadImage(logoUrl);
    const logoH = 200;
    const logoW = (logo.width / logo.height) * logoH;
    ctx.drawImage(logo, (W - logoW) / 2, 75, logoW, logoH);
  } catch {
    ctx.fillStyle = primaryBlue;
    ctx.font = "bold 38px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.fillText("CYTOBIZ MEDICAL & INNOVATION HUB", W / 2, 180);
  }

  // ── Academy name (spaced) ──
  ctx.fillStyle = navy;
  ctx.font = "600 13px 'Segoe UI', Arial, sans-serif";
  ctx.textAlign = "center";
  ctx.letterSpacing = "4px";
  ctx.fillText("C Y T O B I Z   M E D I C A L   &   I N N O V A T I O N   A C A D E M Y", W / 2, 282);

  drawModernDivider(ctx, W / 2, 306, 220, gold);

  // ── Certificate type ──
  const certType = courseType === "cohort" ? "DIPLOMA" : "COMPLETION";
  ctx.fillStyle = textMuted;
  ctx.font = "400 14px 'Segoe UI', sans-serif";
  ctx.fillText("C E R T I F I C A T E   O F", W / 2, 342);

  // Gradient text for cert type
  const certGrad = ctx.createLinearGradient(W / 2 - 200, 0, W / 2 + 200, 0);
  certGrad.addColorStop(0, navy);
  certGrad.addColorStop(0.5, primaryBlue);
  certGrad.addColorStop(1, navy);
  ctx.fillStyle = certGrad;
  ctx.font = "bold 52px 'Georgia', serif";
  ctx.fillText(certType, W / 2, 400);

  drawModernDivider(ctx, W / 2, 428, 180, gold);

  // ── "This is to certify that" ──
  ctx.fillStyle = textMuted;
  ctx.font = "italic 18px 'Georgia', serif";
  ctx.fillText("This is to certify that", W / 2, 466);

  // ── Recipient Name ──
  ctx.fillStyle = navy;
  ctx.font = "bold 48px 'Georgia', serif";
  ctx.fillText(recipientName, W / 2, 528);

  // Gold underline with fade
  const nameW = ctx.measureText(recipientName).width;
  const nameGrad = ctx.createLinearGradient((W - nameW) / 2 - 60, 544, (W + nameW) / 2 + 60, 544);
  nameGrad.addColorStop(0, "rgba(212,168,67,0)");
  nameGrad.addColorStop(0.1, gold);
  nameGrad.addColorStop(0.9, gold);
  nameGrad.addColorStop(1, "rgba(212,168,67,0)");
  ctx.strokeStyle = nameGrad;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo((W - nameW) / 2 - 60, 544);
  ctx.lineTo((W + nameW) / 2 + 60, 544);
  ctx.stroke();

  // ── Certification description ──
  ctx.fillStyle = textMuted;
  ctx.font = "italic 15px 'Georgia', serif";
  ctx.textAlign = "center";
  const certDesc =
    "This certifies that the holder has successfully completed training in Public Health Project Management, demonstrating competence in planning, implementing, monitoring, and evaluating public health programs and interventions.";
  const descLines = wrapText(ctx, certDesc, W - 400);
  let descY = 578;
  for (const line of descLines) {
    ctx.fillText(line, W / 2, descY);
    descY += 22;
  }

  // ── Course ──
  ctx.fillStyle = textMuted;
  ctx.font = "italic 17px 'Georgia', serif";
  ctx.fillText("Course:", W / 2, descY + 14);

  ctx.fillStyle = navy;
  ctx.font = "bold 26px 'Georgia', serif";
  const courseLines = wrapText(ctx, courseTitle, W - 360);
  let courseY = descY + 48;
  for (const line of courseLines) {
    ctx.fillText(line, W / 2, courseY);
    courseY += 34;
  }

  drawModernDivider(ctx, W / 2, courseY + 8, 140, gold);

  // ── Date & Serial ──
  const infoY = courseY + 40;

  // Date on left, Serial on right
  ctx.font = "500 13px 'Segoe UI', sans-serif";
  ctx.fillStyle = textMuted;
  ctx.textAlign = "center";
  ctx.fillText(`Issued: ${issuedDate}`, W / 2 - 160, infoY);

  ctx.fillStyle = navy;
  ctx.font = "bold 13px 'Segoe UI', sans-serif";
  ctx.fillText(`Serial No: ${verificationCode}`, W / 2 + 160, infoY);

  // ── Signature Section ──
  const sigCx = W / 2;
  const sigY = H - 235;

  // Signature image
  try {
    const sigImg = await loadImage("/certificates/jimoh-signature.png");
    const sigH = 65;
    const sigW = (sigImg.width / sigImg.height) * sigH;
    ctx.drawImage(sigImg, sigCx - sigW / 2, sigY - 48, sigW, sigH);
  } catch {
    ctx.fillStyle = navy;
    ctx.font = "italic bold 26px 'Georgia', serif";
    ctx.textAlign = "center";
    ctx.fillText("Jimoh Habibullahi", sigCx, sigY - 10);
  }

  // Signature line
  ctx.strokeStyle = gold;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(sigCx - 120, sigY + 24);
  ctx.lineTo(sigCx + 120, sigY + 24);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.fillStyle = navy;
  ctx.font = "bold 13px 'Segoe UI', sans-serif";
  ctx.fillText("Jimoh Habibullahi", sigCx, sigY + 44);
  ctx.font = "400 12px 'Segoe UI', sans-serif";
  ctx.fillStyle = textMuted;
  ctx.fillText("GMD, Cytobiz Group", sigCx, sigY + 60);

  // ── QR Code ──
  const qrCx = W - 150;
  const qrCy = H - 170;
  drawQRCode(ctx, qrCx, qrCy, `https://cytobiz.com/verify/${verificationCode}`, 3.5, navy);
  ctx.fillStyle = textMuted;
  ctx.font = "500 9px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Scan to verify", qrCx, qrCy + 48);

  // ── Accreditation Section ──
  const accY = H - 108;

  // Thin gold separator
  const accLineGrad = ctx.createLinearGradient(80, accY - 20, W - 80, accY - 20);
  accLineGrad.addColorStop(0, "rgba(212,168,67,0)");
  accLineGrad.addColorStop(0.15, gold);
  accLineGrad.addColorStop(0.85, gold);
  accLineGrad.addColorStop(1, "rgba(212,168,67,0)");
  ctx.strokeStyle = accLineGrad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, accY - 20);
  ctx.lineTo(W - 80, accY - 20);
  ctx.stroke();

  ctx.fillStyle = textMuted;
  ctx.font = "500 11px 'Segoe UI', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("A C C R E D I T E D   B Y", W / 2, accY);

  // WAHBS
  ctx.fillStyle = navy;
  ctx.font = "bold 24px 'Georgia', serif";
  ctx.fillText("WAHBS", W / 2 - 200, accY + 34);
  ctx.fillStyle = textMuted;
  ctx.font = "400 11px 'Segoe UI', sans-serif";
  ctx.fillText("West Africa Health Business Society", W / 2 - 200, accY + 52);

  // Separator dot
  ctx.fillStyle = gold;
  ctx.beginPath();
  ctx.arc(W / 2, accY + 36, 3, 0, Math.PI * 2);
  ctx.fill();

  // SDCC
  ctx.fillStyle = navy;
  ctx.font = "bold 24px 'Georgia', serif";
  ctx.fillText("SDCC", W / 2 + 200, accY + 34);
  ctx.fillStyle = textMuted;
  ctx.font = "400 11px 'Segoe UI', sans-serif";
  ctx.fillText("Skill Development Council Canada", W / 2 + 200, accY + 52);

  // ── Bottom accent bar ──
  const botBarGrad = ctx.createLinearGradient(200, H - 46, W - 200, H - 46);
  botBarGrad.addColorStop(0, "rgba(212,168,67,0)");
  botBarGrad.addColorStop(0.15, "rgba(212,168,67,0.4)");
  botBarGrad.addColorStop(0.5, gold);
  botBarGrad.addColorStop(0.85, "rgba(212,168,67,0.4)");
  botBarGrad.addColorStop(1, "rgba(212,168,67,0)");
  ctx.fillStyle = botBarGrad;
  ctx.fillRect(200, H - 48, W - 400, 3);

  return canvas;
}

// ─── Public API ──────────────────────────────────────────────────────────────

export async function generateCertificatePreviewURL(params: CertificateParams): Promise<string> {
  const canvas = await renderCertificateCanvas(params);
  return canvas.toDataURL("image/png", 1.0);
}

export async function generateCertificateJPEG(params: CertificateParams) {
  const canvas = await renderCertificateCanvas(params);
  triggerDownload(canvas.toDataURL("image/jpeg", 0.95), `Cytobiz-Certificate-${params.verificationCode}.jpeg`);
}

export async function generateCertificatePNG(params: CertificateParams) {
  const canvas = await renderCertificateCanvas(params);
  triggerDownload(canvas.toDataURL("image/png", 1.0), `Cytobiz-Certificate-${params.verificationCode}.png`);
}

export async function generateCertificatePDF(params: CertificateParams) {
  const canvas = await renderCertificateCanvas(params);
  const imgData = canvas.toDataURL("image/png", 1.0);
  const W = canvas.width;
  const H = canvas.height;
  const pdfWidth = W * 0.75;
  const pdfHeight = H * 0.75;

  const objects: string[] = [""];
  objects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj");
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj`);
  objects.push(`3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfWidth} ${pdfHeight}] /Contents 4 0 R /Resources << /XObject << /Img0 5 0 R >> >> >>\nendobj`);
  const stream = `q ${pdfWidth} 0 0 ${pdfHeight} 0 0 cm /Img0 Do Q`;
  objects.push(`4 0 obj\n<< /Length ${stream.length} >>\nstream\n${stream}\nendstream\nendobj`);

  const header = "%PDF-1.4\n";
  const encoder = new TextEncoder();
  const parts: (Uint8Array | string)[] = [header];
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
  for (let i = 1; i <= 5; i++) xref += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
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
