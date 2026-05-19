// ── Share token (localStorage) ─────────────────────────────────────────────

const SHARE_PREFIX = "mlk_share_";

interface ShareData {
  title: string;
  content: string;
  createdAt: string;
}

export function createShareToken(title: string, content: string): string {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(9)))
    .map((b) => b.toString(36).padStart(2, "0"))
    .join("")
    .slice(0, 12);

  const data: ShareData = { title, content, createdAt: new Date().toISOString() };
  try {
    localStorage.setItem(`${SHARE_PREFIX}${token}`, JSON.stringify(data));
  } catch {
    // localStorage plein — on retourne quand même le token
  }
  return token;
}

export function getSharedDocument(token: string): ShareData | null {
  try {
    const raw = localStorage.getItem(`${SHARE_PREFIX}${token}`);
    if (!raw) return null;
    return JSON.parse(raw) as ShareData;
  } catch {
    return null;
  }
}

export function getShareUrl(token: string): string {
  return `${window.location.origin}/share/${token}`;
}

// ── Markdown → HTML minimal (pour impression) ─────────────────────────────

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let inList = false;

  const flushList = () => {
    if (inList) { out.push("</ul>"); inList = false; }
  };

  const processInline = (text: string): string => {
    return escapeHtml(text)
      // Bold+italic
      .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Inline code
      .replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;padding:2px 5px;border-radius:3px;font-size:0.9em">$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#4f46e5">$1</a>');
  };

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i];

    // Code block
    if (raw.trim().startsWith("```")) {
      if (inCodeBlock) {
        out.push(`<pre style="background:#f5f5f5;padding:16px;border-radius:6px;overflow-x:auto;margin:12px 0"><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines = [];
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
      }
      continue;
    }
    if (inCodeBlock) { codeLines.push(raw); continue; }

    // Empty line
    if (raw.trim() === "") {
      flushList();
      out.push("<br>");
      continue;
    }

    // Headings
    const h3 = raw.match(/^###\s+(.*)/);
    const h2 = raw.match(/^##\s+(.*)/);
    const h1 = raw.match(/^#\s+(.*)/);
    if (h1) { flushList(); out.push(`<h1 style="font-size:1.8em;margin:24px 0 12px;font-weight:700;color:#1a1a1a">${processInline(h1[1])}</h1>`); continue; }
    if (h2) { flushList(); out.push(`<h2 style="font-size:1.4em;margin:20px 0 10px;font-weight:700;color:#1a1a1a">${processInline(h2[1])}</h2>`); continue; }
    if (h3) { flushList(); out.push(`<h3 style="font-size:1.1em;margin:16px 0 8px;font-weight:600;color:#1a1a1a">${processInline(h3[1])}</h3>`); continue; }

    // HR
    if (/^[-*_]{3,}$/.test(raw.trim())) {
      flushList();
      out.push('<hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">');
      continue;
    }

    // List items
    const li = raw.match(/^[-*+]\s+(.*)/);
    const oli = raw.match(/^\d+\.\s+(.*)/);
    if (li ?? oli) {
      if (!inList) { out.push('<ul style="margin:8px 0;padding-left:24px">'); inList = true; }
      out.push(`<li style="margin:4px 0">${processInline((li ?? oli)![1])}</li>`);
      continue;
    }

    // Paragraph
    flushList();
    out.push(`<p style="margin:8px 0;line-height:1.7">${processInline(raw)}</p>`);
  }

  flushList();
  return out.join("\n");
}

// ── Export Word (.doc via HTML) ────────────────────────────────────────────

export function downloadAsWord(title: string, content: string): void {
  const html = markdownToHtml(content);
  const safeTitle = title.replace(/\s+/g, "-").toLowerCase();

  // Word ouvre nativement les HTML avec ces headers MIME et namespace Office
  const wordDocument = `
<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:w="urn:schemas-microsoft-com:office:word"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml><w:WordDocument>
    <w:View>Print</w:View>
    <w:Zoom>90</w:Zoom>
    <w:DoNotOptimizeForBrowser/>
  </w:WordDocument></xml>
  <![endif]-->
  <style>
    body {
      font-family: Calibri, Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1a1a1a;
      margin: 2cm 2.5cm;
    }
    h1 { font-size: 18pt; margin: 18pt 0 10pt; color: #1a1a1a; }
    h2 { font-size: 14pt; margin: 14pt 0 8pt; color: #1a1a1a; }
    h3 { font-size: 12pt; margin: 12pt 0 6pt; color: #1a1a1a; }
    p  { margin: 6pt 0; }
    ul, ol { margin: 6pt 0; padding-left: 20pt; }
    li { margin: 3pt 0; }
    table { border-collapse: collapse; width: 100%; margin: 12pt 0; }
    td, th { border: 1pt solid #cccccc; padding: 5pt 8pt; font-size: 10pt; }
    th { background: #f2f2f2; font-weight: bold; }
    pre { background: #f5f5f5; padding: 10pt; border-radius: 3pt; font-size: 9pt; }
    code { font-family: Courier New, monospace; background: #f0f0f0; padding: 1pt 3pt; }
    hr  { border: none; border-top: 1pt solid #dddddd; margin: 14pt 0; }
    .footer { margin-top: 30pt; padding-top: 8pt; border-top: 1pt solid #dddddd;
              font-size: 8pt; color: #888888; }
  </style>
</head>
<body>
  ${html}
  <div class="footer">Généré par Malayka · ${new Date().toLocaleDateString("fr-FR")}</div>
</body>
</html>`.trim();

  const blob = new Blob([wordDocument], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${safeTitle}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Export PDF via window.print() ──────────────────────────────────────────

export function printDocument(title: string, content: string): void {
  const html = markdownToHtml(content);

  const printWin = window.open("", "_blank", "width=900,height=700");
  if (!printWin) {
    alert("Active les popups pour pouvoir imprimer.");
    return;
  }

  printWin.document.write(`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${escapeHtml(title)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Georgia, "Times New Roman", serif;
      font-size: 12pt;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 60px;
    }
    h1, h2, h3 { font-family: -apple-system, Arial, sans-serif; }
    h1 { font-size: 22pt; margin: 28px 0 14px; page-break-after: avoid; }
    h2 { font-size: 16pt; margin: 22px 0 10px; page-break-after: avoid; }
    h3 { font-size: 13pt; margin: 16px 0 8px; page-break-after: avoid; }
    p  { margin: 8px 0; }
    ul, ol { margin: 8px 0; padding-left: 24px; }
    li { margin: 4px 0; }
    pre { background: #f5f5f5; padding: 14px; border-radius: 4px; overflow-x: auto; page-break-inside: avoid; }
    code { font-family: monospace; font-size: 10pt; }
    hr { border: none; border-top: 1px solid #ddd; margin: 20px 0; }
    a  { color: #4f46e5; }
    .footer {
      margin-top: 60px;
      padding-top: 12px;
      border-top: 1px solid #ddd;
      font-size: 9pt;
      color: #888;
      font-family: sans-serif;
    }
    @media print {
      body { padding: 20px 40px; }
    }
  </style>
</head>
<body>
  ${html}
  <div class="footer">Généré par Malayka · ${new Date().toLocaleDateString("fr-FR")}</div>
  <script>
    window.onload = function() {
      window.print();
      setTimeout(() => window.close(), 500);
    };
  </script>
</body>
</html>`);
  printWin.document.close();
}
