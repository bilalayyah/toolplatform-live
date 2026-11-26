import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';
import {PDFDocument} from 'pdf-lib';
import {
  AlertCircle,
  Barcode,
  Braces,
  Check,
  Copy,
  Download,
  Fingerprint,
  Key,
  KeyRound,
  Link2,
  Network,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Users,
} from 'lucide-react';
import type {Tool} from '../../data/tools';

interface Props {
  tool: Tool;
}

function getCryptoRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) return 0;
  const maxUint32 = 0xffffffff;
  const limit = maxUint32 - (maxUint32 % maxExclusive);
  const buf = new Uint32Array(1);
  let val = 0;
  do {
    crypto.getRandomValues(buf);
    val = buf[0];
  } while (val >= limit);
  return val % maxExclusive;
}

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadText(text: string, fileName: string, mime = 'text/plain;charset=utf-8') {
  const encoded = new TextEncoder().encode(text);
  const u8 = new Uint8Array(new ArrayBuffer(encoded.byteLength));
  u8.set(encoded);
  downloadBlob(new Blob([u8], {type: mime}), fileName);
}

function useCopyFeedback() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const copy = useCallback(async (text: string, key = 'default') => {
    let copied = false;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(text);
        copied = true;
      }
    } catch {
      copied = false;
    }

    if (!copied) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        textarea.style.pointerEvents = 'none';
        document.body.appendChild(textarea);
        textarea.select();
        copied = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        copied = false;
      }
    }

    if (copied) {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((prev) => (prev === key ? null : prev)), 1800);
    }
  }, []);
  return {copiedKey, copy};
}

export function GeneratorToolsRunner({tool}: Props) {
  switch (tool.slug) {
    case 'qr-code-generator':
      return <QrCodeGeneratorWorkspace tool={tool} />;
    case 'barcode-generator':
      return <BarcodeGeneratorWorkspace tool={tool} />;
    case 'password-generator':
      return <PasswordGeneratorWorkspace tool={tool} />;
    case 'uuid-generator':
      return <UuidGeneratorWorkspace tool={tool} />;
    case 'slug-generator':
      return <SlugGeneratorWorkspace tool={tool} />;
    case 'random-name-generator':
      return <RandomNameGeneratorWorkspace tool={tool} />;
    case 'mac-address-generator':
      return <MacAddressGeneratorWorkspace tool={tool} />;
    case 'django-secret-key-generator':
      return <DjangoSecretKeyWorkspace tool={tool} />;
    case 'wordpress-secret-key-generator':
      return <WordPressSecretKeyWorkspace tool={tool} />;
    default:
      return null;
  }
}

/* ===========================
   1. QR CODE GENERATOR
   =========================== */
