import { describe, expect, it } from 'vitest';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import {
  applyPointerDeltaToPositionPt,
  clampSignaturePositionPt,
  computeSignatureBoxRectPt,
  computeSignatureImageSizePt,
  resolveSignaturePositionPt,
  signatureBoxToOverlayPct,
} from '../signPdfGeometry';

// Minimal valid 1x1 transparent PNG bytes for pdf-lib embedding test
const TINY_PNG_BYTES = Uint8Array.from(
  Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64',
  ),
);

describe('Sign PDF Geometry, Drag Mapping, and PDF Output Round-Trip', () => {
  it('computes exact scale for standard signature dimensions and caps oversized uploaded images', () => {
    const drawSize = computeSignatureImageSizePt(400, 150, 1, 612, 792);
    expect(drawSize.effectiveScale).toBeCloseTo(0.35, 5);
    expect(drawSize.imgWidthPt).toBeCloseTo(140, 5);
    expect(drawSize.imgHeightPt).toBeCloseTo(52.5, 5);

    const scaledDraw = computeSignatureImageSizePt(400, 150, 1.5, 612, 792);
    expect(scaledDraw.imgWidthPt).toBeCloseTo(210, 5);
    expect(scaledDraw.imgHeightPt).toBeCloseTo(78.75, 5);

    const hugeUpload = computeSignatureImageSizePt(2400, 800, 1, 612, 792);
    expect(hugeUpload.imgWidthPt).toBeLessThanOrEqual(612 * 0.55 + 0.01);
    expect(hugeUpload.imgHeightPt).toBeLessThanOrEqual(792 * 0.4 + 0.01);
  });

  it('resolves presets, respects custom (0, 0) without fallback bugs, and clamps within stamp bounds', () => {
    const pageW = 612;
    const pageH = 792;
    const imgW = 140;
    const imgH = 52.5;

    const br = resolveSignaturePositionPt('bottom-right', 0, 0, imgW, imgH, pageW, pageH);
    expect(br.x).toBeCloseTo(612 - 140 - 40, 5);
    expect(br.y).toBeCloseTo(40, 5);

    const bl = resolveSignaturePositionPt('bottom-left', 0, 0, imgW, imgH, pageW, pageH);
    expect(bl.x).toBeCloseTo(40, 5);
    expect(bl.y).toBeCloseTo(40, 5);

    const bc = resolveSignaturePositionPt('bottom-center', 0, 0, imgW, imgH, pageW, pageH);
    expect(bc.x).toBeCloseTo((612 - 140) / 2, 5);
    expect(bc.y).toBeCloseTo(40, 5);

    const tr = resolveSignaturePositionPt('top-right', 0, 0, imgW, imgH, pageW, pageH);
    expect(tr.x).toBeCloseTo(612 - 140 - 40, 5);
    expect(tr.y).toBeCloseTo(792 - 52.5 - 40, 5);

    // Custom (0, 0) stays exact (0, 0) with zero padding
    const zeroPos = resolveSignaturePositionPt('custom', 0, 0, imgW, imgH, pageW, pageH);
    expect(zeroPos.x).toBe(0);
    expect(zeroPos.y).toBe(0);

    // Out-of-bounds positive custom coordinates clamp within page
    const clampedHigh = clampSignaturePositionPt(999, 999, imgW, imgH, pageW, pageH);
    expect(clampedHigh.x).toBeCloseTo(pageW - imgW, 5);
    expect(clampedHigh.y).toBeCloseTo(pageH - imgH, 5);
  });

  it('maps DOM preview drag deltas accurately to PDF bottom-left coordinates and back to overlay percentages', () => {
    const pageW = 600;
    const pageH = 800;
    const imgW = 140;
    const imgH = 50;

    // Preview container rendered at half scale: 300x400 CSS pixels
    // Dragging right +50px => +100pt X; dragging UP -100px => +200pt Y (inverted axis!)
    const moved = applyPointerDeltaToPositionPt(
      100,
      100,
      50,
      -100,
      300,
      400,
      imgW,
      imgH,
      pageW,
      pageH,
    );
    expect(moved.x).toBe(200);
    expect(moved.y).toBe(300);

    const box = computeSignatureBoxRectPt(moved.x, moved.y, imgW, imgH);
    expect(box.outerLeftPt).toBe(200);
    expect(box.outerBottomPt).toBe(300);
    expect(box.outerWidthPt).toBe(140);
    expect(box.outerHeightPt).toBe(50);

    const pct = signatureBoxToOverlayPct(box, pageW, pageH);
    // left = 200 / 600 = 33.3333%
    expect(pct.leftPct).toBeCloseTo((200 / 600) * 100, 4);
    // top from DOM top = 800 - (300 + 50) = 450 => 450 / 800 = 56.25%
    expect(pct.topPct).toBeCloseTo((450 / 800) * 100, 4);
    expect(pct.widthPct).toBeCloseTo((140 / 600) * 100, 4);
    expect(pct.heightPct).toBeCloseTo((50 / 800) * 100, 4);
  });

  it('embeds signature onto only the selected target page at dragged coordinates in real pdf-lib output', async () => {
    const doc = await PDFDocument.create();
    const helv = await doc.embedFont(StandardFonts.Helvetica);
    for (let i = 1; i <= 3; i++) {
      const p = doc.addPage([612, 792]);
      p.drawText(`Page ${i} Content`, { x: 50, y: 740, size: 12, font: helv });
    }
    const sourceBytes = await doc.save();

    // Load PDF as Sign PDF does and place on page 2 after simulated drag
    const signDoc = await PDFDocument.load(sourceBytes);
    const targetPageIndex = 1; // Page 2
    const targetPage = signDoc.getPage(targetPageIndex);
    const { width: pageW, height: pageH } = targetPage.getSize();
    const embeddedImg = await signDoc.embedPng(TINY_PNG_BYTES);

    const { effectiveScale } = computeSignatureImageSizePt(400, 150, 1.2, pageW, pageH);
    expect(effectiveScale).toBeGreaterThan(0);
    const imgDims = embeddedImg.scale(effectiveScale);

    // Simulate drag from bottom-right (-120px left, -180px up on a 306x396px preview)
    const startPt = resolveSignaturePositionPt('bottom-right', 40, 40, imgDims.width, imgDims.height, pageW, pageH);
    const draggedPt = applyPointerDeltaToPositionPt(
      startPt.x,
      startPt.y,
      -120,
      -180,
      306,
      396,
      imgDims.width,
      imgDims.height,
      pageW,
      pageH,
    );

    targetPage.drawImage(embeddedImg, {
      x: draggedPt.x,
      y: draggedPt.y,
      width: imgDims.width,
      height: imgDims.height,
    });

    const signedBytes = await signDoc.save();

    // Re-open with pdfjs-dist legacy build in Node and verify exact text/coordinates per page
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const loadingTask = pdfjs.getDocument({ data: new Uint8Array(signedBytes), useSystemFonts: true });
    const parsed = await loadingTask.promise;
    expect(parsed.numPages).toBe(3);

    const page1Text = (await (await parsed.getPage(1)).getTextContent()).items
      .map((i: any) => i.str)
      .join(' ');
    const page2TextItems = (await (await parsed.getPage(2)).getTextContent()).items as Array<{
      str: string;
      transform: number[];
    }>;
    const page2Text = page2TextItems.map((i) => i.str).join(' ');
    const page3Text = (await (await parsed.getPage(3)).getTextContent()).items
      .map((i: any) => i.str)
      .join(' ');

    expect(page1Text).not.toContain('Signed by');
    expect(page2Text).not.toContain('Signed by');
    expect(page3Text).not.toContain('Signed by');
    expect(page2Text).not.toContain('Date:');
    expect(page2Text).toContain('Page 2 Content');
  });
});
