import React, {useMemo, useState} from 'react';
import {PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage} from 'pdf-lib';
import {
  AlertCircle,
  Award,
  Briefcase,
  Check,
  Copy,
  Download,
  FileSignature,
  FileSpreadsheet,
  FileText,
  ImagePlus,
  Mail,
  Plus,
  Printer,
  Receipt,
  Trash2,
} from 'lucide-react';
import type {Tool} from '../../data/tools';

interface Props {
  tool: Tool;
}

interface LineItem {
  description: string;
  qty: number;
  price: number;
}

function safePdfText(input: string): string {
  return input
    .replace(/₹/g, 'Rs.')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[—–]/g, '-')
    .replace(/•/g, '*')
    .replace(/…/g, '...')
    .replace(/[^\x20-\x7E\xA0-\xFF\n]/g, '');
}

function wrapTextLines(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number,
): string[] {
  const safe = safePdfText(text);
  const paragraphs = safe.split(/\r?\n/);
  const lines: string[] = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      lines.push('');
      continue;
    }
    const words = para.split(/\s+/);
    let current = '';
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

function hexToRgbTuple(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return [0.04, 0.55, 1];
  return [
    parseInt(clean.slice(0, 2), 16) / 255,
    parseInt(clean.slice(2, 4), 16) / 255,
    parseInt(clean.slice(4, 6), 16) / 255,
  ];
}

function formatMoney(currency: string, amount: number): string {
  const cur = currency.trim() || '$';
  const sep = cur.length > 1 && /[A-Za-z]$/.test(cur) ? ' ' : '';
  return `${cur}${sep}${amount.toFixed(2)}`;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function futureIso(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function readLogoAsDataUrl(file: File): Promise<{dataUrl: string; bytes: Uint8Array; isPng: boolean}> {
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf);
  const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Unable to read logo image.'));
    reader.readAsDataURL(file);
  });
  return {dataUrl, bytes, isPng};
}

function PrintStyles() {
  return (
    <style>{`
      @media print {
        body * { visibility: hidden !important; }
        #tp-printable-document, #tp-printable-document * { visibility: visible !important; }
        #tp-printable-document {
          position: fixed !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 24px !important;
          background: #ffffff !important;
          color: #0f172a !important;
          border: none !important;
          box-shadow: none !important;
        }
      }
    `}</style>
  );
}

export function DocumentToolsRunner({tool}: Props) {
  return (
    <>
      <PrintStyles />
      {tool.slug === 'document-receipt-generator' && <ReceiptWorkspace tool={tool} />}
      {tool.slug === 'document-certificate-generator' && <CertificateWorkspace tool={tool} />}
      {tool.slug === 'document-letter-generator' && <LetterWorkspace tool={tool} />}
      {tool.slug === 'document-contract-generator' && <ContractWorkspace tool={tool} />}
      {tool.slug === 'document-proposal-generator' && <ProposalWorkspace tool={tool} />}
      {tool.slug === 'document-quote-generator' && <QuoteWorkspace tool={tool} />}
      {tool.slug === 'document-bill-generator' && <BillWorkspace tool={tool} />}
      {tool.slug === 'document-invoice-generator' && <InvoiceWorkspace tool={tool} />}
    </>
  );
}

/* ===========================
   1. RECEIPT GENERATOR
   =========================== */
function ReceiptWorkspace({tool}: Props) {
  const [receiptNo, setReceiptNo] = useState('RCPT-2026-104');
  const [date, setDate] = useState(todayIso());
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [currency, setCurrency] = useState('$');
  const [businessName, setBusinessName] = useState('Northstar Digital Studio');
  const [businessAddress, setBusinessAddress] = useState('420 Market St, Suite 300\nSan Francisco, CA 94105');
  const [payerName, setPayerName] = useState('Jordan Avery');
  const [payerContact, setPayerContact] = useState('jordan@example.com');
  const [items, setItems] = useState<LineItem[]>([
    {description: 'Web Design Retainer', qty: 1, price: 450},
    {description: 'SSL & Hosting Setup', qty: 1, price: 65},
  ]);
  const [notes, setNotes] = useState('Paid in full. Thank you for your business.');

  const total = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.qty) || 0) * (Number(item.price) || 0), 0),
    [items],
  );

  const handleDownloadPdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]);
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const reg = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let y = 780;
    page.drawText('PAYMENT RECEIPT', {x: 48, y, size: 20, font: bold, color: rgb(0.06, 0.09, 0.16)});
    page.drawText(safePdfText(`Receipt #: ${receiptNo}`), {x: 380, y: y + 4, size: 10, font: bold, color: rgb(0.2, 0.25, 0.33)});
    page.drawText(safePdfText(`Date: ${date}`), {x: 380, y: y - 12, size: 10, font: reg, color: rgb(0.35, 0.4, 0.48)});
    y -= 42;

    page.drawText(safePdfText(businessName), {x: 48, y, size: 12, font: bold, color: rgb(0.06, 0.09, 0.16)});
    y -= 16;
    for (const line of safePdfText(businessAddress).split('\n')) {
      page.drawText(line, {x: 48, y, size: 9.5, font: reg, color: rgb(0.35, 0.4, 0.48)});
      y -= 14;
    }

    y -= 14;
    page.drawText(safePdfText(`Received From: ${payerName}`), {x: 48, y, size: 10.5, font: bold, color: rgb(0.06, 0.09, 0.16)});
    page.drawText(safePdfText(`Payment Method: ${paymentMethod}`), {x: 340, y, size: 10, font: reg, color: rgb(0.2, 0.25, 0.33)});
    y -= 15;
    if (payerContact.trim()) {
      page.drawText(safePdfText(payerContact), {x: 48, y, size: 9.5, font: reg, color: rgb(0.35, 0.4, 0.48)});
      y -= 15;
    }

    y -= 14;
    page.drawRectangle({x: 48, y: y - 4, width: 499, height: 22, color: rgb(0.95, 0.96, 0.98)});
    page.drawText('Description', {x: 56, y: y + 3, size: 9.5, font: bold, color: rgb(0.15, 0.2, 0.28)});
    page.drawText('Qty', {x: 340, y: y + 3, size: 9.5, font: bold, color: rgb(0.15, 0.2, 0.28)});
    page.drawText('Unit Price', {x: 395, y: y + 3, size: 9.5, font: bold, color: rgb(0.15, 0.2, 0.28)});
    page.drawText('Amount', {x: 480, y: y + 3, size: 9.5, font: bold, color: rgb(0.15, 0.2, 0.28)});
    y -= 24;

    for (const item of items) {
      const amt = (Number(item.qty) || 0) * (Number(item.price) || 0);
      page.drawText(safePdfText(item.description.slice(0, 48) || '-'), {x: 56, y, size: 9.5, font: reg, color: rgb(0.1, 0.12, 0.18)});
      page.drawText(String(item.qty), {x: 340, y, size: 9.5, font: reg, color: rgb(0.1, 0.12, 0.18)});
      page.drawText(safePdfText(formatMoney(currency, Number(item.price) || 0)), {x: 395, y, size: 9.5, font: reg, color: rgb(0.1, 0.12, 0.18)});
      page.drawText(safePdfText(formatMoney(currency, amt)), {x: 480, y, size: 9.5, font: bold, color: rgb(0.06, 0.09, 0.16)});
      y -= 20;
    }

    y -= 10;
    page.drawLine({start: {x: 48, y: y + 8}, end: {x: 547, y: y + 8}, thickness: 1, color: rgb(0.85, 0.88, 0.92)});
    page.drawText('TOTAL PAID:', {x: 380, y: y - 8, size: 11, font: bold, color: rgb(0.06, 0.09, 0.16)});
    page.drawText(safePdfText(formatMoney(currency, total)), {x: 480, y: y - 8, size: 12, font: bold, color: rgb(0.02, 0.52, 0.35)});

    if (notes.trim()) {
      y -= 42;
      for (const line of wrapTextLines(notes, reg, 9.5, 495)) {
        page.drawText(line, {x: 48, y, size: 9.5, font: reg, color: rgb(0.35, 0.4, 0.48)});
        y -= 14;
      }
    }

    const bytes = await pdfDoc.save();
    const out = new Uint8Array(new ArrayBuffer(bytes.byteLength));
    out.set(bytes);
    downloadBlob(new Blob([out], {type: 'application/pdf'}), `${receiptNo || 'receipt'}.pdf`);
  };

  const handleDownloadPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 560 + items.length * 42;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText('PAYMENT RECEIPT', 56, 76);

    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.textAlign = 'right';
    ctx.fillText(`Receipt #: ${receiptNo}`, 844, 68);
    ctx.font = '15px sans-serif';
    ctx.fillText(`Date: ${date}`, 844, 92);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(businessName, 56, 134);
    ctx.font = '15px sans-serif';
    ctx.fillStyle = '#475569';
    businessAddress.split('\n').forEach((line, idx) => {
      ctx.fillText(line, 56, 158 + idx * 20);
    });

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText(`Received From: ${payerName}`, 56, 234);
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#475569';
    ctx.fillText(`Payment Method: ${paymentMethod}`, 540, 234);
    if (payerContact.trim()) ctx.fillText(payerContact, 56, 256);

    let ty = 304;
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(56, ty - 24, 788, 34);
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('Description', 72, ty - 2);
    ctx.fillText('Qty', 500, ty - 2);
    ctx.fillText('Rate', 600, ty - 2);
    ctx.fillText('Amount', 740, ty - 2);

    ty += 34;
    ctx.font = '15px sans-serif';
    for (const item of items) {
      const amt = (Number(item.qty) || 0) * (Number(item.price) || 0);
      ctx.fillStyle = '#0f172a';
      ctx.fillText(item.description.slice(0, 42), 72, ty);
      ctx.fillText(String(item.qty), 500, ty);
      ctx.fillText(formatMoney(currency, Number(item.price) || 0), 600, ty);
      ctx.fillText(formatMoney(currency, amt), 740, ty);
      ty += 38;
    }

    ctx.strokeStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(56, ty - 12);
    ctx.lineTo(844, ty - 12);
    ctx.stroke();

    ctx.fillStyle = '#047857';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`TOTAL PAID: ${formatMoney(currency, total)}`, 540, ty + 24);

    if (notes.trim()) {
      ctx.fillStyle = '#64748b';
      ctx.font = '14px sans-serif';
      ctx.fillText(notes.slice(0, 95), 56, ty + 68);
    }

    canvas.toBlob((blob) => {
      if (blob) downloadBlob(blob, `${receiptNo || 'receipt'}.png`);
    }, 'image/png');
  };

  return (
    <DocumentShell
      icon={<Receipt className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle="Template payment receipt · Auto-calculates total · Watermark-free PDF, PNG & Print (NOT AI)"
      actions={
        <>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPng}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PNG</span>
          </button>
          <PrintButton />
        </>
      }
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Receipt Number" value={receiptNo} onChange={setReceiptNo} />
            <Field label="Date" type="date" value={date} onChange={setDate} />
            <Field label="Payment Method" value={paymentMethod} onChange={setPaymentMethod} />
            <Field label="Currency Symbol / Code" value={currency} onChange={setCurrency} />
          </div>
          <Field label="Business / Issuer Name" value={businessName} onChange={setBusinessName} />
          <TextAreaField label="Business Address" rows={2} value={businessAddress} onChange={setBusinessAddress} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Received From (Payer)" value={payerName} onChange={setPayerName} />
            <Field label="Payer Email / Contact" value={payerContact} onChange={setPayerContact} />
          </div>
          <LineItemsEditor items={items} setItems={setItems} />
          <TextAreaField label="Receipt Notes" rows={2} value={notes} onChange={setNotes} />
        </div>
      }
      preview={
        <div className="space-y-6 text-slate-900">
          <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-xl font-bold tracking-tight">PAYMENT RECEIPT</h3>
              <p className="text-xs font-semibold text-slate-700 mt-1">{businessName}</p>
              <p className="text-xs text-slate-500 whitespace-pre-line">{businessAddress}</p>
            </div>
            <div className="text-right text-xs space-y-1 tabular-nums">
              <div className="font-bold text-slate-900">Receipt #{receiptNo}</div>
              <div className="text-slate-600">Date: {date}</div>
              <div className="text-slate-600">Method: {paymentMethod}</div>
            </div>
          </div>

          <div className="text-xs">
            <span className="text-slate-500">Received From: </span>
            <span className="font-bold text-slate-900">{payerName}</span>
            {payerContact && <span className="text-slate-500"> ({payerContact})</span>}
          </div>

          <ItemsPreviewTable items={items} currency={currency} />

          <div className="flex justify-end border-t border-slate-200 pt-3">
            <div className="text-right tabular-nums">
              <div className="text-xs text-slate-500">Total Paid</div>
              <div className="text-lg font-bold text-emerald-700">{formatMoney(currency, total)}</div>
            </div>
          </div>

          {notes && <p className="text-xs text-slate-600 border-t border-slate-100 pt-3">{notes}</p>}
        </div>
      }
    />
  );
}

