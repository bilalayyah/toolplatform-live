import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  EyeOff,
  FileText,
  FlaskConical,
  KeyRound,
  Loader2,
  Lock,
  Move,
  PenTool,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
  Unlock,
  Upload,
} from 'lucide-react';
import type {Tool} from '../../data/tools';
import {PDFDocument, StandardFonts, degrees, rgb} from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {SITE_CONFIG} from '../../config/site';
import {applyToolPlatformWatermark} from '../../lib/watermark';
import {Document, Packer, Paragraph, TextRun} from 'docx';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import PptxGenJS from 'pptxgenjs';
import { protectPdfBrowser, unlockPdfBrowser } from '../../lib/qpdfProcessor';
import {
  type SignPositionPreset,
  applyPointerDeltaToPositionPt,
  computeSignatureBoxRectPt,
  computeSignatureImageSizePt,
  renderTypedSignatureDataUrl,
  resolveSignaturePositionPt,
  signatureBoxToOverlayPct,
} from '../../lib/signPdfGeometry';

if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;
}

interface Props {
  tool: Tool;
}

interface ExtractedImageItem {
  name: string;
  url: string;
  width: number;
  height: number;
}

const PDF_FILE_TOOL_SLUGS = new Set([
  'merge-pdf',
  'split-pdf',
  'compress-pdf',
  'rotate-pdf',
  'pdf-to-jpg',
  'pdf-to-png',
  'pdf-to-text',
  'pdf-to-word',
  'pdf-to-excel',
  'pdf-to-powerpoint',
  'pdf-to-csv',
  'pdf-editor',
  'crop-pdf',
  'pdf-page-deleter',
  'rearrange-pdf',
  'extract-images-from-pdf',
  'add-numbers-to-pdf',
  'add-watermark-to-pdf',
  'add-text-to-pdf',
  'annotate-pdf',
  'protect-pdf',
  'unlock-pdf',
  'sign-pdf',
]);

const IMAGE_TO_PDF_SLUGS = new Set([
  'jpg-to-pdf',
  'png-to-pdf',
  'images-to-pdf',
  'webp-to-pdf',
  'gif-to-pdf',
  'tiff-to-pdf',
  'heic-to-pdf',
  'create-pdf',
]);

async function createSampleImageBytes(
  label: string,
  mime: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png',
  accent = '#0A8CFF',
): Promise<Uint8Array> {
  const canvas = document.createElement('canvas');
  canvas.width = 480;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable.');

  ctx.fillStyle = '#F0F7FF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = accent;
  ctx.fillRect(0, 0, canvas.width, 64);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('ToolPlatform Sample Image', 24, 40);

  ctx.strokeStyle = accent;
  ctx.lineWidth = 3;
  ctx.strokeRect(24, 88, 432, 184);

  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText(label, 42, 140);

  ctx.fillStyle = '#475569';
  ctx.font = '14px sans-serif';
  ctx.fillText('Generated locally in your browser for testing.', 42, 174);
  ctx.fillText('480 × 300 px · Zero server upload', 42, 202);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Failed to generate sample image blob.'))),
      mime,
      0.92,
    );
  });
  return new Uint8Array(await blob.arrayBuffer());
}

async function createSampleThreePagePdf(docLabel: string, fileName: string): Promise<File> {
  const pdfDoc = await PDFDocument.create();
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Embed a real PNG graphic on Page 1 so Extract Images from PDF can extract it too
  const imgBytes = await createSampleImageBytes('Embedded Sample Graphic', 'image/png', '#0A8CFF');
  const embeddedPng = await pdfDoc.embedPng(imgBytes);

  const pagesContent = [
    {
      heading: `Sample Page 1 — ${docLabel}`,
      lines: [
        'This is page 1 of a 3-page sample PDF generated in your browser.',
        'Product: Starter Plan | Qty: 2 | Price: $19.00',
        'Product: Pro Toolkit | Qty: 1 | Price: $49.00',
      ],
    },
    {
      heading: `Sample Page 2 — ${docLabel}`,
      lines: [
        'This is page 2 of the sample PDF document.',
        'Use Split, Rotate, Crop, Rearrange, or Convert tools to test.',
        'Quarter: Q2 | Region: Global | Status: Verified',
      ],
    },
    {
      heading: `Sample Page 3 — ${docLabel}`,
      lines: [
        'This is page 3 — the final page of the sample PDF.',
        'All browser tools process your files locally without uploads.',
        'Quarter: Q3 | Region: Europe | Status: Active',
      ],
    },
  ];

  pagesContent.forEach((p, idx) => {
    const page = pdfDoc.addPage([595.28, 841.89]);
    page.drawRectangle({
      x: 40,
      y: 730,
      width: 515,
      height: 70,
      color: rgb(0.94, 0.97, 1),
    });
    page.drawText(p.heading, {
      x: 56,
      y: 760,
      size: 18,
      font: fontBold,
      color: rgb(0.04, 0.55, 1),
    });
    let y = 690;
    for (const line of p.lines) {
      page.drawText(line, {
        x: 56,
        y,
        size: 12,
        font: fontRegular,
        color: rgb(0.15, 0.2, 0.28),
      });
      y -= 24;
    }
    if (idx === 0) {
      const dims = embeddedPng.scaleToFit(320, 200);
      page.drawImage(embeddedPng, {
        x: 56,
        y: 380,
        width: dims.width,
        height: dims.height,
      });
    }
    page.drawText(`ToolPlatform Sample Document · Page ${idx + 1} of 3`, {
      x: 56,
      y: 48,
      size: 10,
      font: fontRegular,
      color: rgb(0.45, 0.5, 0.58),
    });
  });

  const bytes = await pdfDoc.save();
  return new File([bytes as BlobPart], fileName, {type: 'application/pdf'});
}

async function imageFileToPngBytes(file: File): Promise<Uint8Array> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () =>
        reject(
          new Error(
            `Your browser cannot natively decode "${file.name}" (${file.type || 'unknown format'}). Please convert it to JPG or PNG first.`,
          ),
        );
      el.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || 800;
    canvas.height = img.naturalHeight || 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable.');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Failed to encode image as PNG.'))),
        'image/png',
      );
    });
    return new Uint8Array(await pngBlob.arrayBuffer());
  } finally {
    URL.revokeObjectURL(url);
  }
}

function wrapLines(text: string, maxChars: number): string[] {
  const out: string[] = [];
  for (const rawLine of text.split(/\r?\n/)) {
    if (!rawLine.trim()) {
      out.push('');
      continue;
    }
    const words = rawLine.split(/\s+/);
    let current = '';
    for (const w of words) {
      if ((current + ' ' + w).trim().length > maxChars) {
        if (current) out.push(current);
        current = w;
      } else {
        current = (current + ' ' + w).trim();
      }
    }
    if (current) out.push(current);
  }
  return out;
}

