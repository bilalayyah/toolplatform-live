import { describe, expect, it } from 'vitest';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
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

    const br = resolveSignaturePositionPt('bottom-right', 0, 0, imgW, imgH, pageW, pageH, true);
    expect(br.x).toBeCloseTo(612 - 140 - 40, 5);
    expect(br.y).toBeCloseTo(40, 5);

    const bl = resolveSignaturePositionPt('bottom-left', 0, 0, imgW, imgH, pageW, pageH, true);
    expect(bl.x).toBeCloseTo(40, 5);
    expect(bl.y).toBeCloseTo(40, 5);

    const bc = resolveSignaturePositionPt('bottom-center', 0, 0, imgW, imgH, pageW, pageH, true);
    expect(bc.x).toBeCloseTo((612 - 140) / 2, 5);
    expect(bc.y).toBeCloseTo(40, 5);

    const tr = resolveSignaturePositionPt('top-right', 0, 0, imgW, imgH, pageW, pageH, true);
    expect(tr.x).toBeCloseTo(612 - 140 - 40, 5);
    expect(tr.y).toBeCloseTo(792 - 52.5 - 40, 5);

    // Custom (0, 0) with badge clamps cleanly to minimum badge margin (x=10, y=12), NOT 40
    const zeroWithBadge = resolveSignaturePositionPt('custom', 0, 0, imgW, imgH, pageW, pageH, true);
    expect(zeroWithBadge.x).toBe(10);
    expect(zeroWithBadge.y).toBe(12);

    // Custom (0, 0) without badge stays exact (0, 0)
    const zeroNoBadge = resolveSignaturePositionPt('custom', 0, 0, imgW, imgH, pageW, pageH, false);
    expect(zeroNoBadge.x).toBe(0);
    expect(zeroNoBadge.y).toBe(0);

    // Out-of-bounds positive custom coordinates clamp within page
    const clampedHigh = clampSignaturePositionPt(999, 999, imgW, imgH, pageW, pageH, true);
    expect(clampedHigh.x).toBeCloseTo(pageW - imgW - 10, 5);
    expect(clampedHigh.y).toBeCloseTo(pageH - imgH - 28, 5);
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
      true,
    );
    expect(moved.x).toBe(200);
    expect(moved.y).toBe(300);

    const box = computeSignatureBoxRectPt(moved.x, moved.y, imgW, imgH, true);
    expect(box.outerLeftPt).toBe(190);
    expect(box.outerBottomPt).toBe(288);
    expect(box.outerWidthPt).toBe(160);
    expect(box.outerHeightPt).toBe(90);

    const pct = signatureBoxToOverlayPct(box, pageW, pageH);
    // left = 190 / 600 = 31.6667%
    expect(pct.leftPct).toBeCloseTo((190 / 600) * 100, 4);
    // top from DOM top = 800 - (288 + 90) = 422 => 422 / 800 = 52.75%
    expect(pct.topPct).toBeCloseTo((422 / 800) * 100, 4);
    expect(pct.widthPct).toBeCloseTo((160 / 600) * 100, 4);
    expect(pct.heightPct).toBeCloseTo((90 / 800) * 100, 4);
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
    const startPt = resolveSignaturePositionPt('bottom-right', 40, 40, imgDims.width, imgDims.height, pageW, pageH, true);
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
      true,
    );

    const font = await signDoc.embedFont(StandardFonts.HelveticaBold);
    const regFont = await signDoc.embedFont(StandardFonts.Helvetica);

    targetPage.drawRectangle({
      x: draggedPt.x - 10,
      y: draggedPt.y - 12,
      width: imgDims.width + 20,
      height: imgDims.height + 40,
      color: rgb(0.97, 0.98, 1),
      borderColor: rgb(0.04, 0.55, 1),
      borderWidth: 1,
    });
    targetPage.drawImage(embeddedImg, {
      x: draggedPt.x,
      y: draggedPt.y + 15,
      width: imgDims.width,
      height: imgDims.height,
    });
    targetPage.drawText('Signed by: Alice Tester', {
      x: draggedPt.x,
      y: draggedPt.y + 3,
      size: 8,
      font,
      color: rgb(0.06, 0.09, 0.16),
    });
    targetPage.drawText('Date: 2026-11-26', {
      x: draggedPt.x,
      y: draggedPt.y - 7,
      size: 7,
      font: regFont,
      color: rgb(0.3, 0.35, 0.45),
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

    expect(page1Text).not.toContain('Signed by: Alice Tester');
    expect(page3Text).not.toContain('Signed by: Alice Tester');
    expect(page2Text).toContain('Signed by: Alice Tester');
    expect(page2Text).toContain('Date: 2026-11-26');

    const signedByItem = page2TextItems.find((i) => i.str.includes('Signed by: Alice Tester'));
    expect(signedByItem).toBeDefined();
    // PDF text transform [4]=x, [5]=y
    expect(signedByItem!.transform[4]).toBeCloseTo(draggedPt.x, 1);
    expect(signedByItem!.transform[5]).toBeCloseTo(draggedPt.y + 3, 1);
  });
});