/* ===========================
   2. CERTIFICATE GENERATOR (4 Templates + Logo + Colours)
   =========================== */
const CERT_TEMPLATES = [
  {id: 'classic', name: '01. Classic Gold Frame', accent: '#B45309'},
  {id: 'navy', name: '02. Modern Navy Ribbon', accent: '#0A8CFF'},
  {id: 'minimal', name: '03. Minimalist Slate', accent: '#1E293B'},
  {id: 'emerald', name: '04. Emerald Crest', accent: '#059669'},
] as const;

function CertificateWorkspace({tool}: Props) {
  const [templateId, setTemplateId] = useState<'classic' | 'navy' | 'minimal' | 'emerald'>('classic');
  const [accentColor, setAccentColor] = useState('#B45309');
  const [awardTitle, setAwardTitle] = useState('CERTIFICATE OF ACHIEVEMENT');
  const [recipientName, setRecipientName] = useState('Elena Rostova');
  const [subtitle, setSubtitle] = useState('For successfully completing the Full-Stack Engineering Intensive with distinction.');
  const [date, setDate] = useState(todayIso());
  const [issuerOrg, setIssuerOrg] = useState('Pacific Technical Institute');
  const [signatoryName, setSignatoryName] = useState('Dr. Marcus Vance');
  const [signatoryTitle, setSignatoryTitle] = useState('Program Director');
  const [logo, setLogo] = useState<{dataUrl: string; bytes: Uint8Array; isPng: boolean} | null>(null);

  const handleSelectTemplate = (id: 'classic' | 'navy' | 'minimal' | 'emerald') => {
    setTemplateId(id);
    const tpl = CERT_TEMPLATES.find((t) => t.id === id);
    if (tpl) setAccentColor(tpl.accent);
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const loaded = await readLogoAsDataUrl(file);
    setLogo(loaded);
    e.target.value = '';
  };

  const handleDownloadPdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([841.89, 595.28]); // Landscape A4
    const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const serif = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const sans = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const [r, g, b] = hexToRgbTuple(accentColor);
    const accent = rgb(r, g, b);

    // Outer background border styled by template
    if (templateId === 'classic') {
      page.drawRectangle({x: 24, y: 24, width: 793.89, height: 547.28, borderColor: accent, borderWidth: 4});
      page.drawRectangle({x: 34, y: 34, width: 773.89, height: 527.28, borderColor: accent, borderWidth: 1});
    } else if (templateId === 'navy') {
      page.drawRectangle({x: 0, y: 0, width: 841.89, height: 22, color: accent});
      page.drawRectangle({x: 0, y: 573.28, width: 841.89, height: 22, color: accent});
      page.drawRectangle({x: 32, y: 40, width: 777.89, height: 515.28, borderColor: rgb(0.85, 0.88, 0.92), borderWidth: 1});
    } else if (templateId === 'emerald') {
      page.drawRectangle({x: 28, y: 28, width: 42, height: 539.28, color: accent});
      page.drawRectangle({x: 28, y: 28, width: 785.89, height: 539.28, borderColor: accent, borderWidth: 2});
    } else {
      page.drawRectangle({x: 36, y: 36, width: 769.89, height: 523.28, borderColor: accent, borderWidth: 1.5});
    }

    let topY = 510;
    if (logo) {
      const embedded = logo.isPng
        ? await pdfDoc.embedPng(logo.bytes)
        : await pdfDoc.embedJpg(logo.bytes);
      const maxH = 56;
      const scale = Math.min(140 / embedded.width, maxH / embedded.height);
      const w = embedded.width * scale;
      const h = embedded.height * scale;
      page.drawImage(embedded, {x: (841.89 - w) / 2, y: 486, width: w, height: h});
      topY = 456;
    }

    const drawCentered = (txt: string, yPos: number, font: PDFFont, size: number, col = rgb(0.08, 0.1, 0.16)) => {
      const safe = safePdfText(txt);
      const w = font.widthOfTextAtSize(safe, size);
      page.drawText(safe, {x: Math.max(60, (841.89 - w) / 2), y: yPos, size, font, color: col});
    };

    drawCentered(issuerOrg.toUpperCase(), topY, sans, 11, accent);
    drawCentered(awardTitle, topY - 40, bold, 26);
    drawCentered('IS PROUDLY PRESENTED TO', topY - 78, sans, 10, rgb(0.4, 0.45, 0.52));
    drawCentered(recipientName, topY - 126, bold, 34, accent);

    page.drawLine({start: {x: 220, y: topY - 142}, end: {x: 622, y: topY - 142}, thickness: 1, color: rgb(0.8, 0.84, 0.88)});

    const descLines = wrapTextLines(subtitle, serif, 14, 540);
    let descY = topY - 175;
    for (const line of descLines.slice(0, 3)) {
      drawCentered(line, descY, serif, 14, rgb(0.22, 0.27, 0.34));
      descY -= 20;
    }

    // Signatures footer
    page.drawLine({start: {x: 130, y: 112}, end: {x: 330, y: 112}, thickness: 1, color: rgb(0.4, 0.45, 0.52)});
    page.drawText(safePdfText(date), {x: 195, y: 122, size: 11, font: sans, color: rgb(0.1, 0.12, 0.18)});
    page.drawText('DATE AWARDED', {x: 192, y: 96, size: 8.5, font: sans, color: rgb(0.45, 0.5, 0.56)});

    page.drawLine({start: {x: 510, y: 112}, end: {x: 710, y: 112}, thickness: 1, color: rgb(0.4, 0.45, 0.52)});
    page.drawText(safePdfText(signatoryName), {x: 540, y: 122, size: 11, font: bold, color: rgb(0.1, 0.12, 0.18)});
    page.drawText(safePdfText(signatoryTitle), {x: 540, y: 96, size: 8.5, font: sans, color: rgb(0.45, 0.5, 0.56)});

    const bytes = await pdfDoc.save();
    const out = new Uint8Array(new ArrayBuffer(bytes.byteLength));
    out.set(bytes);
    downloadBlob(new Blob([out], {type: 'application/pdf'}), 'certificate.pdf');
  };

  return (
    <DocumentShell
      icon={<Award className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle="4 landscape PDF templates · Optional local logo & custom accent colour · Zero watermarks (NOT AI)"
      actions={
        <>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </button>
          <PrintButton />
        </>
      }
      form={
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Certificate Template (4 Built-In Layouts)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CERT_TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl.id)}
                  className={`px-3 py-2 rounded-lg text-left text-xs font-semibold border transition-colors cursor-pointer ${
                    templateId === tpl.id
                      ? 'border-[#0A8CFF] bg-sky-50 dark:bg-sky-950/40 text-slate-900 dark:text-white'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {tpl.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Accent Colour
              </label>
              <input
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white p-1 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Optional Logo (PNG/JPG)
              </label>
              <label className="flex items-center justify-center gap-1.5 h-9 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer hover:border-[#0A8CFF]">
                <ImagePlus className="h-3.5 w-3.5 text-[#0A8CFF]" />
                <span>{logo ? 'Change Logo' : 'Upload Logo'}</span>
                <input type="file" accept="image/png,image/jpeg" onChange={handleLogoUpload} className="hidden" />
              </label>
            </div>
          </div>

          <Field label="Certificate Title" value={awardTitle} onChange={setAwardTitle} />
          <Field label="Recipient Name" value={recipientName} onChange={setRecipientName} />
          <TextAreaField label="Citation / Reason" rows={2} value={subtitle} onChange={setSubtitle} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Issuing Organization" value={issuerOrg} onChange={setIssuerOrg} />
            <Field label="Award Date" type="date" value={date} onChange={setDate} />
            <Field label="Signatory Name" value={signatoryName} onChange={setSignatoryName} />
            <Field label="Signatory Title" value={signatoryTitle} onChange={setSignatoryTitle} />
          </div>
        </div>
      }
      preview={
        <div
          className="relative p-7 text-center bg-white text-slate-900 rounded-lg min-h-[360px] flex flex-col justify-between"
          style={{
            border:
              templateId === 'classic'
                ? `4px double ${accentColor}`
                : templateId === 'navy'
                  ? `1px solid #cbd5e1`
                  : templateId === 'emerald'
                    ? `2px solid ${accentColor}`
                    : `1.5px solid ${accentColor}`,
            borderTopWidth: templateId === 'navy' ? '12px' : undefined,
            borderBottomWidth: templateId === 'navy' ? '12px' : undefined,
            borderTopColor: templateId === 'navy' ? accentColor : undefined,
            borderBottomColor: templateId === 'navy' ? accentColor : undefined,
            borderLeftWidth: templateId === 'emerald' ? '18px' : undefined,
          }}
        >
          <div className="space-y-2">
            {logo && (
              <img src={logo.dataUrl} alt="Organization logo" className="h-12 mx-auto object-contain mb-2" />
            )}
            <div className="text-[11px] font-bold tracking-widest uppercase" style={{color: accentColor}}>
              {issuerOrg}
            </div>
            <h3 className="text-xl font-bold font-serif tracking-wide text-slate-900">{awardTitle}</h3>
            <div className="text-[10px] tracking-widest text-slate-500 uppercase pt-1">
              Is Proudly Presented To
            </div>
            <div className="text-2xl font-serif font-bold py-1 border-b border-slate-200 max-w-sm mx-auto" style={{color: accentColor}}>
              {recipientName}
            </div>
            <p className="text-xs text-slate-600 max-w-md mx-auto pt-2 leading-relaxed font-serif">
              {subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-8 max-w-md mx-auto w-full text-xs">
            <div className="border-t border-slate-400 pt-1.5">
              <div className="font-semibold text-slate-800 tabular-nums">{date}</div>
              <div className="text-[10px] text-slate-500 uppercase">Date Awarded</div>
            </div>
            <div className="border-t border-slate-400 pt-1.5">
              <div className="font-semibold text-slate-800">{signatoryName}</div>
              <div className="text-[10px] text-slate-500 uppercase">{signatoryTitle}</div>
            </div>
          </div>
        </div>
      }
    />
  );
}