export function PdfToolsRunner({tool}: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [pdfPageCount, setPdfPageCount] = useState<number | null>(null);
  const [processing, setProcessing] = useState(false);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [outputFileName, setOutputFileName] = useState<string>('output.pdf');
  const [extractedText, setExtractedText] = useState<string>('');
  const [extractedImages, setExtractedImages] = useState<ExtractedImageItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Inputs for Create PDF
  const [docTitle, setDocTitle] = useState<string>('My Document Title');
  const [docBody, setDocBody] = useState<string>(
    'Type or paste your text content here to generate a clean PDF document instantly in your browser.',
  );

  // Tool-specific controls
  const [rotationAngle, setRotationAngle] = useState<number>(90);
  const [pageRange, setPageRange] = useState<string>('1');
  const [pageOrder, setPageOrder] = useState<string>('3, 1, 2');
  const [renderPageNumber, setRenderPageNumber] = useState<number>(1);
  const [cropMargins, setCropMargins] = useState({top: 30, right: 30, bottom: 30, left: 30});
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [watermarkOpacity, setWatermarkOpacity] = useState<number>(0.35);
  const [textToAdd, setTextToAdd] = useState<string>('Approved Document');
  const [fontSize, setFontSize] = useState<number>(18);
  const [textPosition, setTextPosition] = useState<'top' | 'middle' | 'bottom'>('top');
  const [addHighlight, setAddHighlight] = useState<boolean>(true);
  const [editorImageFile, setEditorImageFile] = useState<File | null>(null);

  // Phase 3: Unlock PDF State
  const [unlockPassword, setUnlockPassword] = useState<string>('');
  const [showUnlockPassword, setShowUnlockPassword] = useState<boolean>(false);

  // Phase 3: Protect PDF State
  const [protectUserPassword, setProtectUserPassword] = useState<string>('');
  const [protectConfirmPassword, setProtectConfirmPassword] = useState<string>('');
  const [protectOwnerPassword, setProtectOwnerPassword] = useState<string>('');
  const [showProtectPassword, setShowProtectPassword] = useState<boolean>(false);
  const [protectPrintPerm, setProtectPrintPerm] = useState<'full' | 'low' | 'none'>('full');
  const [protectModifyPerm, setProtectModifyPerm] = useState<'all' | 'form' | 'assembly' | 'none'>('none');
  const [protectExtractPerm, setProtectExtractPerm] = useState<boolean>(true);
  const [protectAnnotatePerm, setProtectAnnotatePerm] = useState<boolean>(true);

  // Phase 3: Sign PDF State
  const [signMode, setSignMode] = useState<'draw' | 'type' | 'upload'>('draw');
  const [signTypedText, setSignTypedText] = useState<string>('Jane Doe');
  const [signTypedStyle, setSignTypedStyle] = useState<'cursive' | 'brush' | 'formal'>('cursive');
  const [signUploadedFile, setSignUploadedFile] = useState<File | null>(null);
  const [signPageNumber, setSignPageNumber] = useState<number>(1);
  const [signPosition, setSignPosition] = useState<SignPositionPreset>('bottom-right');
  const [signCustomX, setSignCustomX] = useState<number>(40);
  const [signCustomY, setSignCustomY] = useState<number>(40);
  const [signerName, setSignerName] = useState<string>('Authorized Signer');
  const [signDate, setSignDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [includeStampBadge, setIncludeStampBadge] = useState<boolean>(true);
  const [signScale, setSignScale] = useState<number>(1);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [drawnSigDataUrl, setDrawnSigDataUrl] = useState<string | null>(null);
  const [uploadSigMeta, setUploadSigMeta] = useState<{
    dataUrl: string;
    width: number;
    height: number;
  } | null>(null);
  const [signUploadError, setSignUploadError] = useState<string | null>(null);
  const [signPreviewPageCount, setSignPreviewPageCount] = useState<number>(0);
  const [signPreviewPageNum, setSignPreviewPageNum] = useState<number>(1);
  const [signPreviewPageSize, setSignPreviewPageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [signPreviewLoading, setSignPreviewLoading] = useState<boolean>(false);
  const [signPreviewError, setSignPreviewError] = useState<string | null>(null);
  const [isDraggingSig, setIsDraggingSig] = useState<boolean>(false);
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);
  const signPreviewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const signPreviewStageRef = useRef<HTMLDivElement | null>(null);
  const sigDragRef = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startXPt: number;
    startYPt: number;
    stageWidth: number;
    stageHeight: number;
  } | null>(null);

  const isPdfInputTool = PDF_FILE_TOOL_SLUGS.has(tool.slug);
  const isImageToPdfTool = IMAGE_TO_PDF_SLUGS.has(tool.slug);
  const isMultiple = tool.slug === 'merge-pdf' || isImageToPdfTool;
  const maxLimitMB =
    tool.slug === 'unlock-pdf' ? 75 : tool.slug === 'excel-to-pdf' ? 25 : isImageToPdfTool ? 20 : 50;
  const maxFileCount = tool.maxFiles ?? (isImageToPdfTool ? 20 : 1);

  const resetOutputs = () => {
    setOutputUrl(null);
    setExtractedText('');
    setExtractedImages([]);
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  // Reset all state whenever tool changes so no result or message leaks across routes
  useEffect(() => {
    setFiles([]);
    setPdfPageCount(null);
    setProcessing(false);
    setOutputUrl(null);
    setOutputFileName('output.pdf');
    setExtractedText('');
    setExtractedImages([]);
    setErrorMessage(null);
    setSuccessMessage(null);
    setRotationAngle(90);
    setPageRange(tool.slug === 'pdf-page-deleter' ? '2' : '1-2');
    setPageOrder('3, 1, 2');
    setRenderPageNumber(1);
    setCropMargins({top: 30, right: 30, bottom: 30, left: 30});
    setWatermarkText('CONFIDENTIAL');
    setWatermarkOpacity(0.35);
    setTextToAdd('Approved Document');
    setFontSize(18);
    setTextPosition('top');
    setAddHighlight(true);
    setEditorImageFile(null);
    setUnlockPassword('');
    setShowUnlockPassword(false);
    setProtectUserPassword('');
    setProtectConfirmPassword('');
    setProtectOwnerPassword('');
    setShowProtectPassword(false);
    setProtectPrintPerm('full');
    setProtectModifyPerm('none');
    setProtectExtractPerm(true);
    setProtectAnnotatePerm(true);
    setSignMode('draw');
    setSignTypedText('Jane Doe');
    setSignTypedStyle('cursive');
    setSignUploadedFile(null);
    setSignPageNumber(1);
    setSignPosition('bottom-right');
    setSignCustomX(40);
    setSignCustomY(40);
    setSignerName('Authorized Signer');
    setSignDate(new Date().toISOString().split('T')[0]);
    setIncludeStampBadge(true);
    setSignScale(1);
    setHasDrawn(false);
    setDrawnSigDataUrl(null);
    setUploadSigMeta(null);
    setSignUploadError(null);
    setSignPreviewPageCount(0);
    setSignPreviewPageNum(1);
    setSignPreviewPageSize(null);
    setSignPreviewLoading(false);
    setSignPreviewError(null);
    setIsDraggingSig(false);
    sigDragRef.current = null;
    if (sigCanvasRef.current) {
      const ctx = sigCanvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, sigCanvasRef.current.width, sigCanvasRef.current.height);
    }
  }, [tool.slug]);

  // Read uploaded signature image metadata (natural dimensions + dataUrl) for preview parity
  useEffect(() => {
    if (tool.slug !== 'sign-pdf' || !signUploadedFile) {
      setUploadSigMeta(null);
      setSignUploadError(null);
      return;
    }

    let cancelled = false;
    const reader = new FileReader();
    reader.onload = () => {
      if (cancelled) return;
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) {
        setUploadSigMeta(null);
        setSignUploadError('Could not read uploaded signature image.');
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (cancelled) return;
        setSignUploadError(null);
        setUploadSigMeta({
          dataUrl,
          width: img.naturalWidth || 400,
          height: img.naturalHeight || 150,
        });
      };
      img.onerror = () => {
        if (cancelled) return;
        setUploadSigMeta(null);
        setSignUploadError('Invalid signature image file. Please select a valid PNG or JPG.');
      };
      img.src = dataUrl;
    };
    reader.onerror = () => {
      if (cancelled) return;
      setUploadSigMeta(null);
      setSignUploadError('Failed to read the uploaded signature image.');
    };
    reader.readAsDataURL(signUploadedFile);

    return () => {
      cancelled = true;
    };
  }, [tool.slug, signUploadedFile]);

  // Render live PDF page preview via pdfjs-dist when Sign PDF has a PDF loaded
  useEffect(() => {
    if (tool.slug !== 'sign-pdf') return;
    const activeFile = files[0];
    if (!activeFile) {
      setSignPreviewPageCount(0);
      setSignPreviewPageNum(1);
      setSignPreviewPageSize(null);
      setSignPreviewLoading(false);
      setSignPreviewError(null);
      const canvas = signPreviewCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      return;
    }

    let cancelled = false;
    let renderTask: { cancel: () => void; promise: Promise<void> } | null = null;
    let loadingTask: { destroy?: () => Promise<void>; promise: Promise<any> } | null = null;

    const renderPagePreview = async () => {
      setSignPreviewLoading(true);
      setSignPreviewError(null);

      try {
        const buf = await activeFile.arrayBuffer();
        if (cancelled) return;

        loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(buf) });
        const pdfDoc = await loadingTask.promise;
        if (cancelled) return;

        const totalPages = pdfDoc.numPages;
        if (!totalPages || totalPages < 1) {
          throw new Error('This PDF document contains no pages to preview.');
        }

        const requestedPage = Number.isFinite(signPageNumber) ? Math.floor(signPageNumber) : 1;
        const clampedPage = Math.min(Math.max(1, requestedPage), totalPages);
        const page = await pdfDoc.getPage(clampedPage);
        if (cancelled) return;

        const baseViewport = page.getViewport({ scale: 1 });
        const renderScale = Math.min(2.2, Math.max(1.25, 900 / Math.max(200, baseViewport.width)));
        const renderViewport = page.getViewport({ scale: renderScale });

        const canvas = signPreviewCanvasRef.current;
        if (canvas) {
          canvas.width = Math.max(1, Math.round(renderViewport.width));
          canvas.height = Math.max(1, Math.round(renderViewport.height));
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Browser canvas rendering context is unavailable.');
          }
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          const task = page.render({ canvasContext: ctx, canvas, viewport: renderViewport });
          renderTask = task;
          await task.promise;
        }

        if (cancelled) return;
        setPdfPageCount(totalPages);
        setSignPreviewPageCount(totalPages);
        setSignPreviewPageNum(clampedPage);
        setSignPreviewPageSize({
          width: baseViewport.width,
          height: baseViewport.height,
        });
        setSignPreviewError(null);
      } catch (err: any) {
        if (cancelled || err?.name === 'RenderingCancelledException') return;
        setSignPreviewPageSize(null);
        setSignPreviewPageCount(0);
        const canvas = signPreviewCanvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        const msg =
          err?.name === 'PasswordException'
            ? 'Cannot preview a password-protected PDF. Unlock it first with Unlock PDF.'
            : err?.message || 'Unable to preview this PDF file. Please verify it is a valid, uncorrupted PDF.';
        setSignPreviewError(msg);
      } finally {
        if (!cancelled) {
          setSignPreviewLoading(false);
        }
      }
    };

    renderPagePreview();

    return () => {
      cancelled = true;
      try {
        renderTask?.cancel();
      } catch {
        // ignore cancel error
      }
      try {
        loadingTask?.destroy?.();
      } catch {
        // ignore destroy error
      }
    };
  }, [tool.slug, files, signPageNumber]);

  const inspectUploadedPdf = async (selectedFiles: File[]) => {
    if (selectedFiles.length > 0 && selectedFiles[0].type === 'application/pdf') {
      try {
        const buf = await selectedFiles[0].arrayBuffer();
        const doc = await PDFDocument.load(buf);
        const count = doc.getPageCount();
        setPdfPageCount(count);
        if (tool.slug === 'rearrange-pdf') {
          setPageOrder(
            Array.from({length: count}, (_, i) => count - i).join(', '),
          );
        }
        if (tool.slug === 'split-pdf') {
          setPageRange(count > 1 ? `1-${Math.min(2, count)}` : '1');
        }
        if (tool.slug === 'pdf-page-deleter') {
          setPageRange(count > 1 ? '2' : '1');
        }
      } catch {
        setPdfPageCount(null);
      }
    } else {
      setPdfPageCount(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    let selected = Array.from(e.target.files);
    resetOutputs();

    if (selected.length > maxFileCount) {
      setErrorMessage(`Maximum ${maxFileCount} ${maxFileCount === 1 ? 'file' : 'files'} allowed; extra files were trimmed.`);
      selected = selected.slice(0, maxFileCount);
    }

    const valid = selected.filter((f) => {
      if (f.size > maxLimitMB * 1024 * 1024) {
        setErrorMessage(`File "${f.name}" exceeds the ${maxLimitMB} MB per-file limit.`);
        return false;
      }
      return true;
    });

    setFiles(valid);
    await inspectUploadedPdf(valid);
    e.target.value = '';
  };

  const fileToBase64 = (file: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const res = reader.result as string;
        const b64 = res.includes(',') ? res.split(',')[1] : res;
        resolve(b64);
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleLoadSampleProtectedPdf = async () => {
    resetOutputs();
    try {
      const rawSample = await createSampleThreePagePdf('Encrypted Test Document', 'sample-protected.pdf');
      const arrayBuffer = await rawSample.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);
      const res = await protectPdfBrowser(pdfBytes, 'test123', undefined, undefined, (status) => setSuccessMessage(status));
      const encryptedFile = new File([res.bytes as unknown as BlobPart], 'sample-protected.pdf', {
        type: 'application/pdf',
      });
      setFiles([encryptedFile]);
      setPdfPageCount(res.pageCount || 3);
      setUnlockPassword('test123');
      setSuccessMessage('Loaded 3-page sample encrypted PDF (password: test123). Click Run to decrypt.');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not load sample protected PDF.');
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    isDrawingRef.current = true;
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / Math.max(1, rect.width);
    const scaleY = canvas.height / Math.max(1, rect.height);
    const cx = (clientX - rect.left) * scaleX;
    const cy = (clientY - rect.top) * scaleY;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0F172A';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + 0.1, cy + 0.1);
    ctx.stroke();
  };

  const drawSignatureStroke = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / Math.max(1, rect.width);
    const scaleY = canvas.height / Math.max(1, rect.height);
    const cx = (clientX - rect.left) * scaleX;
    const cy = (clientY - rect.top) * scaleY;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0F172A';
    ctx.lineTo(cx, cy);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawingRef.current && sigCanvasRef.current) {
      setDrawnSigDataUrl(sigCanvasRef.current.toDataURL('image/png'));
    }
    isDrawingRef.current = false;
  };

  const clearSignatureCanvas = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    setDrawnSigDataUrl(null);
  };

  const activeSignaturePreview = useMemo(() => {
    if (tool.slug !== 'sign-pdf') return null;
    if (signMode === 'draw') {
      if (!hasDrawn || !drawnSigDataUrl) return null;
      return {
        dataUrl: drawnSigDataUrl,
        naturalWidth: 400,
        naturalHeight: 150,
      };
    }
    if (signMode === 'type') {
      if (!signTypedText.trim() || typeof document === 'undefined') return null;
      try {
        return {
          dataUrl: renderTypedSignatureDataUrl(signTypedText, signTypedStyle),
          naturalWidth: 440,
          naturalHeight: 140,
        };
      } catch {
        return null;
      }
    }
    if (signMode === 'upload') {
      if (!signUploadedFile || !uploadSigMeta) return null;
      return {
        dataUrl: uploadSigMeta.dataUrl,
        naturalWidth: uploadSigMeta.width,
        naturalHeight: uploadSigMeta.height,
      };
    }
    return null;
  }, [tool.slug, signMode, hasDrawn, drawnSigDataUrl, signTypedText, signTypedStyle, signUploadedFile, uploadSigMeta]);

  const activePreviewGeometry = useMemo(() => {
    if (!signPreviewPageSize) return null;
    const natW = activeSignaturePreview?.naturalWidth ?? 400;
    const natH = activeSignaturePreview?.naturalHeight ?? 150;
    const imgSize = computeSignatureImageSizePt(
      natW,
      natH,
      signScale,
      signPreviewPageSize.width,
      signPreviewPageSize.height,
    );
    const resolved = resolveSignaturePositionPt(
      signPosition,
      Number(signCustomX),
      Number(signCustomY),
      imgSize.imgWidthPt,
      imgSize.imgHeightPt,
      signPreviewPageSize.width,
      signPreviewPageSize.height,
      includeStampBadge,
    );
    const box = computeSignatureBoxRectPt(
      resolved.x,
      resolved.y,
      imgSize.imgWidthPt,
      imgSize.imgHeightPt,
      includeStampBadge,
    );
    const overlayPct = signatureBoxToOverlayPct(
      box,
      signPreviewPageSize.width,
      signPreviewPageSize.height,
    );
    return {
      imgSize,
      resolved,
      box,
      overlayPct,
    };
  }, [signPreviewPageSize, activeSignaturePreview, signScale, signPosition, signCustomX, signCustomY, includeStampBadge]);

  const handleSelectSignPosition = (nextPosition: SignPositionPreset) => {
    setSignPosition(nextPosition);
    if (nextPosition === 'custom') return;
    const pageW = signPreviewPageSize?.width ?? 612;
    const pageH = signPreviewPageSize?.height ?? 792;
    const natW = activeSignaturePreview?.naturalWidth ?? 400;
    const natH = activeSignaturePreview?.naturalHeight ?? 150;
    const imgSize = computeSignatureImageSizePt(natW, natH, signScale, pageW, pageH);
    const resolved = resolveSignaturePositionPt(
      nextPosition,
      signCustomX,
      signCustomY,
      imgSize.imgWidthPt,
      imgSize.imgHeightPt,
      pageW,
      pageH,
      includeStampBadge,
    );
    setSignCustomX(Math.round(resolved.x));
    setSignCustomY(Math.round(resolved.y));
  };

  const handleSigOverlayPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!signPreviewStageRef.current || !activePreviewGeometry) return;
    e.preventDefault();
    e.stopPropagation();
    const stageRect = signPreviewStageRef.current.getBoundingClientRect();
    if (stageRect.width <= 0 || stageRect.height <= 0) return;

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore if unsupported in synthetic environments
    }

    sigDragRef.current = {
      pointerId: e.pointerId,
      startClientX: e.clientX,
      startClientY: e.clientY,
      startXPt: activePreviewGeometry.resolved.x,
      startYPt: activePreviewGeometry.resolved.y,
      stageWidth: stageRect.width,
      stageHeight: stageRect.height,
    };
    setIsDraggingSig(true);
  };

  const handleSigOverlayPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = sigDragRef.current;
    if (!drag || drag.pointerId !== e.pointerId || !signPreviewPageSize || !activePreviewGeometry) return;
    e.preventDefault();
    const dxPx = e.clientX - drag.startClientX;
    const dyPx = e.clientY - drag.startClientY;
    const nextPt = applyPointerDeltaToPositionPt(
      drag.startXPt,
      drag.startYPt,
      dxPx,
      dyPx,
      drag.stageWidth,
      drag.stageHeight,
      activePreviewGeometry.imgSize.imgWidthPt,
      activePreviewGeometry.imgSize.imgHeightPt,
      signPreviewPageSize.width,
      signPreviewPageSize.height,
      includeStampBadge,
    );
    setSignPosition('custom');
    setSignCustomX(nextPt.x);
    setSignCustomY(nextPt.y);
  };

  const handleSigOverlayPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = sigDragRef.current;
    if (!drag || drag.pointerId !== e.pointerId) return;
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {
      // ignore
    }
    sigDragRef.current = null;
    setIsDraggingSig(false);
  };

  const handleLoadSamplePdf = async () => {
    resetOutputs();
    try {
      if (tool.slug === 'merge-pdf') {
        const f1 = await createSampleThreePagePdf('ToolPlatform Part 1', 'sample-part-1.pdf');
        const f2 = await createSampleThreePagePdf('ToolPlatform Part 2', 'sample-part-2.pdf');
        const sampleFiles = [f1, f2];
        setFiles(sampleFiles);
        await inspectUploadedPdf(sampleFiles);
        setSuccessMessage('Loaded 2 sample 3-page PDFs (ready to merge).');
      } else {
        const sampleFile = await createSampleThreePagePdf('ToolPlatform test', 'sample-3page.pdf');
        setFiles([sampleFile]);
        await inspectUploadedPdf([sampleFile]);
        setSuccessMessage('Loaded sample 3-page PDF (sample-3page.pdf). Click Run to process.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not generate sample PDF.');
    }
  };

  const handleLoadSampleImage = async () => {
    resetOutputs();
    try {
      if (tool.slug === 'images-to-pdf') {
        const b1 = await createSampleImageBytes('Sample Photo 1', 'image/png', '#0A8CFF');
        const b2 = await createSampleImageBytes('Sample Photo 2', 'image/jpeg', '#0E7C7B');
        const f1 = new File([b1 as BlobPart], 'sample-image-1.png', {type: 'image/png'});
        const f2 = new File([b2 as BlobPart], 'sample-image-2.jpg', {type: 'image/jpeg'});
        setFiles([f1, f2]);
        setSuccessMessage('Loaded 2 sample images. Click Run to bundle into a PDF.');
      } else if (tool.slug === 'jpg-to-pdf') {
        const bytes = await createSampleImageBytes('Sample JPG Photo', 'image/jpeg', '#0A8CFF');
        setFiles([new File([bytes as BlobPart], 'sample-image.jpg', {type: 'image/jpeg'})]);
        setSuccessMessage('Loaded sample JPG image (sample-image.jpg). Click Run to convert.');
      } else if (tool.slug === 'webp-to-pdf') {
        const bytes = await createSampleImageBytes('Sample WebP Graphic', 'image/webp', '#7C3AED');
        setFiles([new File([bytes as BlobPart], 'sample-image.webp', {type: 'image/webp'})]);
        setSuccessMessage('Loaded sample WebP image (sample-image.webp). Click Run to convert.');
      } else {
        const bytes = await createSampleImageBytes('Sample Image', 'image/png', '#0A8CFF');
        setFiles([new File([bytes as BlobPart], 'sample-image.png', {type: 'image/png'})]);
        setSuccessMessage('Loaded sample image (sample-image.png). Click Run to convert.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not generate sample image.');
    }
  };

  const handleLoadSampleExcel = async () => {
    resetOutputs();
    try {
      const ws = XLSX.utils.aoa_to_sheet([
        ['Item', 'Category', 'Quantity', 'Unit Price'],
        ['Cloud Storage', 'Software', 2, '$15.00'],
        ['Design Kit', 'Assets', 1, '$49.00'],
        ['Support Plan', 'Services', 3, '$25.00'],
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sample Sheet');
      const buf = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
      const file = new File([buf], 'sample-spreadsheet.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      setFiles([file]);
      setSuccessMessage('Loaded sample Excel workbook (sample-spreadsheet.xlsx). Click Run to convert.');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not generate sample Excel file.');
    }
  };

  const handleLoadSampleWord = async () => {
    resetOutputs();
    try {
      const doc = new Document({
        sections: [
          {
            children: [
              new Paragraph({children: [new TextRun({text: 'Sample Word Document', bold: true, size: 32})]}),
              new Paragraph({children: [new TextRun('This is a sample DOCX file generated locally in your browser for testing Word to PDF conversion.')]}),
              new Paragraph({children: [new TextRun('Paragraph 2: Clean text extraction and PDF layout rendering.')]}),
            ],
          },
        ],
      });
      const blob = await Packer.toBlob(doc);
      const file = new File([blob], 'sample-document.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      setFiles([file]);
      setSuccessMessage('Loaded sample Word document (sample-document.docx). Click Run to convert.');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not generate sample Word file.');
    }
  };

  const moveFile = (idx: number, dir: -1 | 1) => {
    const next = [...files];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setFiles(next);
  };

  const removeFile = (idx: number) => {
    const next = files.filter((_, i) => i !== idx);
    setFiles(next);
  };

  const processPdf = async () => {
    setProcessing(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setExtractedImages([]);
    setExtractedText('');

    try {
      const slug = tool.slug;

      if (slug === 'create-pdf' && files.length === 0) {
        const pdfDoc = await PDFDocument.create();
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

        let page = pdfDoc.addPage([595.28, 841.89]);
        page.drawText(docTitle || 'Untitled Document', {
          x: 50,
          y: 780,
          size: 20,
          font: fontBold,
          color: rgb(0.06, 0.09, 0.16),
        });

        const lines = wrapLines(docBody, 82);
        let y = 740;
        for (const line of lines) {
          if (y < 55) {
            page = pdfDoc.addPage([595.28, 841.89]);
            y = 785;
          }
          if (line) {
            page.drawText(line, {
              x: 50,
              y,
              size: 11.5,
              font: fontRegular,
              color: rgb(0.2, 0.24, 0.31),
            });
          }
          y -= 18;
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes as BlobPart], {type: 'application/pdf'});
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFileName('created_document.pdf');
        setSuccessMessage('PDF created successfully from your typed text!');
        setProcessing(false);
        return;
      }

      if (files.length === 0) {
        setErrorMessage('Please upload a file or click the Sample button above.');
        setProcessing(false);
        return;
      }

      if (slug === 'protect-pdf') {
        if (!protectUserPassword) {
          throw new Error('Please enter a user open password to protect this PDF document.');
        }
        if (protectUserPassword !== protectConfirmPassword) {
          throw new Error('User password and confirm password do not match. Please verify both fields.');
        }
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdfBytes = new Uint8Array(arrayBuffer);
        const res = await protectPdfBrowser(
          pdfBytes,
          protectUserPassword,
          protectOwnerPassword || undefined,
          {
            print: protectPrintPerm,
            modify: protectModifyPerm,
            extract: protectExtractPerm,
            annotate: protectAnnotatePerm,
          },
          (status) => setSuccessMessage(status)
        );
        const blob = new Blob([res.bytes as unknown as BlobPart], {type: 'application/pdf'});
        setOutputUrl(URL.createObjectURL(blob));
        const cleanName = file.name.replace(/\.pdf$/i, '');
        setOutputFileName(`${cleanName}_protected.pdf`);
        setSuccessMessage('PDF protected successfully with AES-256 encryption via browser qpdf-wasm.');
      } else if (slug === 'unlock-pdf') {
        if (!unlockPassword) {
          throw new Error('Please enter the document password required to decrypt this PDF.');
        }
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdfBytes = new Uint8Array(arrayBuffer);
        const res = await unlockPdfBrowser(pdfBytes, unlockPassword, (status) => setSuccessMessage(status));
        const blob = new Blob([res.bytes as unknown as BlobPart], {type: 'application/pdf'});
        setOutputUrl(URL.createObjectURL(blob));
        const cleanName = file.name.replace(/\.pdf$/i, '');
        setOutputFileName(`${cleanName}_unlocked.pdf`);
        setSuccessMessage('PDF decrypted and unlocked successfully via browser qpdf-wasm.');
      } else if (slug === 'sign-pdf') {
        let sigDataUrl = '';
        if (signMode === 'draw') {
          const canvas = sigCanvasRef.current;
          if (!canvas || !hasDrawn) {
            throw new Error('Please draw your signature in the signature box before clicking Run.');
          }
          sigDataUrl = canvas.toDataURL('image/png');
        } else if (signMode === 'type') {
          if (!signTypedText.trim()) {
            throw new Error('Please enter your name for the typed signature.');
          }
          sigDataUrl = renderTypedSignatureDataUrl(signTypedText, signTypedStyle);
        } else if (signMode === 'upload') {
          if (!signUploadedFile) {
            throw new Error('Please select a PNG or JPG signature image file to upload.');
          }
          sigDataUrl = await fileToBase64(signUploadedFile);
          if (!sigDataUrl.startsWith('data:image/')) {
            sigDataUrl = `data:${signUploadedFile.type || 'image/png'};base64,${sigDataUrl}`;
          }
        }

        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const totalPages = pdfDoc.getPageCount();
        if (totalPages === 0) throw new Error('The uploaded PDF contains no pages.');

        const targetPageIndex = Math.min(Math.max(1, signPageNumber), totalPages) - 1;
        const targetPage = pdfDoc.getPage(targetPageIndex);
        const {width: pageWidth, height: pageHeight} = targetPage.getSize();

        let embeddedImg;
        const cleanImgBase64 = sigDataUrl.replace(/^data:image\/[a-z]+;base64,/, '');
        const imgBytes = Uint8Array.from(atob(cleanImgBase64), (c) => c.charCodeAt(0));
        try {
          embeddedImg = await pdfDoc.embedPng(imgBytes);
        } catch {
          try {
            embeddedImg = await pdfDoc.embedJpg(imgBytes);
          } catch {
            throw new Error('Invalid signature image format. Please supply a valid PNG or JPEG signature.');
          }
        }

        const scaleVal = signScale || 1;
        const { effectiveScale } = computeSignatureImageSizePt(
          embeddedImg.width,
          embeddedImg.height,
          scaleVal,
          pageWidth,
          pageHeight,
        );
        const imgDims = embeddedImg.scale(effectiveScale);
        const { x, y } = resolveSignaturePositionPt(
          signPosition,
          Number(signCustomX),
          Number(signCustomY),
          imgDims.width,
          imgDims.height,
          pageWidth,
          pageHeight,
          includeStampBadge,
        );

        if (includeStampBadge) {
          targetPage.drawRectangle({
            x: x - 10,
            y: y - 12,
            width: imgDims.width + 20,
            height: imgDims.height + 40,
            color: rgb(0.97, 0.98, 1),
            borderColor: rgb(0.04, 0.55, 1),
            borderWidth: 1,
          });
          targetPage.drawImage(embeddedImg, {
            x,
            y: y + 15,
            width: imgDims.width,
            height: imgDims.height,
          });
          const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
          const regFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
          const nameText = signerName.trim() || 'Verified Signer';
          const dateText = signDate.trim() || new Date().toISOString().split('T')[0];
          targetPage.drawText(`Signed by: ${nameText}`, {
            x,
            y: y + 3,
            size: 8,
            font,
            color: rgb(0.06, 0.09, 0.16),
          });
          targetPage.drawText(`Date: ${dateText}`, {
            x,
            y: y - 7,
            size: 7,
            font: regFont,
            color: rgb(0.3, 0.35, 0.45),
          });
        } else {
          targetPage.drawImage(embeddedImg, {
            x,
            y,
            width: imgDims.width,
            height: imgDims.height,
          });
        }

        const savedBytes = await pdfDoc.save();
        const blob = new Blob([savedBytes as unknown as BlobPart], {type: 'application/pdf'});
        setOutputUrl(URL.createObjectURL(blob));
        const cleanName = file.name.replace(/\.pdf$/i, '');
        setOutputFileName(`${cleanName}_signed.pdf`);
        setSuccessMessage(`Signature applied to page ${targetPageIndex + 1} successfully (100% browser-side).`);
      } else if (slug === 'merge-pdf') {
        const mergedPdf = await PDFDocument.create();
        for (const file of files) {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
          copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
        const pdfBytes = await mergedPdf.save();
        const blob = new Blob([pdfBytes as BlobPart], {type: 'application/pdf'});
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFileName('merged_document.pdf');
        setSuccessMessage(`Merged ${files.length} PDF file(s) into ${mergedPdf.getPageCount()} pages.`);
      } else if (slug === 'split-pdf' || slug === 'pdf-page-deleter') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const newPdf = await PDFDocument.create();
        const totalPages = pdf.getPageCount();

        const selectedSet = new Set<number>();
        const parts = pageRange
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        for (const part of parts) {
          if (part.includes('-')) {
            const [start, end] = part.split('-').map((n) => parseInt(n.trim(), 10));
            if (!isNaN(start) && !isNaN(end)) {
              for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
                if (i >= 1 && i <= totalPages) selectedSet.add(i - 1);
              }
            }
          } else {
            const p = parseInt(part, 10);
            if (!isNaN(p) && p >= 1 && p <= totalPages) selectedSet.add(p - 1);
          }
        }

        const indices =
          slug === 'split-pdf'
            ? Array.from(selectedSet).sort((a, b) => a - b)
            : Array.from({length: totalPages}, (_, i) => i).filter((i) => !selectedSet.has(i));

        if (indices.length === 0) {
          throw new Error(`No valid pages remaining. This PDF has ${totalPages} page(s).`);
        }

        const copiedPages = await newPdf.copyPages(pdf, indices);
        copiedPages.forEach((p) => newPdf.addPage(p));
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes as BlobPart], {type: 'application/pdf'});
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFileName(slug === 'split-pdf' ? 'split_document.pdf' : 'cleaned_document.pdf');
        setSuccessMessage(
          slug === 'split-pdf'
            ? `Extracted ${indices.length} page(s) into a new PDF.`
            : `Removed ${totalPages - indices.length} page(s); ${indices.length} page(s) kept.`,
        );
      } else if (slug === 'rearrange-pdf') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const totalPages = pdf.getPageCount();
        const requested = pageOrder
          .split(',')
          .map((s) => parseInt(s.trim(), 10) - 1)
          .filter((idx) => !isNaN(idx) && idx >= 0 && idx < totalPages);

        if (requested.length === 0) {
          throw new Error(`Enter comma-separated page numbers between 1 and ${totalPages}.`);
        }

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdf, requested);
        copiedPages.forEach((p) => newPdf.addPage(p));
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes as BlobPart], {type: 'application/pdf'});
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFileName('rearranged_document.pdf');
        setSuccessMessage(`Reordered PDF with ${requested.length} page(s) in sequence [${requested.map((i) => i + 1).join(', ')}].`);
      } else if (slug === 'crop-pdf') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pages = pdf.getPages();

        for (const page of pages) {
          const {width, height} = page.getSize();
          const newW = Math.max(50, width - cropMargins.left - cropMargins.right);
          const newH = Math.max(50, height - cropMargins.top - cropMargins.bottom);
          page.setCropBox(cropMargins.left, cropMargins.bottom, newW, newH);
        }

        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes as BlobPart], {type: 'application/pdf'});
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFileName('cropped_document.pdf');
        setSuccessMessage(`Cropped all ${pages.length} page(s) with margins (T:${cropMargins.top}, R:${cropMargins.right}, B:${cropMargins.bottom}, L:${cropMargins.left} pt).`);
      } else if (slug === 'compress-pdf') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const pdfBytes = await pdf.save({useObjectStreams: true, addDefaultPage: false});
        const blob = new Blob([pdfBytes as BlobPart], {type: 'application/pdf'});
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFileName('compressed_document.pdf');
        const origKB = (file.size / 1024).toFixed(1);
        const outKB = (pdfBytes.length / 1024).toFixed(1);
        setSuccessMessage(`PDF optimized locally! Original: ${origKB} KB, Output: ${outKB} KB.`);
      } else if (slug === 'rotate-pdf') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        pdf.getPages().forEach((page) => {
          const currentRotation = page.getRotation().angle;
          page.setRotation(degrees((currentRotation + rotationAngle) % 360));
        });
        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes as BlobPart], {type: 'application/pdf'});
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFileName('rotated_document.pdf');
        setSuccessMessage(`Rotated all ${pdf.getPageCount()} page(s) by ${rotationAngle}° clockwise.`);
      } else if (slug === 'add-numbers-to-pdf') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        const pages = pdf.getPages();
        const total = pages.length;

        pages.forEach((page, idx) => {
          const {width} = page.getSize();
          page.drawText(`Page ${idx + 1} of ${total}`, {
            x: width / 2 - 28,
            y: 22,
            size: 10,
            font,
            color: rgb(0.3, 0.35, 0.42),
          });
        });

        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes as BlobPart], {type: 'application/pdf'});
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFileName('numbered_document.pdf');
        setSuccessMessage(`Added page numbers to ${total} page(s).`);
      } else if (slug === 'add-watermark-to-pdf') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const font = await pdf.embedFont(StandardFonts.HelveticaBold);
        const pages = pdf.getPages();

        pages.forEach((page) => {
          const {width, height} = page.getSize();
          page.drawText(watermarkText || 'CONFIDENTIAL', {
            x: width * 0.22,
            y: height * 0.42,
            size: 42,
            font,
            color: rgb(0.55, 0.6, 0.68),
            opacity: watermarkOpacity,
            rotate: degrees(40),
          });
        });

        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes as BlobPart], {type: 'application/pdf'});
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFileName('watermarked_document.pdf');
        setSuccessMessage(`Stamped custom watermark across ${pages.length} page(s).`);
      } else if (slug === 'add-text-to-pdf' || slug === 'pdf-editor' || slug === 'annotate-pdf') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const font = await pdf.embedFont(StandardFonts.HelveticaBold);
        const pages = pdf.getPages();
        const targetPage = pages[Math.min(Math.max(1, renderPageNumber), pages.length) - 1];
        const {height} = targetPage.getSize();

        const yPos =
          textPosition === 'top'
            ? height - 70
            : textPosition === 'middle'
              ? height / 2
              : 70;

        if ((slug === 'annotate-pdf' || slug === 'pdf-editor') && addHighlight) {
          targetPage.drawRectangle({
            x: 46,
            y: yPos - 6,
            width: Math.min(480, Math.max(120, textToAdd.length * fontSize * 0.58 + 16)),
            height: fontSize + 12,
            color: rgb(1, 0.94, 0.45),
            opacity: 0.6,
          });
        }

        if (textToAdd.trim()) {
          targetPage.drawText(textToAdd, {
            x: 52,
            y: yPos,
            size: fontSize,
            font,
            color: slug === 'annotate-pdf' ? rgb(0.1, 0.1, 0.15) : rgb(0.04, 0.45, 0.88),
          });
        }

        if (slug === 'pdf-editor' && editorImageFile) {
          const imgPngBytes = await imageFileToPngBytes(editorImageFile);
          const embedded = await pdf.embedPng(imgPngBytes);
          const dims = embedded.scaleToFit(140, 140);
          targetPage.drawImage(embedded, {
            x: 52,
            y: Math.max(40, yPos - dims.height - 16),
            width: dims.width,
            height: dims.height,
          });
        }

        const pdfBytes = await pdf.save();
        const blob = new Blob([pdfBytes as BlobPart], {type: 'application/pdf'});
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFileName('edited_document.pdf');
        setSuccessMessage('Annotations embedded into PDF successfully!');
      } else if (slug === 'pdf-to-text') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({data: arrayBuffer});
        const pdfDoc = await loadingTask.promise;
        let fullText = '';

        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += `--- Page ${i} ---\n${pageText}\n\n`;
        }

        setExtractedText(fullText);
        const blob = new Blob([fullText], {type: 'text/plain;charset=utf-8'});
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFileName('extracted_text.txt');
        setSuccessMessage(`Extracted text from ${pdfDoc.numPages} page(s).`);
      } else if (slug === 'pdf-to-word') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({data: arrayBuffer});
        const pdfDoc = await loadingTask.promise;
        const paragraphs: Paragraph[] = [];

        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          paragraphs.push(
            new Paragraph({
              children: [
                new TextRun({text: `Page ${i}`, bold: true}),
                new TextRun({text: `\n${pageText}`, break: 1}),
              ],
            }),
          );
        }

        const doc = new Document({
          sections: [{properties: {}, children: paragraphs}],
        });

        const blob = await Packer.toBlob(doc);
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFileName('converted_document.docx');
        setSuccessMessage(`Converted ${pdfDoc.numPages} page(s) into Word (.docx) (text-based layout).`);
      } else if (slug === 'pdf-to-excel') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({data: arrayBuffer});
        const pdfDoc = await loadingTask.promise;
        const aoa: any[][] = [['Page', 'Line', 'Content']];

        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const textContent = await page.getTextContent();
          const items = textContent.items as Array<{str: string; transform?: number[]}>;
          const rowsMap = new Map<number, string[]>();
          for (const it of items) {
            const yKey = it.transform ? Math.round(it.transform[5] / 5) * 5 : 0;
            const arr = rowsMap.get(yKey) || [];
            if (it.str.trim()) arr.push(it.str.trim());
            rowsMap.set(yKey, arr);
          }
          const sortedY = Array.from(rowsMap.keys()).sort((a, b) => b - a);
          sortedY.forEach((yKey, rowIdx) => {
            const cols = rowsMap.get(yKey) || [];
            if (cols.length > 0) {
              aoa.push([i, rowIdx + 1, ...cols]);
            }
          });
        }

        const ws = XLSX.utils.aoa_to_sheet(aoa);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'PDF Tables');
        const excelBuffer = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
        const blob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFileName('converted_spreadsheet.xlsx');
        setSuccessMessage(`Extracted ${aoa.length - 1} row(s) into Excel (.xlsx).`);
      } else if (slug === 'excel-to-pdf') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const wb = XLSX.read(arrayBuffer, {type: 'array'});
        const firstSheetName = wb.SheetNames[0];
        const ws = wb.Sheets[firstSheetName];
        const data: any[][] = XLSX.utils.sheet_to_json(ws, {header: 1});

        const pdfDoc = await PDFDocument.create();
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontReg = await pdfDoc.embedFont(StandardFonts.Helvetica);
        let page = pdfDoc.addPage([595.28, 841.89]);
        let y = 785;

        page.drawText(`Sheet: ${firstSheetName}`, {x: 44, y, size: 15, font: fontBold, color: rgb(0.05, 0.1, 0.2)});
        y -= 28;

        for (const row of data) {
          if (y < 50) {
            page = pdfDoc.addPage([595.28, 841.89]);
            y = 785;
          }
          const rowStr = row.map((c) => (c === null || c === undefined ? '' : String(c))).join('  |  ');
          if (rowStr.trim()) {
            page.drawText(rowStr.slice(0, 92), {
              x: 44,
              y,
              size: 10,
              font: fontReg,
              color: rgb(0.18, 0.22, 0.28),
            });
            y -= 18;
          }
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes as BlobPart], {type: 'application/pdf'});
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFileName('excel_export.pdf');
        setSuccessMessage(`Rendered ${data.length} spreadsheet row(s) into PDF.`);
      } else if (slug === 'word-to-pdf') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({arrayBuffer});
        const lines = wrapLines(result.value || '(Empty document)', 84);

        const pdfDoc = await PDFDocument.create();
        const fontReg = await pdfDoc.embedFont(StandardFonts.Helvetica);
        let page = pdfDoc.addPage([595.28, 841.89]);
        let y = 785;

        for (const line of lines) {
          if (y < 50) {
            page = pdfDoc.addPage([595.28, 841.89]);
            y = 785;
          }
          if (line.trim()) {
            page.drawText(line, {x: 48, y, size: 11, font: fontReg, color: rgb(0.1, 0.12, 0.18)});
          }
          y -= 18;
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes as BlobPart], {type: 'application/pdf'});
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFileName('word_export.pdf');
        setSuccessMessage('Word document text converted to PDF successfully!');
      } else if (slug === 'pdf-to-powerpoint') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({data: arrayBuffer});
        const pdfDoc = await loadingTask.promise;

        const pptx = new PptxGenJS();
        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');

          const slide = pptx.addSlide();
          slide.addText(`Slide ${i} (from Page ${i})`, {
            x: 0.5,
            y: 0.4,
            fontSize: 18,
            bold: true,
            color: '0A8CFF',
          });
          slide.addText(pageText.slice(0, 1200) || '(No selectable text on this page)', {
            x: 0.5,
            y: 1.1,
            w: '90%',
            h: '78%',
            fontSize: 12,
            color: '333333',
          });
        }

        const pptxBlob = (await pptx.write({outputType: 'blob'})) as Blob;
        setOutputUrl(URL.createObjectURL(pptxBlob));
        setOutputFileName('presentation.pptx');
        setSuccessMessage(`Converted ${pdfDoc.numPages} page(s) into PowerPoint slides (.pptx).`);
      } else if (slug === 'pdf-to-csv') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({data: arrayBuffer});
        const pdfDoc = await loadingTask.promise;
        let csvContent = '"Page","Extracted Text"\n';

        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ')
            .replace(/"/g, '""');
          csvContent += `"${i}","${pageText}"\n`;
        }

        setExtractedText(csvContent);
        const blob = new Blob([csvContent], {type: 'text/csv;charset=utf-8'});
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFileName('extracted_data.csv');
        setSuccessMessage(`Converted ${pdfDoc.numPages} page(s) to CSV.`);
      } else if (slug === 'pdf-to-jpg' || slug === 'pdf-to-png') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({data: arrayBuffer});
        const pdfDoc = await loadingTask.promise;
        const pageNum = Math.min(Math.max(1, renderPageNumber), pdfDoc.numPages);
        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({scale: 1.5});

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not create canvas context.');

        if (slug === 'pdf-to-jpg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        await page.render({canvasContext: ctx, canvas, viewport}).promise;

        // Logo-only watermark ONLY on pdf-to-jpg per src/config/site.ts
        if (slug === 'pdf-to-jpg') {
          applyToolPlatformWatermark(ctx, canvas.width, canvas.height, 'pdf-to-jpg');
        }

        const mime = slug === 'pdf-to-jpg' ? 'image/jpeg' : 'image/png';
        const ext = slug === 'pdf-to-jpg' ? 'jpg' : 'png';
        const dataUrl = canvas.toDataURL(mime, 0.92);

        setOutputUrl(dataUrl);
        setOutputFileName(`page_${pageNum}.${ext}`);
        setSuccessMessage(`Rendered page ${pageNum} of ${pdfDoc.numPages} to ${ext.toUpperCase()}.`);
      } else if (slug === 'extract-images-from-pdf') {
        const file = files[0];
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({data: arrayBuffer});
        const pdfDoc = await loadingTask.promise;
        const found: ExtractedImageItem[] = [];

        for (let pNum = 1; pNum <= pdfDoc.numPages; pNum++) {
          const page = await pdfDoc.getPage(pNum);
          // Render once offscreen so pdf.js populates page.objs
          const vp = page.getViewport({scale: 1});
          const dummyCanvas = document.createElement('canvas');
          dummyCanvas.width = vp.width;
          dummyCanvas.height = vp.height;
          const dCtx = dummyCanvas.getContext('2d');
          if (dCtx) {
            await page.render({canvasContext: dCtx, canvas: dummyCanvas, viewport: vp}).promise;
          }

          const opList = await page.getOperatorList();
          const seenNames = new Set<string>();

          for (let i = 0; i < opList.fnArray.length; i++) {
            const fn = opList.fnArray[i];
            if (fn === pdfjsLib.OPS.paintImageXObject || fn === pdfjsLib.OPS.paintInlineImageXObject) {
              const arg = opList.argsArray[i]?.[0];
              if (!arg) continue;
              let imgObj: any = null;
              if (typeof arg === 'string') {
                if (seenNames.has(arg)) continue;
                seenNames.add(arg);
                try {
                  imgObj = page.objs.has(arg) ? page.objs.get(arg) : null;
                } catch {
                  imgObj = null;
                }
              } else if (typeof arg === 'object') {
                imgObj = arg;
              }

              if (!imgObj || !imgObj.width || !imgObj.height) continue;

              const c = document.createElement('canvas');
              c.width = imgObj.width;
              c.height = imgObj.height;
              const cCtx = c.getContext('2d');
              if (!cCtx) continue;

              if (imgObj.bitmap) {
                cCtx.drawImage(imgObj.bitmap, 0, 0);
              } else if (imgObj.data) {
                const rgba = new Uint8ClampedArray(imgObj.width * imgObj.height * 4);
                const src = imgObj.data as Uint8ClampedArray;
                if (src.length === rgba.length) {
                  rgba.set(src);
                } else if (src.length === imgObj.width * imgObj.height * 3) {
                  for (let j = 0, k = 0; j < src.length; j += 3, k += 4) {
                    rgba[k] = src[j];
                    rgba[k + 1] = src[j + 1];
                    rgba[k + 2] = src[j + 2];
                    rgba[k + 3] = 255;
                  }
                } else {
                  continue;
                }
                const imageData = new ImageData(rgba, imgObj.width, imgObj.height);
                cCtx.putImageData(imageData, 0, 0);
              } else {
                continue;
              }

              found.push({
                name: `page${pNum}_image${found.length + 1}.png`,
                url: c.toDataURL('image/png'),
                width: imgObj.width,
                height: imgObj.height,
              });
            }
          }
        }

        if (found.length === 0) {
          setErrorMessage('No embedded raster images were found in this PDF (pages may contain vector shapes or text only).');
        } else {
          setExtractedImages(found);
          setOutputUrl(found[0].url);
          setOutputFileName(found[0].name);
          setSuccessMessage(`Extracted ${found.length} embedded image(s) from the PDF.`);
        }
      } else if (isImageToPdfTool) {
        const pdfDoc = await PDFDocument.create();

        for (const file of files) {
          const arrayBuffer = await file.arrayBuffer();
          let embeddedImage;
          if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
            embeddedImage = await pdfDoc.embedJpg(arrayBuffer);
          } else if (file.type === 'image/png') {
            embeddedImage = await pdfDoc.embedPng(arrayBuffer);
          } else {
            const pngBytes = await imageFileToPngBytes(file);
            embeddedImage = await pdfDoc.embedPng(pngBytes);
          }

          const page = pdfDoc.addPage([595.28, 841.89]);
          const dims = embeddedImage.scaleToFit(515, 760);
          page.drawImage(embeddedImage, {
            x: 595.28 / 2 - dims.width / 2,
            y: 841.89 / 2 - dims.height / 2,
            width: dims.width,
            height: dims.height,
          });
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes as BlobPart], {type: 'application/pdf'});
        setOutputUrl(URL.createObjectURL(blob));
        setOutputFileName('converted_images.pdf');
        setSuccessMessage(`Converted ${files.length} image(s) into a ${pdfDoc.getPageCount()}-page PDF!`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err?.message || 'Error processing file.');
    } finally {
      setProcessing(false);
    }
  };

  const acceptAttr =
    tool.slug === 'excel-to-pdf'
      ? '.xlsx,.xls'
      : tool.slug === 'word-to-pdf'
        ? '.docx,.doc'
        : isImageToPdfTool
          ? 'image/*'
          : '.pdf';

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-600 dark:text-red-400">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {tool.slug === 'excel-to-pdf'
                ? 'Max 25 MB per file · Simple tables only'
                : isImageToPdfTool
                  ? `Max 20 MB per image (max ${maxFileCount} images)`
                  : tool.slug === 'unlock-pdf'
                    ? 'Max 75 MB per file · 100% in-browser qpdf-wasm (strictly requires password)'
                    : tool.slug === 'protect-pdf' || tool.slug === 'sign-pdf'
                      ? 'Max 50 MB per file · 100% in-browser qpdf-wasm (zero network uploads)'
                      : 'Max 50 MB per PDF file · 100% browser-side processing'}
            </p>
          </div>
        </div>
        {tool.slug === 'protect-pdf' || tool.slug === 'unlock-pdf' || tool.slug === 'sign-pdf' ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
            100% In-Browser qpdf-wasm
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active Browser Tool
          </span>
        )}
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs text-sky-900 dark:text-sky-200 flex items-center gap-2">
          <Sparkles className="h-4 w-4 shrink-0 text-sky-600" />
          <span>
            {tool.slug === 'protect-pdf'
              ? '100% in-browser qpdf-wasm: AES-256 open password encryption with optional advisory viewer permissions. Zero uploads, zero retention.'
              : tool.slug === 'unlock-pdf'
                ? '100% in-browser qpdf-wasm: Supply the valid document password to decrypt cleanly. Zero cracking, zero bypass, zero uploads.'
                : tool.slug === 'sign-pdf'
                  ? '100% in-browser qpdf-wasm: Applies a visible signature stamp and standardizes the PDF. Transparent notice: visual stamp, not a PKCS#7 CA certificate.'
                  : tool.slug === 'excel-to-pdf'
                    ? 'Max 25 MB. Simple tables only — complex formulas and charts are not preserved.'
                    : tool.slug === 'pdf-to-word'
                      ? 'Max 50 MB per PDF file. Text-based conversion, simple layout only, not pixel-perfect.'
                      : tool.slug === 'pdf-to-excel' || tool.slug === 'pdf-to-csv'
                        ? 'Max 50 MB per PDF file. Simple tables only — complex merged layouts may need cleanup.'
                        : tool.slug === 'pdf-to-powerpoint'
                          ? 'Max 50 MB per PDF file. Approximate slide layout, not pixel-perfect.'
                          : tool.slug === 'word-to-pdf'
                            ? 'Max 50 MB per file. Text-based DOCX conversion, simple layout only.'
                            : isImageToPdfTool
                              ? `Max 20 MB per image, max ${maxFileCount} images. Runs locally in your browser.`
                              : 'Max 50 MB per PDF file. All processing runs locally in your browser with zero uploads.'}
          </span>
        </div>

        {tool.slug === 'unlock-pdf' && (
          <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800 text-xs text-indigo-950 dark:text-indigo-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-indigo-900 dark:text-indigo-100">
              <ShieldCheck className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              <span>100% In-Browser qpdf-wasm Decryption & Strict Security Rules</span>
            </div>
            <p className="leading-relaxed">
              <strong>Strict Security Policy:</strong> Unlock PDF strictly requires the valid document password to authorize decryption. It runs 100% client-side via qpdf-wasm and <strong>NEVER</strong> cracks, brute-forces, or bypasses unknown passwords. An incorrect password will fail immediately with a clear error and zero output.
            </p>
            <p className="leading-relaxed text-[11px] text-indigo-700 dark:text-indigo-300">
              <strong>Zero Password Retention:</strong> Passwords are entered per operation only, processed in browser memory, and never stored, logged, or placed in URLs. Uploaded files are processed and discarded locally with zero network uploads.
            </p>
          </div>
        )}

        {tool.slug === 'protect-pdf' && (
          <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border-2 border-sky-200 dark:border-sky-800 text-xs text-sky-950 dark:text-sky-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-sky-900 dark:text-sky-100">
              <Lock className="h-5 w-5 text-sky-600 dark:text-sky-400 shrink-0" />
              <span>AES-256 (Revision 6) Encryption & Advisory Permissions Notice</span>
            </div>
            <p className="leading-relaxed">
              <strong>Genuine Cryptographic Protection:</strong> Protect PDF encrypts your document with AES-256 encryption via 100% in-browser qpdf-wasm. The user open password is required to view the document pages.
            </p>
            <p className="leading-relaxed text-[11px] text-sky-800 dark:text-sky-300">
              <strong>Advisory Permissions Notice:</strong> PDF viewer permissions (such as print or copy restrictions) are advisory flags in the PDF specification. Standard-compliant PDF readers respect them, but third-party software cannot be guaranteed to enforce them. Strict privacy: passwords and files are never stored or logged.
            </p>
          </div>
        )}

        {tool.slug === 'sign-pdf' && (
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-900 dark:text-amber-100">
              <PenTool className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Important Notice — Visible Electronic Signature Stamp</span>
            </div>
            <p className="leading-relaxed">
              <strong>Honest Limits Notice:</strong> Sign PDF applies a visible electronic signature stamp to your document and standardizes the PDF via 100% in-browser qpdf-wasm. It does <strong>NOT</strong> create a certified PKCS#7 digital signature, does not embed an X.509 Certificate Authority (CA) certificate, and does not provide cryptographic timestamp tokens.
            </p>
            <p className="leading-relaxed text-[11px] text-amber-800 dark:text-amber-300">
              Use this tool for everyday agreements, permission slips, internal approvals, and receipts that accept a visible signature stamp. Files and signatures are processed 100% locally in your browser with zero network uploads.
            </p>
          </div>
        )}

        {tool.slug === 'pdf-editor' && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200">
            <strong>Editing scope notice:</strong> Existing PDF text cannot be edited like Word — text does not reflow. You can add new text, highlights, image stamps, and annotations onto a page.
          </div>
        )}

        {tool.slug === 'create-pdf' && (
          <div className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Option A: Type or Paste Text
            </h3>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Document Title
              </label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                Body Text Content
              </label>
              <textarea
                rows={5}
                value={docBody}
                onChange={(e) => setDocBody(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
              />
            </div>
            <div className="text-center text-[11px] text-slate-400 font-semibold">
              — OR upload image files below —
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {tool.slug === 'create-pdf' ? 'Option B: Upload Image Files' : 'Select Files'}
            </label>

            {isPdfInputTool && (
              <div className="flex flex-wrap items-center gap-2">
                {tool.slug === 'unlock-pdf' && (
                  <button
                    type="button"
                    onClick={handleLoadSampleProtectedPdf}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 transition-colors cursor-pointer"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    <span>Try sample encrypted PDF (password: test123)</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleLoadSamplePdf}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 px-3 py-1.5 text-xs font-semibold text-[#0A8CFF] transition-colors cursor-pointer"
                >
                  <FlaskConical className="h-3.5 w-3.5" />
                  <span>Try sample PDF (3-page test file)</span>
                </button>
              </div>
            )}

            {isImageToPdfTool && (
              <button
                type="button"
                onClick={handleLoadSampleImage}
                className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 px-3 py-1.5 text-xs font-semibold text-[#0A8CFF] transition-colors cursor-pointer"
              >
                <FlaskConical className="h-3.5 w-3.5" />
                <span>Try sample image (test graphic)</span>
              </button>
            )}

            {tool.slug === 'excel-to-pdf' && (
              <button
                type="button"
                onClick={handleLoadSampleExcel}
                className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 px-3 py-1.5 text-xs font-semibold text-[#0A8CFF] transition-colors cursor-pointer"
              >
                <FlaskConical className="h-3.5 w-3.5" />
                <span>Try sample Excel (.xlsx)</span>
              </button>
            )}

            {tool.slug === 'word-to-pdf' && (
              <button
                type="button"
                onClick={handleLoadSampleWord}
                className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/50 hover:bg-sky-100 dark:hover:bg-sky-900/60 px-3 py-1.5 text-xs font-semibold text-[#0A8CFF] transition-colors cursor-pointer"
              >
                <FlaskConical className="h-3.5 w-3.5" />
                <span>Try sample Word (.docx)</span>
              </button>
            )}
          </div>

          <div className="flex items-center justify-center w-full">
            <label className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-slate-300 dark:border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-50 dark:hover:bg-slate-800 dark:bg-slate-900 hover:bg-slate-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                <Upload className="w-8 h-8 mb-2 text-slate-400" />
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <span className="font-bold">Click to upload</span> or drag and drop
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Accepted: {tool.acceptedFormats.join(', ')} · Max {maxLimitMB} MB per file
                </p>
              </div>
              <input
                type="file"
                multiple={isMultiple}
                accept={acceptAttr}
                onChange={handleFileChange}
                className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
              />
            </label>
          </div>

          {files.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Selected Files ({files.length})
                {pdfPageCount !== null ? ` · ${pdfPageCount} page(s) detected` : ''}:
              </div>
              {files.map((f, i) => (
                <div
                  key={`${f.name}-${i}`}
                  className="flex justify-between items-center gap-2 text-xs p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <span className="truncate max-w-xs font-medium">{f.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-slate-400 font-mono">
                      {(f.size / 1024).toFixed(1)} KB
                    </span>
                    {isMultiple && files.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => moveFile(i, -1)}
                          disabled={i === 0}
                          aria-label="Move up"
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveFile(i, 1)}
                          disabled={i === files.length - 1}
                          aria-label="Move down"
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      aria-label="Remove file"
                      className="p-1 rounded text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tool-specific controls */}
        {tool.slug === 'rotate-pdf' && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Rotation Angle
            </label>
            <select
              value={rotationAngle}
              onChange={(e) => setRotationAngle(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
            >
              <option value={90}>90° Clockwise</option>
              <option value={180}>180° Flip</option>
              <option value={270}>270° Clockwise (90° Counter-clockwise)</option>
            </select>
          </div>
        )}

        {(tool.slug === 'split-pdf' || tool.slug === 'pdf-page-deleter') && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {tool.slug === 'split-pdf'
                ? 'Pages to Extract (e.g. 1, 3 or 1-2)'
                : 'Pages to Delete (e.g. 2 or 2-3)'}
            </label>
            <input
              type="text"
              value={pageRange}
              onChange={(e) => setPageRange(e.target.value)}
              placeholder="1-2"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
            />
          </div>
        )}

        {tool.slug === 'rearrange-pdf' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                New Page Order (comma-separated, e.g. 3, 1, 2)
              </label>
              {pdfPageCount && pdfPageCount > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setPageOrder(
                      Array.from({length: pdfPageCount}, (_, i) => pdfPageCount - i).join(', '),
                    )
                  }
                  className="text-xs font-semibold text-[#0A8CFF] hover:underline"
                >
                  Reverse order
                </button>
              )}
            </div>
            <input
              type="text"
              value={pageOrder}
              onChange={(e) => setPageOrder(e.target.value)}
              placeholder="3, 1, 2"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
            />
          </div>
        )}

        {tool.slug === 'crop-pdf' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
              <div key={side}>
                <label className="block text-xs font-semibold capitalize text-slate-700 dark:text-slate-300 mb-1">
                  {side} Trim (pt)
                </label>
                <input
                  type="number"
                  min={0}
                  max={250}
                  value={cropMargins[side]}
                  onChange={(e) =>
                    setCropMargins((prev) => ({
                      ...prev,
                      [side]: Math.max(0, Number(e.target.value) || 0),
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2 text-xs bg-white dark:bg-slate-900"
                />
              </div>
            ))}
          </div>
        )}

        {(tool.slug === 'pdf-to-jpg' || tool.slug === 'pdf-to-png') && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Page Number to Render {pdfPageCount ? `(1 – ${pdfPageCount})` : ''}
            </label>
            <input
              type="number"
              min={1}
              max={pdfPageCount || 999}
              value={renderPageNumber}
              onChange={(e) => setRenderPageNumber(Math.max(1, Number(e.target.value) || 1))}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
            />
          </div>
        )}

        {tool.slug === 'add-watermark-to-pdf' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Custom Watermark Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Opacity: {Math.round(watermarkOpacity * 100)}%
              </label>
              <input
                type="range"
                min={0.1}
                max={0.8}
                step={0.05}
                value={watermarkOpacity}
                onChange={(e) => setWatermarkOpacity(Number(e.target.value))}
                className="w-full mt-2"
              />
            </div>
          </div>
        )}

        {(tool.slug === 'add-text-to-pdf' ||
          tool.slug === 'pdf-editor' ||
          tool.slug === 'annotate-pdf') && (
          <div className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Text / Annotation to Add
                </label>
                <input
                  type="text"
                  value={textToAdd}
                  onChange={(e) => setTextToAdd(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Page & Position
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    max={pdfPageCount || 999}
                    value={renderPageNumber}
                    onChange={(e) => setRenderPageNumber(Math.max(1, Number(e.target.value) || 1))}
                    className="w-20 rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
                  />
                  <select
                    value={textPosition}
                    onChange={(e) => setTextPosition(e.target.value as 'top' | 'middle' | 'bottom')}
                    className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
                  >
                    <option value="top">Top of Page</option>
                    <option value="middle">Middle of Page</option>
                    <option value="bottom">Bottom of Page</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex-1 min-w-[180px]">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Font Size: {fontSize}px
                </label>
                <input
                  type="range"
                  min={10}
                  max={36}
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              {(tool.slug === 'annotate-pdf' || tool.slug === 'pdf-editor') && (
                <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={addHighlight}
                    onChange={(e) => setAddHighlight(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span>Include yellow highlight box</span>
                </label>
              )}
            </div>

            {tool.slug === 'pdf-editor' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Optional Image / Stamp Overlay (PNG or JPG)
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => setEditorImageFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-sky-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#0A8CFF]"
                />
              </div>
            )}
          </div>
        )}

        {tool.slug === 'unlock-pdf' && (
          <div className="space-y-4 p-5 rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-950/20">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-950 dark:text-indigo-200">
              <KeyRound className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <span>Document Password Authentication</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Existing PDF Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showUnlockPassword ? 'text' : 'password'}
                  data-sensitive="password"
                  autoComplete="current-password"
                  value={unlockPassword}
                  onChange={(e) => setUnlockPassword(e.target.value)}
                  placeholder="Enter the valid password for this PDF"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 pr-10 text-xs bg-white dark:bg-slate-900"
                />
                <button
                  type="button"
                  onClick={() => setShowUnlockPassword(!showUnlockPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label={showUnlockPassword ? 'Hide password' : 'Show password'}
                >
                  {showUnlockPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Browser-side qpdf-wasm requires the authorized open password. Incorrect passwords fail immediately with no output.
              </p>
            </div>
          </div>
        )}

        {tool.slug === 'protect-pdf' && (
          <div className="space-y-4 p-5 rounded-2xl border border-sky-200 dark:border-sky-800 bg-sky-50/50 dark:bg-sky-950/20">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-950 dark:text-sky-200">
              <Lock className="h-4 w-4 text-[#0A8CFF]" />
              <span>AES-256 Encryption Settings</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  User Open Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showProtectPassword ? 'text' : 'password'}
                    data-sensitive="password"
                    autoComplete="new-password"
                    value={protectUserPassword}
                    onChange={(e) => setProtectUserPassword(e.target.value)}
                    placeholder="Create open password"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 pr-10 text-xs bg-white dark:bg-slate-900"
                  />
                  <button
                    type="button"
                    onClick={() => setShowProtectPassword(!showProtectPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    aria-label={showProtectPassword ? 'Hide password' : 'Show password'}
                  >
                    {showProtectPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm Open Password <span className="text-rose-500">*</span>
                </label>
                <input
                  type={showProtectPassword ? 'text' : 'password'}
                  data-sensitive="password"
                  autoComplete="new-password"
                  value={protectConfirmPassword}
                  onChange={(e) => setProtectConfirmPassword(e.target.value)}
                  placeholder="Repeat open password"
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Optional Owner / Master Password (leave empty to use user password)
              </label>
              <input
                type={showProtectPassword ? 'text' : 'password'}
                data-sensitive="password"
                autoComplete="new-password"
                value={protectOwnerPassword}
                onChange={(e) => setProtectOwnerPassword(e.target.value)}
                placeholder="Optional separate owner password"
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
              />
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Advisory Viewer Permissions (Standard PDF Flags)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Printing Permission
                  </label>
                  <select
                    value={protectPrintPerm}
                    onChange={(e) => setProtectPrintPerm(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-900 text-xs"
                  >
                    <option value="full">Allow Full High-Resolution Printing</option>
                    <option value="low">Allow Low-Resolution Only</option>
                    <option value="none">Disallow Printing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Modifications Permission
                  </label>
                  <select
                    value={protectModifyPerm}
                    onChange={(e) => setProtectModifyPerm(e.target.value as any)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2 bg-white dark:bg-slate-900 text-xs"
                  >
                    <option value="none">Disallow Modifications</option>
                    <option value="form">Allow Form Filling & Signing</option>
                    <option value="assembly">Allow Page Assembly Only</option>
                    <option value="all">Allow Full Modification</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-1">
                <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={protectExtractPerm}
                    onChange={(e) => setProtectExtractPerm(e.target.checked)}
                    className="rounded border-slate-300 text-[#0A8CFF]"
                  />
                  <span>Allow Content & Text Extraction (Copying)</span>
                </label>

                <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={protectAnnotatePerm}
                    onChange={(e) => setProtectAnnotatePerm(e.target.checked)}
                    className="rounded border-slate-300 text-[#0A8CFF]"
                  />
                  <span>Allow Adding Annotations & Comments</span>
                </label>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                * Note: Permission flags are advisory signals in the PDF standard. Compliant readers enforce them; third-party viewers may not. The open password provides genuine cryptographic encryption.
              </p>
            </div>
          </div>
        )}

        {tool.slug === 'sign-pdf' && (
          <div className="space-y-4 p-4 sm:p-5 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-950 dark:text-amber-200">
                <PenTool className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span>Create Visible Signature</span>
              </div>
              <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-900">
                <button
                  type="button"
                  onClick={() => setSignMode('draw')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    signMode === 'draw'
                      ? 'bg-[#0A8CFF] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                  }`}
                >
                  Draw
                </button>
                <button
                  type="button"
                  onClick={() => setSignMode('type')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    signMode === 'type'
                      ? 'bg-[#0A8CFF] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                  }`}
                >
                  Type
                </button>
                <button
                  type="button"
                  onClick={() => setSignMode('upload')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    signMode === 'upload'
                      ? 'bg-[#0A8CFF] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                  }`}
                >
                  Upload Image
                </button>
              </div>
            </div>

            {signMode === 'draw' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
                  <span>Draw your signature with mouse or touch:</span>
                  <button
                    type="button"
                    onClick={clearSignatureCanvas}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Clear Canvas</span>
                  </button>
                </div>
                <div className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-2 flex justify-center">
                  <canvas
                    ref={sigCanvasRef}
                    width={400}
                    height={150}
                    onMouseDown={startDrawing}
                    onMouseMove={drawSignatureStroke}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={drawSignatureStroke}
                    onTouchEnd={stopDrawing}
                    className="w-full max-w-md h-36 border border-slate-200 dark:border-slate-800 rounded-lg cursor-crosshair touch-none bg-slate-50/50 dark:bg-slate-900/50"
                  />
                </div>
                {hasDrawn && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Signature drawn and ready! Drag it directly on the PDF preview below.
                  </p>
                )}
              </div>
            )}

            {signMode === 'type' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Full Signer Name
                    </label>
                    <input
                      type="text"
                      value={signTypedText}
                      onChange={(e) => {
                        setSignTypedText(e.target.value);
                        setSignerName(e.target.value);
                      }}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Typography Style
                    </label>
                    <select
                      value={signTypedStyle}
                      onChange={(e) => setSignTypedStyle(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
                    >
                      <option value="cursive">Casual Script (Caveat / Dancing)</option>
                      <option value="brush">Brush Flourish (Brush Script)</option>
                      <option value="formal">Executive Serif (Formal)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-center">
                  <div
                    className="text-2xl sm:text-3xl text-slate-900 dark:text-white"
                    style={{
                      fontFamily:
                        signTypedStyle === 'brush'
                          ? '"Brush Script MT", cursive, serif'
                          : signTypedStyle === 'formal'
                            ? '"Georgia", "Times New Roman", serif'
                            : '"Caveat", "Dancing Script", cursive',
                      fontStyle: 'italic',
                    }}
                  >
                    {signTypedText || 'Your Signature'}
                  </div>
                </div>
              </div>
            )}

            {signMode === 'upload' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Upload Signature Image (PNG or JPG with transparent or clean background)
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => setSignUploadedFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-50 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-amber-700"
                />
                {signUploadError && (
                  <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                    {signUploadError}
                  </p>
                )}
                {signUploadedFile && !signUploadError && (
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                    Selected: {signUploadedFile.name} ({(signUploadedFile.size / 1024).toFixed(1)} KB)
                  </p>
                )}
              </div>
            )}

            {/* Interactive PDF Page Preview + Touch/Mouse Draggable Signature Overlay */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-[#0A8CFF]" />
                    <span>PDF Page Preview &amp; Drag Placement</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {signPreviewPageSize
                      ? `Page ${signPreviewPageNum} of ${signPreviewPageCount} — ${Math.round(signPreviewPageSize.width)} × ${Math.round(signPreviewPageSize.height)} pt`
                      : 'Upload a PDF or click Try sample PDF to preview and place your signature.'}
                  </p>
                </div>

                {signPreviewPageCount > 1 && (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSignPageNumber((p) => Math.max(1, p - 1))}
                      disabled={signPreviewPageNum <= 1}
                      aria-label="Previous PDF page"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span>Prev</span>
                    </button>
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-300 px-1">
                      {signPreviewPageNum}/{signPreviewPageCount}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setSignPageNumber((p) => Math.min(signPreviewPageCount, p + 1))
                      }
                      disabled={signPreviewPageNum >= signPreviewPageCount}
                      aria-label="Next PDF page"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {files.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/70 p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                  Upload a PDF document above (or click <strong>Try sample PDF</strong>) to view page {signPageNumber} and drag your signature with touch or mouse.
                </div>
              ) : signPreviewError ? (
                <div
                  role="alert"
                  className="rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 p-4 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">PDF Preview Unavailable</div>
                    <p className="mt-0.5">{signPreviewError}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {signPreviewPageSize && !activeSignaturePreview && (
                    <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50/90 dark:bg-sky-950/40 px-3 py-2 text-[11px] text-sky-900 dark:text-sky-200">
                      {signMode === 'draw'
                        ? 'Draw your signature above to place and drag it onto this page.'
                        : signMode === 'type'
                          ? 'Type your signature name above to place and drag it onto this page.'
                          : 'Upload a PNG or JPG signature image above to place and drag it onto this page.'}
                    </div>
                  )}

                  {signPreviewPageSize && activeSignaturePreview && activePreviewGeometry && (
                    <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-[11px] text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                        <Move className="h-3.5 w-3.5 text-[#0A8CFF]" />
                        <span>Drag signature with touch or mouse to place anywhere on the page</span>
                      </span>
                      <span
                        data-testid="sign-live-coords"
                        className="font-mono font-semibold text-[#0A8CFF]"
                      >
                        X: {Math.round(activePreviewGeometry.resolved.x)} pt · Y: {Math.round(activePreviewGeometry.resolved.y)} pt
                      </span>
                    </div>
                  )}

                  <div className="w-full max-w-full overflow-hidden rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-200/70 dark:bg-slate-950 p-2 sm:p-4">
                    <div
                      ref={signPreviewStageRef}
                      data-testid="sign-pdf-preview-stage"
                      className="relative mx-auto w-full max-w-[640px] bg-white shadow-md rounded-sm overflow-hidden select-none"
                      style={
                        signPreviewPageSize
                          ? { aspectRatio: `${signPreviewPageSize.width} / ${signPreviewPageSize.height}` }
                          : { minHeight: '260px' }
                      }
                    >
                      <canvas
                        ref={signPreviewCanvasRef}
                        data-testid="sign-pdf-preview-canvas"
                        className="block w-full h-auto pointer-events-none"
                      />

                      {signPreviewLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-950/75 text-xs font-medium text-slate-600 dark:text-slate-300">
                          <Loader2 className="h-4 w-4 animate-spin mr-2 text-[#0A8CFF]" />
                          <span>Rendering PDF page preview...</span>
                        </div>
                      )}

                      {!signPreviewLoading &&
                        signPreviewPageSize &&
                        activeSignaturePreview &&
                        activePreviewGeometry && (
                          <div
                            role="slider"
                            tabIndex={0}
                            aria-label="Draggable signature placement overlay"
                            aria-valuetext={`X ${Math.round(activePreviewGeometry.resolved.x)} pt, Y ${Math.round(activePreviewGeometry.resolved.y)} pt`}
                            data-testid="sign-signature-overlay"
                            onPointerDown={handleSigOverlayPointerDown}
                            onPointerMove={handleSigOverlayPointerMove}
                            onPointerUp={handleSigOverlayPointerUp}
                            onPointerCancel={handleSigOverlayPointerUp}
                            onKeyDown={(e) => {
                              const step = e.shiftKey ? 20 : 5;
                              let dx = 0;
                              let dy = 0;
                              if (e.key === 'ArrowLeft') dx = -step;
                              else if (e.key === 'ArrowRight') dx = step;
                              else if (e.key === 'ArrowUp') dy = step;
                              else if (e.key === 'ArrowDown') dy = -step;
                              else return;
                              e.preventDefault();
                              setSignPosition('custom');
                              setSignCustomX(Math.max(0, Math.round(activePreviewGeometry.resolved.x + dx)));
                              setSignCustomY(Math.max(0, Math.round(activePreviewGeometry.resolved.y + dy)));
                            }}
                            style={{
                              touchAction: 'none',
                              left: `${activePreviewGeometry.overlayPct.leftPct}%`,
                              top: `${activePreviewGeometry.overlayPct.topPct}%`,
                              width: `${activePreviewGeometry.overlayPct.widthPct}%`,
                              height: `${activePreviewGeometry.overlayPct.heightPct}%`,
                            }}
                            className={`absolute cursor-grab active:cursor-grabbing select-none transition-shadow ${
                              isDraggingSig
                                ? 'ring-2 ring-[#0A8CFF] shadow-xl z-20'
                                : 'hover:ring-2 hover:ring-[#0A8CFF]/80 z-10'
                            } ${
                              includeStampBadge
                                ? 'bg-[#F7FAFF]/95 border border-[#0A8CFF]'
                                : 'border border-dashed border-[#0A8CFF]/75 bg-white/25'
                            }`}
                          >
                            {isDraggingSig && (
                              <div className="pointer-events-none absolute -top-6 left-0 whitespace-nowrap rounded bg-slate-900/90 px-1.5 py-0.5 text-[10px] font-mono text-white shadow">
                                X:{Math.round(activePreviewGeometry.resolved.x)} Y:{Math.round(activePreviewGeometry.resolved.y)} pt
                              </div>
                            )}

                            {includeStampBadge ? (
                              <div className="relative h-full w-full overflow-hidden">
                                <img
                                  src={activeSignaturePreview.dataUrl}
                                  alt="Draggable signature preview"
                                  draggable={false}
                                  style={{
                                    left: `${(activePreviewGeometry.box.leftPadPt / activePreviewGeometry.box.outerWidthPt) * 100}%`,
                                    top: `${(13 / activePreviewGeometry.box.outerHeightPt) * 100}%`,
                                    width: `${(activePreviewGeometry.box.imgWidthPt / activePreviewGeometry.box.outerWidthPt) * 100}%`,
                                    height: `${(activePreviewGeometry.box.imgHeightPt / activePreviewGeometry.box.outerHeightPt) * 100}%`,
                                  }}
                                  className="absolute object-contain pointer-events-none select-none"
                                />
                                <div
                                  style={{
                                    left: `${(activePreviewGeometry.box.leftPadPt / activePreviewGeometry.box.outerWidthPt) * 100}%`,
                                    right: `${(activePreviewGeometry.box.rightPadPt / activePreviewGeometry.box.outerWidthPt) * 100}%`,
                                    bottom: `${(2 / activePreviewGeometry.box.outerHeightPt) * 100}%`,
                                  }}
                                  className="absolute pointer-events-none leading-tight overflow-hidden"
                                >
                                  <div className="truncate text-[9px] sm:text-[10px] font-bold text-slate-900">
                                    Signed by: {signerName.trim() || 'Verified Signer'}
                                  </div>
                                  <div className="truncate text-[8px] sm:text-[9px] text-slate-600">
                                    Date: {signDate.trim() || new Date().toISOString().split('T')[0]}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <img
                                src={activeSignaturePreview.dataUrl}
                                alt="Draggable signature preview"
                                draggable={false}
                                className="h-full w-full object-contain pointer-events-none select-none"
                              />
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Placement &amp; Details
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(
                  [
                    { id: 'bottom-right', label: 'Bottom Right' },
                    { id: 'bottom-left', label: 'Bottom Left' },
                    { id: 'bottom-center', label: 'Bottom Center' },
                    { id: 'top-right', label: 'Top Right' },
                    { id: 'custom', label: 'Custom' },
                  ] as const
                ).map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectSignPosition(preset.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      signPosition === preset.id
                        ? 'bg-[#0A8CFF] text-white border-[#0A8CFF]'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#0A8CFF]'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Page {pdfPageCount ? `(1 – ${pdfPageCount})` : ''}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={pdfPageCount || 999}
                    value={signPageNumber}
                    onChange={(e) => setSignPageNumber(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Stamp Position
                  </label>
                  <select
                    value={signPosition}
                    onChange={(e) => handleSelectSignPosition(e.target.value as SignPositionPreset)}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
                  >
                    <option value="bottom-right">Bottom Right Corner</option>
                    <option value="bottom-left">Bottom Left Corner</option>
                    <option value="bottom-center">Bottom Center</option>
                    <option value="top-right">Top Right Corner</option>
                    <option value="custom">Custom Coordinates</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Signing Date
                  </label>
                  <input
                    type="text"
                    value={signDate}
                    onChange={(e) => setSignDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-2.5 text-xs bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-slate-100/90 dark:bg-slate-800/50">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    X Coordinate (pt from left)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={signPosition === 'custom' ? signCustomX : Math.round(activePreviewGeometry?.resolved.x ?? signCustomX)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSignPosition('custom');
                      setSignCustomX(Number.isFinite(val) ? Math.max(0, Math.round(val)) : 0);
                    }}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 text-xs bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Y Coordinate (pt from bottom)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={signPosition === 'custom' ? signCustomY : Math.round(activePreviewGeometry?.resolved.y ?? signCustomY)}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSignPosition('custom');
                      setSignCustomY(Number.isFinite(val) ? Math.max(0, Math.round(val)) : 0);
                    }}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 p-2 text-xs bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Signature Scale: {Math.round(signScale * 100)}%
                  </label>
                  <input
                    type="range"
                    min={0.5}
                    max={2}
                    step={0.05}
                    value={signScale}
                    onChange={(e) => setSignScale(Number(e.target.value))}
                    className="w-full mt-2"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="w-full sm:w-auto">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Signer Name on Badge
                  </label>
                  <input
                    type="text"
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full sm:w-56 rounded-xl border border-slate-300 dark:border-slate-700 p-2 text-xs bg-white dark:bg-slate-900"
                  />
                </div>

                <label className="inline-flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer sm:pt-4">
                  <input
                    type="checkbox"
                    checked={includeStampBadge}
                    onChange={(e) => setIncludeStampBadge(e.target.checked)}
                    className="rounded border-slate-300 text-[#0A8CFF]"
                  />
                  <span>Include visual verification stamp border &amp; signer details</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <button
          type="button"
          onClick={processPdf}
          disabled={processing || (files.length === 0 && tool.slug !== 'create-pdf')}
          className="w-full h-12 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Processing File...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Run {tool.name}</span>
            </>
          )}
        </button>

        {outputUrl && extractedImages.length === 0 && (
          <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-slate-900 text-center space-y-3">
            <div className="font-bold text-sm text-slate-900 dark:text-white" data-result="pdf-ready">
              Processing Complete!
            </div>
            <div className="result-value font-mono text-xs text-emerald-700 dark:text-emerald-400">
              Ready: {outputFileName}
            </div>
            {(tool.slug === 'pdf-to-jpg' || tool.slug === 'pdf-to-png') && (
              <div className="mx-auto max-w-sm overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white">
                <img src={outputUrl} alt={outputFileName} className="w-full h-auto" />
              </div>
            )}
            <div className="flex justify-center gap-3">
              <a
                href={outputUrl}
                download={outputFileName}
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download Output ({outputFileName})</span>
              </a>
            </div>
          </div>
        )}

        {extractedImages.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Extracted Embedded Images ({extractedImages.length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {extractedImages.map((img, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5"
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-40 object-contain bg-slate-50 dark:bg-slate-950 rounded-lg"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-500">
                      {img.width} × {img.height} px
                    </span>
                    <a
                      href={img.url}
                      download={img.name}
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-semibold"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {extractedText && (
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Extracted Output Content:
            </label>
            <textarea
              readOnly
              value={extractedText}
              rows={8}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 p-3 text-xs font-mono bg-slate-50 dark:bg-slate-950"
            />
          </div>
        )}
      </div>
    </div>
  );
}