function QrCodeGeneratorWorkspace({tool}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {copiedKey, copy} = useCopyFeedback();

  const [payloadType, setPayloadType] = useState<'url' | 'text' | 'wifi' | 'upi'>('url');
  const [urlOrText, setUrlOrText] = useState('https://example.com');
  const [wifiSsid, setWifiSsid] = useState('StudioGuest');
  const [wifiPassword, setWifiPassword] = useState('Welcome2026!');
  const [wifiSecurity, setWifiSecurity] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [upiId, setUpiId] = useState('merchant@upi');
  const [upiName, setUpiName] = useState('Studio Shop');
  const [upiAmount, setUpiAmount] = useState('');
  const [fgColor, setFgColor] = useState('#0F172A');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [ecLevel, setEcLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [svgMarkup, setSvgMarkup] = useState('');
  const [error, setError] = useState<string | null>(null);

  const payload = useMemo(() => {
    if (payloadType === 'wifi') {
      const esc = (s: string) => s.replace(/([\\;,:"])/g, '\\$1');
      return `WIFI:T:${wifiSecurity};S:${esc(wifiSsid)};P:${wifiSecurity === 'nopass' ? '' : esc(wifiPassword)};;`;
    }
    if (payloadType === 'upi') {
      const params = new URLSearchParams({
        pa: upiId.trim() || 'merchant@upi',
        pn: upiName.trim() || 'Merchant',
        cu: 'INR',
      });
      if (upiAmount.trim()) params.set('am', upiAmount.trim());
      return `upi://pay?${params.toString()}`;
    }
    return urlOrText;
  }, [payloadType, urlOrText, wifiSsid, wifiPassword, wifiSecurity, upiId, upiName, upiAmount]);

  useEffect(() => {
    let cancelled = false;
    async function renderQr() {
      if (!payload.trim()) {
        setError('Enter content to encode into a QR code.');
        setSvgMarkup('');
        return;
      }
      setError(null);
      try {
        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, payload, {
            width: 280,
            margin: 2,
            errorCorrectionLevel: ecLevel,
            color: {dark: fgColor, light: bgColor},
          });
        }
        const svg = await QRCode.toString(payload, {
          type: 'svg',
          margin: 2,
          errorCorrectionLevel: ecLevel,
          color: {dark: fgColor, light: bgColor},
        });
        if (!cancelled) setSvgMarkup(svg);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unable to encode QR payload.');
        }
      }
    }
    renderQr();
    return () => {
      cancelled = true;
    };
  }, [payload, fgColor, bgColor, ecLevel]);

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      downloadBlob(blob, 'qr-code.png');
    }, 'image/png');
  };

  const handleDownloadSvg = () => {
    if (!svgMarkup) return;
    const blob = new Blob([svgMarkup], {type: 'image/svg+xml;charset=utf-8'});
    downloadBlob(blob, 'qr-code.svg');
  };

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex items-center gap-2.5">
        <QrCode className="h-5 w-5 text-[#0A8CFF]" />
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{tool.name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Static QR code encoded locally · Never expires · Zero watermarks
          </p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        <div className="md:col-span-7 space-y-4">
          <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(
              [
                {id: 'url', label: 'Website URL'},
                {id: 'text', label: 'Plain Text'},
                {id: 'wifi', label: 'Wi-Fi'},
                {id: 'upi', label: 'UPI Payment'},
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setPayloadType(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  payloadType === tab.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {(payloadType === 'url' || payloadType === 'text') && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {payloadType === 'url' ? 'Destination URL' : 'Text Message'}
              </label>
              <textarea
                rows={3}
                value={urlOrText}
                onChange={(e) => setUrlOrText(e.target.value)}
                placeholder={payloadType === 'url' ? 'https://example.com' : 'Enter text to encode...'}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3 text-sm font-mono focus:border-[#0A8CFF] focus:outline-none"
              />
            </div>
          )}

          {payloadType === 'wifi' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Network Name (SSID)
                </label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Encryption
                </label>
                <select
                  value={wifiSecurity}
                  onChange={(e) => setWifiSecurity(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs"
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">Open (No password)</option>
                </select>
              </div>
              {wifiSecurity !== 'nopass' && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Wi-Fi Password
                  </label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono"
                  />
                </div>
              )}
            </div>
          )}

          {payloadType === 'upi' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  UPI ID (VPA)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Payee Name
                </label>
                <input
                  type="text"
                  value={upiName}
                  onChange={(e) => setUpiName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Optional Amount (INR)
                </label>
                <input
                  type="text"
                  value={upiAmount}
                  onChange={(e) => setUpiAmount(e.target.value)}
                  placeholder="Leave blank for any amount"
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Foreground
              </label>
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white cursor-pointer p-1"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Background
              </label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-9 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white cursor-pointer p-1"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Error Correction
              </label>
              <select
                value={ecLevel}
                onChange={(e) => setEcLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                className="h-9 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-2.5 text-xs"
              >
                <option value="L">L (7%)</option>
                <option value="M">M (15%)</option>
                <option value="Q">Q (25%)</option>
                <option value="H">H (30%)</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="md:col-span-5 flex flex-col items-center gap-4 p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-3 shadow-xs">
            <canvas ref={canvasRef} className="block max-w-full h-auto" />
          </div>

          <div className="w-full grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={!svgMarkup}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2.5 text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PNG</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadSvg}
              disabled={!svgMarkup}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-3 py-2.5 text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download SVG</span>
            </button>
            <button
              type="button"
              onClick={() => svgMarkup && copy(svgMarkup, 'svg')}
              disabled={!svgMarkup}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer disabled:opacity-50"
            >
              {copiedKey === 'svg' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'svg' ? 'Copied SVG' : 'Copy SVG'}</span>
            </button>
            <button
              type="button"
              onClick={() => payload && copy(payload, 'payload')}
              disabled={!payload}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer disabled:opacity-50"
            >
              {copiedKey === 'payload' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'payload' ? 'Copied Text' : 'Copy Payload'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===========================
   2. BARCODE GENERATOR
   =========================== */
function BarcodeGeneratorWorkspace({tool}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {copiedKey, copy} = useCopyFeedback();

  const [format, setFormat] = useState<'CODE128' | 'CODE39' | 'EAN13' | 'UPCA'>('CODE128');
  const [value, setValue] = useState('TP-2026-8491');
  const [showText, setShowText] = useState(true);
  const [barHeight, setBarHeight] = useState(80);
  const [error, setError] = useState<string | null>(null);

  const handleFormatChange = (nextFmt: 'CODE128' | 'CODE39' | 'EAN13' | 'UPCA') => {
    setFormat(nextFmt);
    if (nextFmt === 'EAN13' && !/^\d{12,13}$/.test(value)) {
      setValue('590123412345');
    } else if (nextFmt === 'UPCA' && !/^\d{11,12}$/.test(value)) {
      setValue('03600029145');
    } else if (nextFmt === 'CODE39') {
      setValue(value.toUpperCase().replace(/[^A-Z0-9\-. $/+%]/g, '') || 'SKU-4092');
    } else if (!value.trim()) {
      setValue('TP-2026-8491');
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;
    if (!value.trim()) {
      setError('Enter a barcode value to render.');
      return;
    }
    try {
      setError(null);
      JsBarcode(canvasRef.current, value, {
        format: format === 'UPCA' ? 'UPC' : format,
        displayValue: showText,
        height: barHeight,
        width: 2,
        margin: 14,
        background: '#ffffff',
        lineColor: '#0f172a',
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Invalid value for ${format} barcode format.`,
      );
    }
  }, [format, value, showText, barHeight]);

  const handleDownloadPng = () => {
    if (!canvasRef.current || error) return;
    canvasRef.current.toBlob((blob) => {
      if (blob) downloadBlob(blob, `barcode-${format.toLowerCase()}.png`);
    }, 'image/png');
  };

  const handleDownloadPdf = async () => {
    if (!canvasRef.current || error) return;
    const pngBlob = await new Promise<Blob | null>((resolve) =>
      canvasRef.current?.toBlob((b) => resolve(b), 'image/png'),
    );
    if (!pngBlob) return;
    const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());
    const pdfDoc = await PDFDocument.create();
    const img = await pdfDoc.embedPng(pngBytes);
    const pageWidth = Math.max(360, img.width + 64);
    const pageHeight = Math.max(180, img.height + 64);
    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawImage(img, {
      x: (pageWidth - img.width) / 2,
      y: (pageHeight - img.height) / 2,
      width: img.width,
      height: img.height,
    });
    const saved = await pdfDoc.save();
    const out = new Uint8Array(new ArrayBuffer(saved.byteLength));
    out.set(saved);
    downloadBlob(new Blob([out], {type: 'application/pdf'}), `barcode-${format.toLowerCase()}.pdf`);
  };

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex items-center gap-2.5">
        <Barcode className="h-5 w-5 text-[#0A8CFF]" />
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{tool.name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Code 128, Code 39, EAN-13 & UPC-A · Watermark-free PNG & PDF download
          </p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Barcode Format
            </label>
            <select
              value={format}
              onChange={(e) => handleFormatChange(e.target.value as 'CODE128' | 'CODE39' | 'EAN13' | 'UPCA')}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2.5 text-xs"
            >
              <option value="CODE128">Code 128 (Alphanumeric)</option>
              <option value="CODE39">Code 39 (Uppercase SKU)</option>
              <option value="EAN13">EAN-13 (12 or 13 digits)</option>
              <option value="UPCA">UPC-A (11 or 12 digits)</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Barcode Value
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-3.5 py-2 text-sm font-mono focus:border-[#0A8CFF] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 tabular-nums">
              Bar Height: {barHeight}px
            </label>
            <input
              type="range"
              min={40}
              max={150}
              value={barHeight}
              onChange={(e) => setBarHeight(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={showText}
              onChange={(e) => setShowText(e.target.checked)}
              className="rounded border-slate-300"
            />
            <span>Show human-readable digits below bars</span>
          </label>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40 p-6 flex flex-col items-center justify-center gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-3 max-w-full overflow-x-auto">
            <canvas ref={canvasRef} className={error ? 'hidden' : 'block mx-auto'} />
            {error && <div className="text-xs text-slate-500 px-6 py-8">Fix format input to render barcode preview.</div>}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={Boolean(error)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PNG</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={Boolean(error)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2.5 text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              onClick={() => copy(value, 'val')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              {copiedKey === 'val' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'val' ? 'Copied Value' : 'Copy Value'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===========================
   3. PASSWORD GENERATOR
   =========================== */
function PasswordGeneratorWorkspace({tool}: Props) {
  const {copiedKey, copy} = useCopyFeedback();

  const [length, setLength] = useState(18);
  const [useUpper, setUseUpper] = useState(true);
  const [useLower, setUseLower] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [seedTick, setSeedTick] = useState(0);

  const {password, poolSize} = useMemo(() => {
    void seedTick;
    let upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lower = 'abcdefghijklmnopqrstuvwxyz';
    let digits = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    if (excludeAmbiguous) {
      upper = upper.replace(/[OI]/g, '');
      lower = lower.replace(/[ol]/g, '');
      digits = digits.replace(/[01]/g, '');
    }

    const activeSets: string[] = [];
    if (useUpper) activeSets.push(upper);
    if (useLower) activeSets.push(lower);
    if (useNumbers) activeSets.push(digits);
    if (useSymbols) activeSets.push(symbols);

    if (activeSets.length === 0) {
      return {password: '', poolSize: 0};
    }

    const fullPool = activeSets.join('');
    const chars: string[] = [];
    // Guarantee one char from each selected character class
    for (let i = 0; i < activeSets.length && i < length; i++) {
      const set = activeSets[i];
      chars.push(set[getCryptoRandomInt(set.length)]);
    }
    while (chars.length < length) {
      chars.push(fullPool[getCryptoRandomInt(fullPool.length)]);
    }
    // Fisher-Yates shuffle via crypto randomness
    for (let i = chars.length - 1; i > 0; i--) {
      const j = getCryptoRandomInt(i + 1);
      const tmp = chars[i];
      chars[i] = chars[j];
      chars[j] = tmp;
    }

    return {password: chars.join(''), poolSize: fullPool.length};
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeAmbiguous, seedTick]);

  const entropyBits = poolSize > 0 ? Math.round(length * Math.log2(poolSize)) : 0;
  const strength =
    entropyBits >= 96
      ? {label: 'Very Strong', color: 'bg-emerald-600', text: 'text-emerald-700 dark:text-emerald-400', pct: 100}
      : entropyBits >= 64
        ? {label: 'Strong', color: 'bg-[#0A8CFF]', text: 'text-[#0A8CFF]', pct: 75}
        : entropyBits >= 44
          ? {label: 'Fair', color: 'bg-amber-500', text: 'text-amber-700 dark:text-amber-400', pct: 50}
          : {label: 'Weak', color: 'bg-rose-600', text: 'text-rose-700 dark:text-rose-400', pct: 25};

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex items-center gap-2.5">
        <KeyRound className="h-5 w-5 text-[#0A8CFF]" />
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{tool.name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generated in memory via Web Crypto (crypto.getRandomValues) · Never sent or stored
          </p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60 p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex-1 font-mono text-base sm:text-lg font-bold text-slate-900 dark:text-white break-all select-all">
            {password || 'Select at least one character set below'}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSeedTick((t) => t + 1)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3.5 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Regenerate</span>
            </button>
            <button
              type="button"
              onClick={() => password && copy(password, 'pw')}
              disabled={!password}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2.5 text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              {copiedKey === 'pw' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'pw' ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Strength bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs tabular-nums">
            <span className={`font-bold ${strength.text}`}>Strength: {strength.label}</span>
            <span className="text-slate-500 dark:text-slate-400">~{entropyBits} bits entropy</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
            <div className={`h-full transition-all ${strength.color}`} style={{width: `${strength.pct}%`}} />
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-slate-200 dark:border-slate-800 p-4">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Password Length</span>
              <span className="font-mono tabular-nums text-sm">{length} characters</span>
            </div>
            <input
              type="range"
              min={8}
              max={64}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {[
              {label: 'Uppercase (A–Z)', checked: useUpper, set: setUseUpper},
              {label: 'Lowercase (a–z)', checked: useLower, set: setUseLower},
              {label: 'Numbers (0–9)', checked: useNumbers, set: setUseNumbers},
              {label: 'Symbols (!@#$...)', checked: useSymbols, set: setUseSymbols},
              {label: 'Exclude ambiguous (O/0/l/1)', checked: excludeAmbiguous, set: setExcludeAmbiguous},
            ].map((opt) => (
              <label key={opt.label} className="inline-flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={opt.checked}
                  onChange={(e) => opt.set(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===========================
   4. UUID GENERATOR
   =========================== */
function makeUuidV4(): string {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function UuidGeneratorWorkspace({tool}: Props) {
  const {copiedKey, copy} = useCopyFeedback();

  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [withHyphens, setWithHyphens] = useState(true);
  const [seedTick, setSeedTick] = useState(0);

  const uuids = useMemo(() => {
    void seedTick;
    const safeCount = Math.max(1, Math.min(1000, Math.floor(count) || 1));
    return Array.from({length: safeCount}, () => {
      let id = makeUuidV4();
      if (!withHyphens) id = id.replace(/-/g, '');
      if (uppercase) id = id.toUpperCase();
      return id;
    });
  }, [count, uppercase, withHyphens, seedTick]);

  const joined = uuids.join('\n');

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex items-center gap-2.5">
        <Fingerprint className="h-5 w-5 text-[#0A8CFF]" />
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{tool.name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Generate 1–1,000 RFC 4122 version 4 UUIDs via Web Crypto · Copy or export TXT/CSV/JSON
          </p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/60 dark:bg-slate-950/40">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Count (1–1,000)
            </label>
            <input
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(1000, Number(e.target.value) || 1)))}
              className="w-28 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono tabular-nums"
            />
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={withHyphens}
              onChange={(e) => setWithHyphens(e.target.checked)}
              className="rounded border-slate-300"
            />
            <span>Include hyphens</span>
          </label>

          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded border-slate-300"
            />
            <span>Uppercase</span>
          </label>

          <button
            type="button"
            onClick={() => setSeedTick((t) => t + 1)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Generate New</span>
          </button>
        </div>

        <textarea
          readOnly
          rows={Math.min(14, Math.max(5, uuids.length))}
          value={joined}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3.5 text-xs font-mono text-slate-800 dark:text-slate-200"
        />

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => copy(joined, 'uuids')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2.5 text-xs font-semibold cursor-pointer"
          >
            {copiedKey === 'uuids' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'uuids' ? 'Copied All' : `Copy ${uuids.length} UUID${uuids.length === 1 ? '' : 's'}`}</span>
          </button>
          <button
            type="button"
            onClick={() => downloadText(joined + '\n', 'uuids.txt')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-semibold cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download TXT</span>
          </button>
          <button
            type="button"
            onClick={() => downloadText('uuid\n' + joined + '\n', 'uuids.csv', 'text/csv;charset=utf-8')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download CSV</span>
          </button>
          <button
            type="button"
            onClick={() => downloadText(JSON.stringify(uuids, null, 2) + '\n', 'uuids.json', 'application/json;charset=utf-8')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <Braces className="h-3.5 w-3.5" />
            <span>Download JSON</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ===========================
   5. SLUG GENERATOR
   =========================== */
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'is', 'are',
]);

function toSlug(
  input: string,
  separator: '-' | '_',
  lowercase: boolean,
  removeStopWords: boolean,
): string {
  const normalized = input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/['’]/g, '');

  const cased = lowercase ? normalized.toLowerCase() : normalized;
  let tokens = cased
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (removeStopWords) {
    const filtered = tokens.filter((t) => !STOP_WORDS.has(t.toLowerCase()));
    if (filtered.length > 0) tokens = filtered;
  }

  return tokens.join(separator);
}

function SlugGeneratorWorkspace({tool}: Props) {
  const {copiedKey, copy} = useCopyFeedback();

  const [sourceText, setSourceText] = useState('10 Deterministic Tips for Faster Café & Web Workflows!');
  const [separator, setSeparator] = useState<'-' | '_'>('-');
  const [lowercase, setLowercase] = useState(true);
  const [removeStopWords, setRemoveStopWords] = useState(false);

  const output = useMemo(() => {
    return sourceText
      .split(/\r?\n/)
      .map((line) => (line.trim() ? toSlug(line, separator, lowercase, removeStopWords) : ''))
      .join('\n')
      .trim();
  }, [sourceText, separator, lowercase, removeStopWords]);

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex items-center gap-2.5">
        <Link2 className="h-5 w-5 text-[#0A8CFF]" />
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{tool.name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Deterministic URL slug normalization · Supports single titles or one title per line
          </p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Title or Heading Text (one per line for bulk)
          </label>
          <textarea
            rows={4}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Enter an article title or product name..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3.5 text-sm focus:border-[#0A8CFF] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Separator:</span>
            <button
              type="button"
              onClick={() => setSeparator('-')}
              className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                separator === '-' ? 'bg-[#0A8CFF] text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Hyphen (-)
            </button>
            <button
              type="button"
              onClick={() => setSeparator('_')}
              className={`px-3 py-1.5 rounded-lg font-semibold cursor-pointer ${
                separator === '_' ? 'bg-[#0A8CFF] text-white' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Underscore (_)
            </button>
          </div>

          <label className="inline-flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="rounded border-slate-300"
            />
            <span>Force lowercase</span>
          </label>

          <label className="inline-flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={removeStopWords}
              onChange={(e) => setRemoveStopWords(e.target.checked)}
              className="rounded border-slate-300"
            />
            <span>Strip common stop words</span>
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Generated URL Slug
          </label>
          <textarea
            readOnly
            rows={Math.min(8, Math.max(2, output.split('\n').length))}
            value={output}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3.5 text-sm font-mono font-semibold text-slate-900 dark:text-white"
          />
          <div className="flex flex-wrap gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => output && copy(output, 'slug')}
              disabled={!output}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2.5 text-xs font-semibold cursor-pointer disabled:opacity-50"
            >
              {copiedKey === 'slug' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedKey === 'slug' ? 'Copied Slug' : 'Copy Slug'}</span>
            </button>
            <button
              type="button"
              onClick={() => output && downloadText(output + '\n', 'slugs.txt')}
              disabled={!output}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download TXT</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===========================
   6. RANDOM NAME GENERATOR
   =========================== */
const FEMALE_NAMES = [
  'Alice', 'Amelia', 'Aria', 'Clara', 'Daisy', 'Eleanor', 'Elena', 'Elizabeth', 'Emily', 'Emma',
  'Evelyn', 'Fiona', 'Grace', 'Hannah', 'Hazel', 'Iris', 'Isabella', 'Julia', 'Katherine', 'Laura',
  'Lily', 'Lucy', 'Madeline', 'Maya', 'Naomi', 'Nora', 'Olivia', 'Penelope', 'Rachel', 'Rebecca',
  'Rose', 'Ruby', 'Sarah', 'Sophia', 'Stella', 'Victoria', 'Violet', 'Zoe',
];

const MALE_NAMES = [
  'Aaron', 'Adam', 'Alexander', 'Andrew', 'Arthur', 'Benjamin', 'Caleb', 'Charles', 'Christopher', 'Daniel',
  'David', 'Edward', 'Elias', 'Ethan', 'Felix', 'Gabriel', 'George', 'Henry', 'Isaac', 'Jack',
  'Jacob', 'James', 'Joseph', 'Julian', 'Leo', 'Liam', 'Lucas', 'Matthew', 'Michael', 'Nathan',
  'Noah', 'Oliver', 'Owen', 'Peter', 'Samuel', 'Sebastian', 'Thomas', 'William',
];

const UNISEX_NAMES = [
  'Alex', 'Avery', 'Bailey', 'Blake', 'Cameron', 'Casey', 'Charlie', 'Dakota', 'Devon', 'Drew',
  'Eden', 'Elliot', 'Emerson', 'Finley', 'Frankie', 'Harper', 'Hayden', 'Jamie', 'Jordan', 'Kai',
  'Kendall', 'Logan', 'Morgan', 'Parker', 'Peyton', 'Quinn', 'Reese', 'Riley', 'River', 'Rowan',
  'Sage', 'Sam', 'Sawyer', 'Skyler', 'Sydney', 'Taylor',
];

const LAST_NAMES = [
  'Adams', 'Allen', 'Anderson', 'Bailey', 'Baker', 'Barnes', 'Bell', 'Bennett', 'Brooks', 'Brown',
  'Butler', 'Campbell', 'Carter', 'Clark', 'Collins', 'Cook', 'Cooper', 'Cox', 'Davis', 'Edwards',
  'Evans', 'Fisher', 'Foster', 'Garcia', 'Gray', 'Green', 'Hall', 'Harris', 'Harrison', 'Hayes',
  'Henderson', 'Hill', 'Howard', 'Hughes', 'James', 'Jenkins', 'Johnson', 'Jones', 'Kelly', 'King',
  'Lee', 'Lewis', 'Long', 'Martin', 'Miller', 'Mitchell', 'Moore', 'Morgan', 'Morris', 'Murphy',
  'Nelson', 'Parker', 'Patel', 'Perry', 'Peterson', 'Phillips', 'Powell', 'Price', 'Reed', 'Reynolds',
  'Richardson', 'Roberts', 'Robinson', 'Rogers', 'Ross', 'Russell', 'Sanders', 'Scott', 'Shaw', 'Simmons',
  'Smith', 'Stewart', 'Sullivan', 'Taylor', 'Thomas', 'Thompson', 'Turner', 'Walker', 'Wallace', 'Ward',
  'Watson', 'White', 'Williams', 'Wilson', 'Wood', 'Wright', 'Young',
];

function RandomNameGeneratorWorkspace({tool}: Props) {
  const {copiedKey, copy} = useCopyFeedback();

  const [gender, setGender] = useState<'all' | 'female' | 'male' | 'unisex'>('all');
  const [formatMode, setFormatMode] = useState<'full' | 'first'>('full');
  const [count, setCount] = useState(10);
  const [seedTick, setSeedTick] = useState(0);

  const names = useMemo(() => {
    void seedTick;
    const pool =
      gender === 'female'
        ? FEMALE_NAMES
        : gender === 'male'
          ? MALE_NAMES
          : gender === 'unisex'
            ? UNISEX_NAMES
            : [...FEMALE_NAMES, ...MALE_NAMES, ...UNISEX_NAMES];

    const safeCount = Math.max(1, Math.min(50, Math.floor(count) || 1));
    const results: string[] = [];
    const seen = new Set<string>();

    let attempts = 0;
    while (results.length < safeCount && attempts < safeCount * 8) {
      attempts++;
      const first = pool[getCryptoRandomInt(pool.length)];
      const name =
        formatMode === 'first' ? first : `${first} ${LAST_NAMES[getCryptoRandomInt(LAST_NAMES.length)]}`;
      if (!seen.has(name) || attempts > safeCount * 4) {
        seen.add(name);
        results.push(name);
      }
    }
    return results;
  }, [gender, formatMode, count, seedTick]);

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex items-center gap-2.5">
        <Users className="h-5 w-5 text-[#0A8CFF]" />
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{tool.name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Draw 1–50 names from curated built-in English wordlists (NOT AI)
          </p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as 'all' | 'female' | 'male' | 'unisex')}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
            >
              <option value="all">All Categories</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Name Format
            </label>
            <select
              value={formatMode}
              onChange={(e) => setFormatMode(e.target.value as 'full' | 'first')}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
            >
              <option value="full">Full Name (First + Last)</option>
              <option value="first">First Name Only</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Count (1–50)
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono tabular-nums"
            />
          </div>
          <button
            type="button"
            onClick={() => setSeedTick((t) => t + 1)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Draw Names</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {names.map((n, idx) => (
            <div
              key={`${n}-${idx}`}
              className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 px-3.5 py-2.5"
            >
              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{n}</span>
              <button
                type="button"
                onClick={() => copy(n, `n-${idx}`)}
                className="text-xs font-semibold text-[#0A8CFF] hover:underline cursor-pointer"
              >
                {copiedKey === `n-${idx}` ? 'Copied' : 'Copy'}
              </button>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => copy(names.join('\n'), 'all')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2.5 text-xs font-semibold cursor-pointer"
          >
            {copiedKey === 'all' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'all' ? 'Copied All' : 'Copy All Names'}</span>
          </button>
          <button
            type="button"
            onClick={() => downloadText(names.join('\n') + '\n', 'random-names.txt')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download TXT</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ===========================
   7. MAC ADDRESS GENERATOR
   =========================== */
function MacAddressGeneratorWorkspace({tool}: Props) {
  const {copiedKey, copy} = useCopyFeedback();

  const [count, setCount] = useState(5);
  const [separator, setSeparator] = useState<':' | '-' | '.' | ''>(':');
  const [uppercase, setUppercase] = useState(true);
  const [seedTick, setSeedTick] = useState(0);

  const addresses = useMemo(() => {
    void seedTick;
    const safeCount = Math.max(1, Math.min(50, Math.floor(count) || 1));
    return Array.from({length: safeCount}, () => {
      const octets = new Uint8Array(6);
      crypto.getRandomValues(octets);
      // Bit 0 = 0 (unicast), Bit 1 = 1 (locally administered)
      octets[0] = (octets[0] & 0xfe) | 0x02;
      const hexPairs = Array.from(octets, (b) => {
        const s = b.toString(16).padStart(2, '0');
        return uppercase ? s.toUpperCase() : s.toLowerCase();
      });
      if (separator === '.') {
        return `${hexPairs[0]}${hexPairs[1]}.${hexPairs[2]}${hexPairs[3]}.${hexPairs[4]}${hexPairs[5]}`;
      }
      return hexPairs.join(separator);
    });
  }, [count, separator, uppercase, seedTick]);

  const joined = addresses.join('\n');

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex items-center gap-2.5">
        <Network className="h-5 w-5 text-[#0A8CFF]" />
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{tool.name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Valid unicast locally-administered 48-bit test MAC addresses via Web Crypto
          </p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 px-4 py-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <span>
            <span className="font-semibold">Random test addresses only:</span> Every generated address sets IEEE bit 0 = 0 (unicast) and bit 1 = 1 (locally administered) for QA fixtures and virtual labs—never real physical device hardware addresses.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Count (1–50)
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono tabular-nums"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Separator Format
            </label>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value as ':' | '-' | '.' | '')}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
            >
              <option value=":">Colon (AA:BB:CC:DD:EE:FF)</option>
              <option value="-">Hyphen (AA-BB-CC-DD-EE-FF)</option>
              <option value=".">Cisco Dot (AABB.CCDD.EEFF)</option>
              <option value="">None (AABBCCDDEEFF)</option>
            </select>
          </div>
          <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded border-slate-300"
            />
            <span>Uppercase Hex</span>
          </label>
          <button
            type="button"
            onClick={() => setSeedTick((t) => t + 1)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Generate</span>
          </button>
        </div>

        <textarea
          readOnly
          rows={Math.min(10, Math.max(4, addresses.length))}
          value={joined}
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3.5 text-sm font-mono text-slate-900 dark:text-white"
        />

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => copy(joined, 'mac')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2.5 text-xs font-semibold cursor-pointer"
          >
            {copiedKey === 'mac' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'mac' ? 'Copied All' : 'Copy All'}</span>
          </button>
          <button
            type="button"
            onClick={() => downloadText(joined + '\n', 'mac-addresses.txt')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download TXT</span>
          </button>
          <button
            type="button"
            onClick={() => downloadText('mac_address\n' + joined + '\n', 'mac-addresses.csv', 'text/csv;charset=utf-8')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ===========================
   8. DJANGO SECRET KEY GENERATOR
   =========================== */
const DJANGO_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(-_=+)';

function DjangoSecretKeyWorkspace({tool}: Props) {
  const {copiedKey, copy} = useCopyFeedback();

  const [length, setLength] = useState(50);
  const [seedTick, setSeedTick] = useState(0);

  const secretKey = useMemo(() => {
    void seedTick;
    const safeLen = Math.max(32, Math.min(100, Math.floor(length) || 50));
    return Array.from({length: safeLen}, () => DJANGO_CHARS[getCryptoRandomInt(DJANGO_CHARS.length)]).join('');
  }, [length, seedTick]);

  const envLine = `DJANGO_SECRET_KEY='${secretKey}'`;

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex items-center gap-2.5">
        <Key className="h-5 w-5 text-[#0A8CFF]" />
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">{tool.name}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cryptographically random Django SECRET_KEY via crypto.getRandomValues · Never transmitted or stored
          </p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 tabular-nums">
              Key Length: {length} characters (Django default: 50)
            </label>
            <input
              type="range"
              min={32}
              max={100}
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <button
            type="button"
            onClick={() => setSeedTick((t) => t + 1)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2.5 text-xs font-semibold cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Generate New Key</span>
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Raw SECRET_KEY
            </label>
            <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3.5 font-mono text-sm font-bold text-slate-900 dark:text-white break-all select-all">
              {secretKey}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              .env Format
            </label>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3.5 font-mono text-xs text-slate-700 dark:text-slate-300 break-all select-all">
              {envLine}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => copy(secretKey, 'raw')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2.5 text-xs font-semibold cursor-pointer"
          >
            {copiedKey === 'raw' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'raw' ? 'Copied Key!' : 'Copy Key'}</span>
          </button>
          <button
            type="button"
            onClick={() => copy(envLine, 'env')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            {copiedKey === 'env' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'env' ? 'Copied .env Line' : 'Copy .env Line'}</span>
          </button>
          <button
            type="button"
            onClick={() => downloadText(envLine + '\n', 'django-secret.env')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download .env</span>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ===========================
   9. WORDPRESS SECRET KEY GENERATOR
   =========================== */
const WP_CONSTANTS = [
  'AUTH_KEY',
  'SECURE_AUTH_KEY',
  'LOGGED_IN_KEY',
  'NONCE_KEY',
  'AUTH_SALT',
  'SECURE_AUTH_SALT',
  'LOGGED_IN_SALT',
  'NONCE_SALT',
] as const;

// Excludes single-quote/backslash to guarantee drop-in valid PHP single-quoted literals
const WP_CHAR_POOL =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_ []{}<>~`+=,.;:/?|';

function WordPressSecretKeyWorkspace({tool}: Props) {
  const {copiedKey, copy} = useCopyFeedback();
  const [seedTick, setSeedTick] = useState(0);

  const phpBlock = useMemo(() => {
    void seedTick;
    return WP_CONSTANTS.map((name) => {
      const secret = Array.from(
        {length: 64},
        () => WP_CHAR_POOL[getCryptoRandomInt(WP_CHAR_POOL.length)],
      ).join('');
      const paddedName = `'${name}',`.padEnd(19, ' ');
      return `define( ${paddedName}'${secret}' );`;
    }).join('\n');
  }, [seedTick]);

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-[#0A8CFF]" />
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{tool.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All 8 64-character wp-config.php keys & salts via crypto.getRandomValues · Never sent or stored
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSeedTick((t) => t + 1)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-3.5 py-2 text-xs font-semibold cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Regenerate All 8</span>
        </button>
      </div>

      <div className="p-6 space-y-5">
        <pre className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4 text-xs font-mono text-slate-900 dark:text-slate-100 overflow-x-auto leading-relaxed select-all">
          {phpBlock}
        </pre>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => copy(phpBlock, 'wp')}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white px-4 py-2.5 text-xs font-semibold cursor-pointer"
          >
            {copiedKey === 'wp' ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copiedKey === 'wp' ? 'Copied PHP Block!' : 'Copy for wp-config.php'}</span>
          </button>
          <button
            type="button"
            onClick={() => downloadText(phpBlock + '\n', 'wp-config-salts.txt')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download TXT</span>
          </button>
        </div>
      </div>
    </section>
  );
}