/* ===========================
   3. LETTER GENERATOR
   =========================== */
function LetterWorkspace({tool}: Props) {
  const [style, setStyle] = useState<'Formal' | 'Business' | 'Informal'>('Business');
  const [senderBlock, setSenderBlock] = useState('Samira Patel\n742 Evergreen Terrace\nAustin, TX 78701');
  const [date, setDate] = useState(todayIso());
  const [recipientBlock, setRecipientBlock] = useState('Hiring Committee\nBrightway Systems LLC\n100 Congress Ave\nAustin, TX 78701');
  const [subject, setSubject] = useState('Application for Operations Coordinator Role');
  const [greeting, setGreeting] = useState('Dear Hiring Committee,');
  const [body, setBody] = useState(
    'I am writing to express my interest in the Operations Coordinator position at Brightway Systems.\n\nOver the past four years, I have coordinated vendor schedules, streamlined inventory workflows, and maintained clear reporting for cross-functional teams.\n\nThank you for your time and consideration. I look forward to speaking with you.',
  );
  const [closing, setClosing] = useState('Sincerely,');
  const [signature, setSignature] = useState('Samira Patel');
  const [copied, setCopied] = useState(false);

  const plainLetterText = useMemo(() => {
    const parts = [senderBlock, '', date, '', recipientBlock, ''];
    if (style !== 'Informal' && subject.trim()) {
      parts.push(`Subject: ${subject}`, '');
    }
    parts.push(greeting, '', body, '', closing, '', signature);
    return parts.join('\n');
  }, [style, senderBlock, date, recipientBlock, subject, greeting, body, closing, signature]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plainLetterText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  const handleDownloadPdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const reg = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const bold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    let page = pdfDoc.addPage([595.28, 841.89]);
    let y = 780;
    const ensureSpace = (needed = 18) => {
      if (y < 54 + needed) {
        page = pdfDoc.addPage([595.28, 841.89]);
        y = 780;
      }
    };

    for (const line of safePdfText(senderBlock).split('\n')) {
      page.drawText(line, {x: 54, y, size: 11, font: reg, color: rgb(0.1, 0.12, 0.18)});
      y -= 15;
    }
    y -= 10;
    page.drawText(safePdfText(date), {x: 54, y, size: 11, font: reg, color: rgb(0.1, 0.12, 0.18)});
    y -= 20;

    for (const line of safePdfText(recipientBlock).split('\n')) {
      page.drawText(line, {x: 54, y, size: 11, font: reg, color: rgb(0.1, 0.12, 0.18)});
      y -= 15;
    }
    y -= 12;

    if (style !== 'Informal' && subject.trim()) {
      page.drawText(safePdfText(`Subject: ${subject}`), {x: 54, y, size: 11.5, font: bold, color: rgb(0.06, 0.09, 0.16)});
      y -= 22;
    }

    page.drawText(safePdfText(greeting), {x: 54, y, size: 11.5, font: reg, color: rgb(0.08, 0.1, 0.16)});
    y -= 20;

    for (const line of wrapTextLines(body, reg, 11.5, 487)) {
      ensureSpace();
      if (line) {
        page.drawText(line, {x: 54, y, size: 11.5, font: reg, color: rgb(0.1, 0.12, 0.18)});
        y -= 16;
      } else {
        y -= 10;
      }
    }

    y -= 14;
    ensureSpace(45);
    page.drawText(safePdfText(closing), {x: 54, y, size: 11.5, font: reg, color: rgb(0.1, 0.12, 0.18)});
    y -= 30;
    page.drawText(safePdfText(signature), {x: 54, y, size: 11.5, font: bold, color: rgb(0.06, 0.09, 0.16)});

    const bytes = await pdfDoc.save();
    const out = new Uint8Array(new ArrayBuffer(bytes.byteLength));
    out.set(bytes);
    downloadBlob(new Blob([out], {type: 'application/pdf'}), 'letter.pdf');
  };

  return (
    <DocumentShell
      icon={<Mail className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle="Formal, business & informal letter layout templates · Clean PDF, Text, Copy & Print (NOT AI)"
      actions={
        <>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
          <PrintButton />
        </>
      }
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Letter Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value as 'Formal' | 'Business' | 'Informal')}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs"
              >
                <option value="Business">Business</option>
                <option value="Formal">Formal</option>
                <option value="Informal">Informal</option>
              </select>
            </div>
            <Field label="Date" type="date" value={date} onChange={setDate} />
          </div>
          <TextAreaField label="Sender Name & Address" rows={3} value={senderBlock} onChange={setSenderBlock} />
          <TextAreaField label="Recipient Name & Address" rows={3} value={recipientBlock} onChange={setRecipientBlock} />
          {style !== 'Informal' && (
            <Field label="Subject Line" value={subject} onChange={setSubject} />
          )}
          <Field label="Greeting / Salutation" value={greeting} onChange={setGreeting} />
          <TextAreaField label="Body Paragraphs" rows={6} value={body} onChange={setBody} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Closing" value={closing} onChange={setClosing} />
            <Field label="Signature Name" value={signature} onChange={setSignature} />
          </div>
        </div>
      }
      preview={
        <div className="space-y-4 text-xs sm:text-[13px] font-serif text-slate-900 leading-relaxed">
          <div className="whitespace-pre-line">{senderBlock}</div>
          <div className="tabular-nums">{date}</div>
          <div className="whitespace-pre-line">{recipientBlock}</div>
          {style !== 'Informal' && subject.trim() && (
            <div className="font-bold pt-1">Subject: {subject}</div>
          )}
          <div>{greeting}</div>
          <div className="whitespace-pre-line">{body}</div>
          <div className="pt-2">{closing}</div>
          <div className="font-bold pt-4">{signature}</div>
        </div>
      }
    />
  );
}

/* ===========================
   4. CONTRACT GENERATOR (NOT LEGAL ADVICE)
   =========================== */
interface ContractClause {
  title: string;
  text: string;
}

const CONTRACT_STARTERS: Record<string, {title: string; clauses: ContractClause[]}> = {
  nda: {
    title: 'MUTUAL NON-DISCLOSURE AGREEMENT (TEMPLATE)',
    clauses: [
      {
        title: '1. Confidential Information',
        text: 'Each party agrees not to disclose non-public business, technical, or financial information shared by the other party in connection with evaluating a potential collaboration.',
      },
      {
        title: '2. Exclusions',
        text: 'Confidential information does not include material that is publicly available without breach, independently developed, or lawfully received from a third party.',
      },
      {
        title: '3. Term',
        text: 'This agreement remains in effect for two (2) years from the Effective Date unless terminated earlier in writing by mutual consent.',
      },
    ],
  },
  service: {
    title: 'BASIC SERVICE AGREEMENT (TEMPLATE)',
    clauses: [
      {
        title: '1. Scope of Services',
        text: 'Service Provider agrees to deliver the agreed deliverables as described in the written project schedule.',
      },
      {
        title: '2. Fees & Payment',
        text: 'Client shall pay agreed milestone fees within fifteen (15) days of receiving a valid invoice.',
      },
      {
        title: '3. Ownership & Termination',
        text: 'Upon full payment, final deliverables transfer as agreed. Either party may terminate with 14 days written notice.',
      },
    ],
  },
};

function ContractWorkspace({tool}: Props) {
  const [starter, setStarter] = useState<'nda' | 'service'>('nda');
  const [agreementTitle, setAgreementTitle] = useState(CONTRACT_STARTERS.nda.title);
  const [effectiveDate, setEffectiveDate] = useState(todayIso());
  const [jurisdiction, setJurisdiction] = useState('State of Delaware');
  const [partyA, setPartyA] = useState('Alpha Studio LLC (120 Pine St, Austin, TX)');
  const [partyB, setPartyB] = useState('Beta Logistics Inc. (500 Oak Ave, Denver, CO)');
  const [clauses, setClauses] = useState<ContractClause[]>(CONTRACT_STARTERS.nda.clauses);
  const [copied, setCopied] = useState(false);

  const loadStarter = (key: 'nda' | 'service') => {
    setStarter(key);
    setAgreementTitle(CONTRACT_STARTERS[key].title);
    setClauses(CONTRACT_STARTERS[key].clauses.map((c) => ({...c})));
  };

  const plainContract = useMemo(() => {
    const lines = [
      agreementTitle,
      `Effective Date: ${effectiveDate}`,
      `Governing Location / Jurisdiction: ${jurisdiction}`,
      '',
      `Party A: ${partyA}`,
      `Party B: ${partyB}`,
      '',
      ...clauses.flatMap((c) => [c.title, c.text, '']),
      'SIGNATURES:',
      `Party A (${partyA.split('(')[0].trim()}): _______________________   Date: __________`,
      `Party B (${partyB.split('(')[0].trim()}): _______________________   Date: __________`,
    ];
    return lines.join('\n');
  }, [agreementTitle, effectiveDate, jurisdiction, partyA, partyB, clauses]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(plainContract);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  };

  const handleDownloadPdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const reg = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let page = pdfDoc.addPage([595.28, 841.89]);
    let y = 780;
    const ensureSpace = (needed = 24) => {
      if (y < 54 + needed) {
        page = pdfDoc.addPage([595.28, 841.89]);
        y = 780;
      }
    };

    for (const line of wrapTextLines(agreementTitle, bold, 15, 495)) {
      page.drawText(line, {x: 50, y, size: 15, font: bold, color: rgb(0.06, 0.09, 0.16)});
      y -= 20;
    }
    page.drawText(safePdfText(`Effective Date: ${effectiveDate}   |   Jurisdiction: ${jurisdiction}`), {
      x: 50,
      y,
      size: 9.5,
      font: reg,
      color: rgb(0.35, 0.4, 0.48),
    });
    y -= 24;

    page.drawText(safePdfText(`Party A: ${partyA}`), {x: 50, y, size: 10, font: bold, color: rgb(0.1, 0.12, 0.18)});
    y -= 16;
    page.drawText(safePdfText(`Party B: ${partyB}`), {x: 50, y, size: 10, font: bold, color: rgb(0.1, 0.12, 0.18)});
    y -= 26;

    for (const clause of clauses) {
      ensureSpace(36);
      page.drawText(safePdfText(clause.title), {x: 50, y, size: 10.5, font: bold, color: rgb(0.08, 0.1, 0.16)});
      y -= 15;
      for (const line of wrapTextLines(clause.text, reg, 10, 495)) {
        ensureSpace(16);
        page.drawText(line, {x: 50, y, size: 10, font: reg, color: rgb(0.2, 0.25, 0.33)});
        y -= 14;
      }
      y -= 10;
    }

    ensureSpace(80);
    y -= 16;
    page.drawText('IN WITNESS WHEREOF, the parties execute this agreement:', {x: 50, y, size: 10, font: bold, color: rgb(0.1, 0.12, 0.18)});
    y -= 36;
    page.drawLine({start: {x: 50, y}, end: {x: 260, y}, thickness: 1, color: rgb(0.4, 0.45, 0.52)});
    page.drawLine({start: {x: 325, y}, end: {x: 535, y}, thickness: 1, color: rgb(0.4, 0.45, 0.52)});
    page.drawText('Party A Signature & Date', {x: 50, y: y - 14, size: 9, font: reg, color: rgb(0.35, 0.4, 0.48)});
    page.drawText('Party B Signature & Date', {x: 325, y: y - 14, size: 9, font: reg, color: rgb(0.35, 0.4, 0.48)});

    const bytes = await pdfDoc.save();
    const out = new Uint8Array(new ArrayBuffer(bytes.byteLength));
    out.set(bytes);
    downloadBlob(new Blob([out], {type: 'application/pdf'}), 'contract-template.pdf');
  };

  return (
    <DocumentShell
      icon={<FileSignature className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle="General agreement templates (NOT legal advice & NOT AI) · PDF & Print"
      noticeBanner={
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 px-4 py-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div>
            <span className="font-semibold">Not legal advice:</span> These starter agreement templates are provided purely as formatting examples (NOT AI and NOT legal advice). Always have a qualified lawyer review legal contracts before signing.
          </div>
        </div>
      }
      actions={
        <>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>
          <PrintButton />
        </>
      }
      form={
        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => loadStarter('nda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                starter === 'nda' ? 'border-[#0A8CFF] bg-sky-50 dark:bg-sky-950/40' : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              Mutual NDA Starter
            </button>
            <button
              type="button"
              onClick={() => loadStarter('service')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                starter === 'service' ? 'border-[#0A8CFF] bg-sky-50 dark:bg-sky-950/40' : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              Service Agreement Starter
            </button>
          </div>
          <Field label="Agreement Title" value={agreementTitle} onChange={setAgreementTitle} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Effective Date" type="date" value={effectiveDate} onChange={setEffectiveDate} />
            <Field label="Jurisdiction" value={jurisdiction} onChange={setJurisdiction} />
          </div>
          <Field label="Party A (Name & Address)" value={partyA} onChange={setPartyA} />
          <Field label="Party B (Name & Address)" value={partyB} onChange={setPartyB} />

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Agreement Clauses</span>
              <button
                type="button"
                onClick={() =>
                  setClauses((prev) => [
                    ...prev,
                    {title: `${prev.length + 1}. Additional Clause`, text: 'Enter custom terms here.'},
                  ])
                }
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A8CFF] hover:underline cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Clause</span>
              </button>
            </div>
            {clauses.map((clause, idx) => (
              <div key={idx} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={clause.title}
                    onChange={(e) =>
                      setClauses((prev) =>
                        prev.map((c, i) => (i === idx ? {...c, title: e.target.value} : c)),
                      )
                    }
                    className="flex-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1 text-xs font-semibold"
                  />
                  {clauses.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setClauses((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      aria-label="Remove clause"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                <textarea
                  rows={2}
                  value={clause.text}
                  onChange={(e) =>
                    setClauses((prev) =>
                      prev.map((c, i) => (i === idx ? {...c, text: e.target.value} : c)),
                    )
                  }
                  className="w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 text-xs"
                />
              </div>
            ))}
          </div>
        </div>
      }
      preview={
        <div className="space-y-4 text-xs text-slate-900 leading-relaxed">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-base font-bold">{agreementTitle}</h3>
            <div className="text-slate-500 mt-1 tabular-nums">
              Effective Date: {effectiveDate} · Jurisdiction: {jurisdiction}
            </div>
          </div>
          <div className="space-y-1">
            <div><span className="font-bold">Party A:</span> {partyA}</div>
            <div><span className="font-bold">Party B:</span> {partyB}</div>
          </div>
          <div className="space-y-3 pt-1">
            {clauses.map((c, i) => (
              <div key={i}>
                <div className="font-bold text-slate-900">{c.title}</div>
                <p className="text-slate-700 mt-0.5">{c.text}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200">
            <div className="border-t border-slate-400 pt-1 text-[11px] text-slate-600">Party A Signature & Date</div>
            <div className="border-t border-slate-400 pt-1 text-[11px] text-slate-600">Party B Signature & Date</div>
          </div>
        </div>
      }
    />
  );
}

/* ===========================
   5. PROPOSAL GENERATOR
   =========================== */
function ProposalWorkspace({tool}: Props) {
  const [title, setTitle] = useState('Website Redesign & Analytics Upgrade Proposal');
  const [date, setDate] = useState(todayIso());
  const [preparedBy, setPreparedBy] = useState('Harbor Creative Studio');
  const [preparedFor, setPreparedFor] = useState('Oakridge Retail Group');
  const [currency, setCurrency] = useState('$');
  const [summary, setSummary] = useState(
    'This proposal outlines the scope, deliverables, timeline, and investment required to rebuild Oakridge Retail Group’s storefront with faster mobile checkout and clear conversion analytics.',
  );
  const [items, setItems] = useState<LineItem[]>([
    {description: 'UX Architecture & Wireframes', qty: 1, price: 1200},
    {description: 'Frontend Build & QA Testing', qty: 1, price: 2400},
    {description: 'Analytics Event Setup', qty: 1, price: 600},
  ]);
  const [timeline, setTimeline] = useState('Weeks 1–2: Discovery & Design\nWeeks 3–5: Development & QA\nWeek 6: Launch & Handoff');
  const [terms, setTerms] = useState('50% deposit upon approval, 50% upon launch sign-off. Proposal valid for 30 days.');

  const total = useMemo(
    () => items.reduce((sum, i) => sum + (Number(i.qty) || 0) * (Number(i.price) || 0), 0),
    [items],
  );

  const handleDownloadPdf = async () => {
    const pdfDoc = await PDFDocument.create();
    const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const reg = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let page = pdfDoc.addPage([595.28, 841.89]);
    let y = 780;
    const ensure = (needed = 22) => {
      if (y < 54 + needed) {
        page = pdfDoc.addPage([595.28, 841.89]);
        y = 780;
      }
    };

    page.drawText('PROJECT PROPOSAL', {x: 48, y, size: 10, font: bold, color: rgb(0.04, 0.55, 1)});
    y -= 22;
    for (const line of wrapTextLines(title, bold, 16, 495)) {
      page.drawText(line, {x: 48, y, size: 16, font: bold, color: rgb(0.06, 0.09, 0.16)});
      y -= 20;
    }
    page.drawText(safePdfText(`Prepared by ${preparedBy} for ${preparedFor}   |   Date: ${date}`), {
      x: 48,
      y,
      size: 9.5,
      font: reg,
      color: rgb(0.35, 0.4, 0.48),
    });
    y -= 26;

    page.drawText('1. Executive Summary', {x: 48, y, size: 11.5, font: bold, color: rgb(0.06, 0.09, 0.16)});
    y -= 16;
    for (const line of wrapTextLines(summary, reg, 10, 495)) {
      ensure();
      page.drawText(line, {x: 48, y, size: 10, font: reg, color: rgb(0.2, 0.25, 0.33)});
      y -= 14;
    }

    y -= 14;
    ensure(60);
    page.drawText('2. Services & Pricing', {x: 48, y, size: 11.5, font: bold, color: rgb(0.06, 0.09, 0.16)});
    y -= 18;
    for (const item of items) {
      ensure();
      const amt = (Number(item.qty) || 0) * (Number(item.price) || 0);
      page.drawText(safePdfText(`${item.description} (x${item.qty})`), {x: 54, y, size: 10, font: reg, color: rgb(0.15, 0.2, 0.28)});
      page.drawText(safePdfText(formatMoney(currency, amt)), {x: 465, y, size: 10, font: bold, color: rgb(0.06, 0.09, 0.16)});
      y -= 17;
    }
    page.drawText(safePdfText(`Total Investment: ${formatMoney(currency, total)}`), {x: 380, y: y - 6, size: 11, font: bold, color: rgb(0.02, 0.52, 0.35)});
    y -= 30;

    ensure(50);
    page.drawText('3. Timeline', {x: 48, y, size: 11.5, font: bold, color: rgb(0.06, 0.09, 0.16)});
    y -= 16;
    for (const line of wrapTextLines(timeline, reg, 10, 495)) {
      ensure();
      page.drawText(line, {x: 48, y, size: 10, font: reg, color: rgb(0.2, 0.25, 0.33)});
      y -= 14;
    }

    y -= 12;
    ensure(40);
    page.drawText('4. Terms', {x: 48, y, size: 11.5, font: bold, color: rgb(0.06, 0.09, 0.16)});
    y -= 16;
    for (const line of wrapTextLines(terms, reg, 10, 495)) {
      ensure();
      page.drawText(line, {x: 48, y, size: 10, font: reg, color: rgb(0.2, 0.25, 0.33)});
      y -= 14;
    }

    const bytes = await pdfDoc.save();
    const out = new Uint8Array(new ArrayBuffer(bytes.byteLength));
    out.set(bytes);
    downloadBlob(new Blob([out], {type: 'application/pdf'}), 'proposal.pdf');
  };

  return (
    <DocumentShell
      icon={<Briefcase className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle="Executive summary, deliverables/pricing, timeline & terms · Watermark-free PDF & Print (NOT AI)"
      actions={
        <>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </button>
          <PrintButton />
        </>
      }
      form={
        <div className="space-y-4">
          <Field label="Proposal Title" value={title} onChange={setTitle} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prepared By" value={preparedBy} onChange={setPreparedBy} />
            <Field label="Prepared For (Client)" value={preparedFor} onChange={setPreparedFor} />
            <Field label="Proposal Date" type="date" value={date} onChange={setDate} />
            <Field label="Currency Symbol / Code" value={currency} onChange={setCurrency} />
          </div>
          <TextAreaField label="Executive Summary" rows={3} value={summary} onChange={setSummary} />
          <LineItemsEditor items={items} setItems={setItems} />
          <TextAreaField label="Timeline & Milestones" rows={3} value={timeline} onChange={setTimeline} />
          <TextAreaField label="Payment Terms" rows={2} value={terms} onChange={setTerms} />
        </div>
      }
      preview={
        <div className="space-y-5 text-xs text-slate-900">
          <div className="border-b border-slate-200 pb-3">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#0A8CFF]">Project Proposal</div>
            <h3 className="text-lg font-bold mt-1">{title}</h3>
            <div className="text-slate-500 mt-1 tabular-nums">
              Prepared by <span className="font-semibold text-slate-800">{preparedBy}</span> for{' '}
              <span className="font-semibold text-slate-800">{preparedFor}</span> · {date}
            </div>
          </div>
          <div>
            <div className="font-bold text-slate-900 mb-1">1. Executive Summary</div>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{summary}</p>
          </div>
          <div>
            <div className="font-bold text-slate-900 mb-2">2. Services & Pricing</div>
            <ItemsPreviewTable items={items} currency={currency} />
            <div className="text-right font-bold text-sm text-emerald-700 mt-2 tabular-nums">
              Total Investment: {formatMoney(currency, total)}
            </div>
          </div>
          <div>
            <div className="font-bold text-slate-900 mb-1">3. Timeline</div>
            <p className="text-slate-700 whitespace-pre-line">{timeline}</p>
          </div>
          <div>
            <div className="font-bold text-slate-900 mb-1">4. Payment Terms</div>
            <p className="text-slate-700 whitespace-pre-line">{terms}</p>
          </div>
        </div>
      }
    />
  );
}

/* ===========================
   6. QUOTE GENERATOR
   =========================== */
function QuoteWorkspace({tool}: Props) {
  const [quoteNo, setQuoteNo] = useState('QT-2026-088');
  const [issueDate, setIssueDate] = useState(todayIso());
  const [validUntil, setValidUntil] = useState(futureIso(14));
  const [currency, setCurrency] = useState('$');
  const [businessInfo, setBusinessInfo] = useState('Summit IT Consultants\nsupport@summit.example');
  const [clientInfo, setClientInfo] = useState('Crestline Dental Clinic\nprocurement@crestline.example');
  const [items, setItems] = useState<LineItem[]>([
    {description: 'Office Wi-Fi Access Point Deployment', qty: 3, price: 240},
    {description: 'Managed Switch Configuration', qty: 1, price: 320},
  ]);
  const [discountPercent, setDiscountPercent] = useState(5);
  const [taxPercent, setTaxPercent] = useState(8);
  const [terms, setTerms] = useState('Quote valid until the expiry date listed above. Pricing excludes custom cabling.');

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.price) || 0), 0),
    [items],
  );
  const discountAmt = subtotal * (Math.max(0, discountPercent) / 100);
  const afterDiscount = Math.max(0, subtotal - discountAmt);
  const taxAmt = afterDiscount * (Math.max(0, taxPercent) / 100);
  const grandTotal = afterDiscount + taxAmt;

  const handleDownloadPdf = async () => {
    await exportFinancialDocumentPdf({
      heading: 'PRICE QUOTATION',
      refLabel: `Quote #: ${quoteNo}`,
      dateLines: [`Issue Date: ${issueDate}`, `Valid Until: ${validUntil}`],
      fromBlock: businessInfo,
      toBlock: clientInfo,
      currency,
      items,
      subtotal,
      discountLabel: discountPercent > 0 ? `Discount (${discountPercent}%)` : undefined,
      discountAmt: discountPercent > 0 ? discountAmt : undefined,
      taxLabel: `Tax (${taxPercent}%)`,
      taxAmt,
      totalLabel: 'Quoted Total',
      grandTotal,
      notes: terms,
      fileName: `${quoteNo || 'quote'}.pdf`,
    });
  };

  return (
    <DocumentShell
      icon={<FileSpreadsheet className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle="Line items, discount, tax & validity expiry · Auto-calculated totals · PDF & Print (NOT AI)"
      actions={
        <>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </button>
          <PrintButton />
        </>
      }
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Quote Number" value={quoteNo} onChange={setQuoteNo} />
            <Field label="Currency Symbol / Code" value={currency} onChange={setCurrency} />
            <Field label="Issue Date" type="date" value={issueDate} onChange={setIssueDate} />
            <Field label="Valid Until Date" type="date" value={validUntil} onChange={setValidUntil} />
          </div>
          <TextAreaField label="From (Business Name & Details)" rows={2} value={businessInfo} onChange={setBusinessInfo} />
          <TextAreaField label="Quote To (Client Details)" rows={2} value={clientInfo} onChange={setClientInfo} />
          <LineItemsEditor items={items} setItems={setItems} />
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="Discount (%)" value={discountPercent} onChange={setDiscountPercent} />
            <NumberField label="Tax Rate (%)" value={taxPercent} onChange={setTaxPercent} />
          </div>
          <TextAreaField label="Terms & Notes" rows={2} value={terms} onChange={setTerms} />
        </div>
      }
      preview={
        <div className="space-y-5 text-xs text-slate-900">
          <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-xl font-bold">PRICE QUOTATION</h3>
              <p className="text-slate-600 whitespace-pre-line mt-1">{businessInfo}</p>
            </div>
            <div className="text-right tabular-nums space-y-0.5">
              <div className="font-bold">Quote #{quoteNo}</div>
              <div className="text-slate-600">Date: {issueDate}</div>
              <div className="text-slate-600">Valid Until: {validUntil}</div>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-500">Prepared For</div>
            <div className="whitespace-pre-line font-medium mt-0.5">{clientInfo}</div>
          </div>
          <ItemsPreviewTable items={items} currency={currency} />
          <div className="flex justify-end border-t border-slate-200 pt-3">
            <div className="w-56 space-y-1 tabular-nums">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatMoney(currency, subtotal)}</span>
              </div>
              {discountPercent > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Discount ({discountPercent}%)</span>
                  <span>-{formatMoney(currency, discountAmt)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Tax ({taxPercent}%)</span>
                <span>{formatMoney(currency, taxAmt)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 border-t border-slate-200 pt-1.5">
                <span>Quoted Total</span>
                <span className="text-emerald-700">{formatMoney(currency, grandTotal)}</span>
              </div>
            </div>
          </div>
          {terms && <p className="text-slate-600 border-t border-slate-100 pt-3">{terms}</p>}
        </div>
      }
    />
  );
}

/* ===========================
   7. BILL GENERATOR (Currency-neutral + optional GSTIN)
   =========================== */
function BillWorkspace({tool}: Props) {
  const [billNo, setBillNo] = useState('BILL-509');
  const [date, setDate] = useState(todayIso());
  const [currency, setCurrency] = useState('$');
  const [businessInfo, setBusinessInfo] = useState('Metro Hardware & Supply\n88 Industrial Blvd');
  const [gstin, setGstin] = useState('');
  const [customerInfo, setCustomerInfo] = useState('Kiran Builders\n14 Park Lane');
  const [items, setItems] = useState<LineItem[]>([
    {description: 'Copper Conduit Fittings', qty: 10, price: 14.5},
    {description: 'Heavy Duty Anchors (Box)', qty: 2, price: 32},
  ]);
  const [taxRate, setTaxRate] = useState(5);
  const [notes, setNotes] = useState('Goods checked upon delivery.');

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.price) || 0), 0),
    [items],
  );
  const taxAmt = subtotal * (Math.max(0, taxRate) / 100);
  const grandTotal = subtotal + taxAmt;

  const handleDownloadPdf = async () => {
    const fromFull = gstin.trim() ? `${businessInfo}\nGSTIN / Tax ID: ${gstin.trim()}` : businessInfo;
    await exportFinancialDocumentPdf({
      heading: 'BILL / CASH MEMO',
      refLabel: `Bill #: ${billNo}`,
      dateLines: [`Date: ${date}`],
      fromBlock: fromFull,
      toBlock: customerInfo,
      currency,
      items,
      subtotal,
      taxLabel: `Tax (${taxRate}%)`,
      taxAmt,
      totalLabel: 'Total Bill Amount',
      grandTotal,
      notes,
      fileName: `${billNo || 'bill'}.pdf`,
    });
  };

  return (
    <DocumentShell
      icon={<FileText className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle="Currency-neutral simple bills with optional GSTIN / Tax ID · PDF & Print (NOT AI)"
      actions={
        <>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </button>
          <PrintButton />
        </>
      }
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Bill Number" value={billNo} onChange={setBillNo} />
            <Field label="Date" type="date" value={date} onChange={setDate} />
            <Field label="Currency Symbol / Code" value={currency} onChange={setCurrency} />
            <Field label="Optional GSTIN / Tax ID" value={gstin} onChange={setGstin} placeholder="Optional" />
          </div>
          <TextAreaField label="Business Name & Address" rows={2} value={businessInfo} onChange={setBusinessInfo} />
          <TextAreaField label="Customer Name & Address" rows={2} value={customerInfo} onChange={setCustomerInfo} />
          <LineItemsEditor items={items} setItems={setItems} />
          <NumberField label="Tax Rate (%)" value={taxRate} onChange={setTaxRate} />
          <TextAreaField label="Notes" rows={2} value={notes} onChange={setNotes} />
        </div>
      }
      preview={
        <div className="space-y-5 text-xs text-slate-900">
          <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="text-xl font-bold">BILL</h3>
              <p className="text-slate-700 whitespace-pre-line mt-1">{businessInfo}</p>
              {gstin.trim() && (
                <div className="text-[11px] font-mono text-slate-600 mt-1">GSTIN / Tax ID: {gstin}</div>
              )}
            </div>
            <div className="text-right tabular-nums">
              <div className="font-bold">Bill #{billNo}</div>
              <div className="text-slate-600">Date: {date}</div>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-500">Customer</div>
            <div className="whitespace-pre-line font-medium mt-0.5">{customerInfo}</div>
          </div>
          <ItemsPreviewTable items={items} currency={currency} />
          <div className="flex justify-end border-t border-slate-200 pt-3">
            <div className="w-56 space-y-1 tabular-nums">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatMoney(currency, subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax ({taxRate}%)</span>
                <span>{formatMoney(currency, taxAmt)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 border-t border-slate-200 pt-1.5">
                <span>Total Amount</span>
                <span className="text-emerald-700">{formatMoney(currency, grandTotal)}</span>
              </div>
            </div>
          </div>
          {notes && <p className="text-slate-600 border-t border-slate-100 pt-3">{notes}</p>}
        </div>
      }
    />
  );
}

/* ===========================
   8. INVOICE GENERATOR (Currency-neutral + Logo + Due Date)
   =========================== */
function InvoiceWorkspace({tool}: Props) {
  const [invoiceNo, setInvoiceNo] = useState('INV-2026-019');
  const [issueDate, setIssueDate] = useState(todayIso());
  const [dueDate, setDueDate] = useState(futureIso(15));
  const [currency, setCurrency] = useState('$');
  const [fromInfo, setFromInfo] = useState('Cedar Cloud Labs\n210 Howard St\nSeattle, WA 98101');
  const [clientInfo, setClientInfo] = useState('Beacon Hospitality\naccounts@beacon.example');
  const [items, setItems] = useState<LineItem[]>([
    {description: 'Monthly Platform Maintenance', qty: 1, price: 850},
    {description: 'Custom API Endpoint Integration (hrs)', qty: 6, price: 110},
  ]);
  const [taxRate, setTaxRate] = useState(10);
  const [notes, setNotes] = useState('Please reference the invoice number with bank/ACH transfer.');
  const [logo, setLogo] = useState<{dataUrl: string; bytes: Uint8Array; isPng: boolean} | null>(null);

  const subtotal = useMemo(
    () => items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.price) || 0), 0),
    [items],
  );
  const taxAmt = subtotal * (Math.max(0, taxRate) / 100);
  const grandTotal = subtotal + taxAmt;

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const loaded = await readLogoAsDataUrl(file);
    setLogo(loaded);
    e.target.value = '';
  };

  const handleDownloadPdf = async () => {
    await exportFinancialDocumentPdf({
      heading: 'INVOICE',
      refLabel: `Invoice #: ${invoiceNo}`,
      dateLines: [`Issue Date: ${issueDate}`, `Due Date: ${dueDate}`],
      fromBlock: fromInfo,
      toBlock: clientInfo,
      currency,
      items,
      subtotal,
      taxLabel: `Tax (${taxRate}%)`,
      taxAmt,
      totalLabel: 'Balance Due',
      grandTotal,
      notes,
      logo,
      fileName: `${invoiceNo || 'invoice'}.pdf`,
    });
  };

  return (
    <DocumentShell
      icon={<FileSpreadsheet className="h-5 w-5 text-[#0A8CFF]" />}
      tool={tool}
      subtitle="Currency-neutral invoices with optional local logo, tax rate & due date · PDF & Print (NOT AI)"
      actions={
        <>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </button>
          <PrintButton />
        </>
      }
      form={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 items-end">
            <Field label="Invoice Number" value={invoiceNo} onChange={setInvoiceNo} />
            <Field label="Currency Symbol / Code" value={currency} onChange={setCurrency} />
            <Field label="Issue Date" type="date" value={issueDate} onChange={setIssueDate} />
            <Field label="Due Date" type="date" value={dueDate} onChange={setDueDate} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Optional Business Logo (PNG/JPG)
            </label>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-semibold cursor-pointer hover:border-[#0A8CFF]">
                <ImagePlus className="h-3.5 w-3.5 text-[#0A8CFF]" />
                <span>{logo ? 'Replace Logo' : 'Upload Logo'}</span>
                <input type="file" accept="image/png,image/jpeg" onChange={handleLogoUpload} className="hidden" />
              </label>
              {logo && (
                <button
                  type="button"
                  onClick={() => setLogo(null)}
                  className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                >
                  Remove logo
                </button>
              )}
            </div>
          </div>
          <TextAreaField label="From (Business Details)" rows={3} value={fromInfo} onChange={setFromInfo} />
          <TextAreaField label="Bill To (Client Details)" rows={2} value={clientInfo} onChange={setClientInfo} />
          <LineItemsEditor items={items} setItems={setItems} />
          <NumberField label="Tax Rate (%)" value={taxRate} onChange={setTaxRate} />
          <TextAreaField label="Payment Instructions / Notes" rows={2} value={notes} onChange={setNotes} />
        </div>
      }
      preview={
        <div className="space-y-5 text-xs text-slate-900">
          <div className="flex flex-wrap justify-between items-start gap-4 border-b border-slate-200 pb-4">
            <div className="space-y-1.5">
              {logo && <img src={logo.dataUrl} alt="Business logo" className="h-10 object-contain mb-1" />}
              <h3 className="text-xl font-bold">INVOICE</h3>
              <p className="text-slate-700 whitespace-pre-line">{fromInfo}</p>
            </div>
            <div className="text-right tabular-nums space-y-0.5">
              <div className="font-bold text-slate-900">Invoice #{invoiceNo}</div>
              <div className="text-slate-600">Issue Date: {issueDate}</div>
              <div className="font-semibold text-slate-800">Due Date: {dueDate}</div>
            </div>
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase text-slate-500">Bill To</div>
            <div className="whitespace-pre-line font-medium mt-0.5">{clientInfo}</div>
          </div>
          <ItemsPreviewTable items={items} currency={currency} />
          <div className="flex justify-end border-t border-slate-200 pt-3">
            <div className="w-56 space-y-1 tabular-nums">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>{formatMoney(currency, subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax ({taxRate}%)</span>
                <span>{formatMoney(currency, taxAmt)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 border-t border-slate-200 pt-1.5">
                <span>Balance Due</span>
                <span className="text-emerald-700">{formatMoney(currency, grandTotal)}</span>
              </div>
            </div>
          </div>
          {notes && <p className="text-slate-600 border-t border-slate-100 pt-3">{notes}</p>}
        </div>
      }
    />
  );
}

/* ===========================
   SHARED HELPERS & LAYOUT
   =========================== */
async function exportFinancialDocumentPdf(opts: {
  heading: string;
  refLabel: string;
  dateLines: string[];
  fromBlock: string;
  toBlock: string;
  currency: string;
  items: LineItem[];
  subtotal: number;
  discountLabel?: string;
  discountAmt?: number;
  taxLabel: string;
  taxAmt: number;
  totalLabel: string;
  grandTotal: number;
  notes: string;
  logo?: {bytes: Uint8Array; isPng: boolean} | null;
  fileName: string;
}) {
  const pdfDoc = await PDFDocument.create();
  let page: PDFPage = pdfDoc.addPage([595.28, 841.89]);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const reg = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = 780;
  if (opts.logo) {
    const img = opts.logo.isPng
      ? await pdfDoc.embedPng(opts.logo.bytes)
      : await pdfDoc.embedJpg(opts.logo.bytes);
    const scale = Math.min(110 / img.width, 40 / img.height);
    page.drawImage(img, {x: 48, y: y - 10, width: img.width * scale, height: img.height * scale});
    y -= 48;
  }

  page.drawText(safePdfText(opts.heading), {x: 48, y, size: 19, font: bold, color: rgb(0.06, 0.09, 0.16)});
  page.drawText(safePdfText(opts.refLabel), {x: 380, y: y + 4, size: 10.5, font: bold, color: rgb(0.15, 0.2, 0.28)});
  opts.dateLines.forEach((dl, idx) => {
    page.drawText(safePdfText(dl), {x: 380, y: y - 12 - idx * 14, size: 9.5, font: reg, color: rgb(0.35, 0.4, 0.48)});
  });
  y -= 32;

  for (const line of safePdfText(opts.fromBlock).split('\n')) {
    page.drawText(line, {x: 48, y, size: 9.5, font: reg, color: rgb(0.25, 0.3, 0.38)});
    y -= 14;
  }
  y -= 14;

  page.drawText('BILL / PREPARED FOR:', {x: 48, y, size: 8.5, font: bold, color: rgb(0.45, 0.5, 0.58)});
  y -= 14;
  for (const line of safePdfText(opts.toBlock).split('\n')) {
    page.drawText(line, {x: 48, y, size: 10, font: bold, color: rgb(0.1, 0.12, 0.18)});
    y -= 14;
  }

  y -= 16;
  page.drawRectangle({x: 48, y: y - 4, width: 499, height: 22, color: rgb(0.95, 0.96, 0.98)});
  page.drawText('Description', {x: 56, y: y + 3, size: 9.5, font: bold, color: rgb(0.15, 0.2, 0.28)});
  page.drawText('Qty', {x: 340, y: y + 3, size: 9.5, font: bold, color: rgb(0.15, 0.2, 0.28)});
  page.drawText('Rate', {x: 395, y: y + 3, size: 9.5, font: bold, color: rgb(0.15, 0.2, 0.28)});
  page.drawText('Amount', {x: 480, y: y + 3, size: 9.5, font: bold, color: rgb(0.15, 0.2, 0.28)});
  y -= 24;

  for (const item of opts.items) {
    if (y < 110) {
      page = pdfDoc.addPage([595.28, 841.89]);
      y = 780;
    }
    const amt = (Number(item.qty) || 0) * (Number(item.price) || 0);
    page.drawText(safePdfText(item.description.slice(0, 48) || '-'), {x: 56, y, size: 9.5, font: reg, color: rgb(0.1, 0.12, 0.18)});
    page.drawText(String(item.qty), {x: 340, y, size: 9.5, font: reg, color: rgb(0.1, 0.12, 0.18)});
    page.drawText(safePdfText(formatMoney(opts.currency, Number(item.price) || 0)), {x: 395, y, size: 9.5, font: reg, color: rgb(0.1, 0.12, 0.18)});
    page.drawText(safePdfText(formatMoney(opts.currency, amt)), {x: 480, y, size: 9.5, font: bold, color: rgb(0.06, 0.09, 0.16)});
    y -= 20;
  }

  y -= 8;
  page.drawLine({start: {x: 48, y: y + 8}, end: {x: 547, y: y + 8}, thickness: 1, color: rgb(0.85, 0.88, 0.92)});
  y -= 8;
  page.drawText('Subtotal:', {x: 375, y, size: 9.5, font: reg, color: rgb(0.3, 0.35, 0.42)});
  page.drawText(safePdfText(formatMoney(opts.currency, opts.subtotal)), {x: 480, y, size: 9.5, font: reg, color: rgb(0.1, 0.12, 0.18)});
  y -= 16;

  if (opts.discountLabel && opts.discountAmt !== undefined) {
    page.drawText(safePdfText(`${opts.discountLabel}:`), {x: 375, y, size: 9.5, font: reg, color: rgb(0.3, 0.35, 0.42)});
    page.drawText(safePdfText(`-${formatMoney(opts.currency, opts.discountAmt)}`), {x: 480, y, size: 9.5, font: reg, color: rgb(0.1, 0.12, 0.18)});
    y -= 16;
  }

  page.drawText(safePdfText(`${opts.taxLabel}:`), {x: 375, y, size: 9.5, font: reg, color: rgb(0.3, 0.35, 0.42)});
  page.drawText(safePdfText(formatMoney(opts.currency, opts.taxAmt)), {x: 480, y, size: 9.5, font: reg, color: rgb(0.1, 0.12, 0.18)});
  y -= 20;

  page.drawText(safePdfText(`${opts.totalLabel}:`), {x: 375, y, size: 11, font: bold, color: rgb(0.06, 0.09, 0.16)});
  page.drawText(safePdfText(formatMoney(opts.currency, opts.grandTotal)), {x: 480, y, size: 11.5, font: bold, color: rgb(0.02, 0.52, 0.35)});

  if (opts.notes.trim()) {
    y -= 36;
    for (const line of wrapTextLines(opts.notes, reg, 9.5, 495)) {
      page.drawText(line, {x: 48, y, size: 9.5, font: reg, color: rgb(0.35, 0.4, 0.48)});
      y -= 14;
    }
  }

  const bytes = await pdfDoc.save();
  const out = new Uint8Array(new ArrayBuffer(bytes.byteLength));
  out.set(bytes);
  downloadBlob(new Blob([out], {type: 'application/pdf'}), opts.fileName);
}

function DocumentShell({
  icon,
  tool,
  subtitle,
  noticeBanner,
  actions,
  form,
  preview,
}: {
  icon: React.ReactNode;
  tool: Tool;
  subtitle: string;
  noticeBanner?: React.ReactNode;
  actions: React.ReactNode;
  form: React.ReactNode;
  preview: React.ReactNode;
}) {
  return (
    <section className="mx-auto mt-6 max-w-5xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80">
        <div className="flex items-center gap-2.5">
          {icon}
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{tool.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">{actions}</div>
      </div>

      <div className="p-6 space-y-5">
        {noticeBanner}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5">{form}</div>
          <div className="lg:col-span-7">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
              Live Document Preview
            </div>
            <div
              id="tp-printable-document"
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs"
            >
              {preview}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#0A8CFF] cursor-pointer"
    >
      <Printer className="h-3.5 w-3.5" />
      <span>Print</span>
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs focus:border-[#0A8CFF] focus:outline-none"
      />
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      <input
        type="number"
        min={0}
        step="0.5"
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono tabular-nums focus:border-[#0A8CFF] focus:outline-none"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2.5 text-xs focus:border-[#0A8CFF] focus:outline-none"
      />
    </div>
  );
}

function LineItemsEditor({
  items,
  setItems,
}: {
  items: LineItem[];
  setItems: React.Dispatch<React.SetStateAction<LineItem[]>>;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Line Items</span>
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, {description: 'New Line Item', qty: 1, price: 100}])}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A8CFF] hover:underline cursor-pointer"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Item</span>
        </button>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-2 items-center">
            <input
              type="text"
              value={item.description}
              onChange={(e) =>
                setItems((prev) => prev.map((r, i) => (i === idx ? {...r, description: e.target.value} : r)))
              }
              placeholder="Description"
              className="col-span-6 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 py-1.5 text-xs"
            />
            <input
              type="number"
              min={0}
              value={item.qty}
              onChange={(e) =>
                setItems((prev) => prev.map((r, i) => (i === idx ? {...r, qty: Number(e.target.value) || 0} : r)))
              }
              placeholder="Qty"
              className="col-span-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 py-1.5 text-xs font-mono tabular-nums"
            />
            <input
              type="number"
              min={0}
              step="0.01"
              value={item.price}
              onChange={(e) =>
                setItems((prev) => prev.map((r, i) => (i === idx ? {...r, price: Number(e.target.value) || 0} : r)))
              }
              placeholder="Price"
              className="col-span-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2 py-1.5 text-xs font-mono tabular-nums"
            />
            <button
              type="button"
              onClick={() => items.length > 1 && setItems((prev) => prev.filter((_, i) => i !== idx))}
              disabled={items.length <= 1}
              className="col-span-1 flex justify-center text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
              aria-label="Remove item"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ItemsPreviewTable({items, currency}: {items: LineItem[]; currency: string}) {
  return (
    <table className="w-full text-left border-collapse text-xs">
      <thead>
        <tr className="bg-slate-100 border-b border-slate-200 text-slate-700">
          <th className="py-2 px-2.5 font-semibold">Description</th>
          <th className="py-2 px-2.5 font-semibold text-right">Qty</th>
          <th className="py-2 px-2.5 font-semibold text-right">Rate</th>
          <th className="py-2 px-2.5 font-semibold text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, idx) => {
          const amt = (Number(item.qty) || 0) * (Number(item.price) || 0);
          return (
            <tr key={idx} className="border-b border-slate-100">
              <td className="py-2 px-2.5 text-slate-800">{item.description || '-'}</td>
              <td className="py-2 px-2.5 text-right font-mono tabular-nums">{item.qty}</td>
              <td className="py-2 px-2.5 text-right font-mono tabular-nums">
                {formatMoney(currency, Number(item.price) || 0)}
              </td>
              <td className="py-2 px-2.5 text-right font-mono font-semibold tabular-nums">
                {formatMoney(currency, amt)}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
