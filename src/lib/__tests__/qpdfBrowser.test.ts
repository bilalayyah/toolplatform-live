import { describe, it, expect } from 'vitest';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { protectPdfBrowser, unlockPdfBrowser, inspectPdfBrowser } from '../qpdfProcessor';

describe('Phase 3: Browser-Side qpdf-wasm Wrapper Tests', () => {
  it('protects and unlocks a PDF in a complete round-trip entirely browser-side', async () => {
    // 1. Create a sample 2-page PDF
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    for (let i = 1; i <= 2; i++) {
      const page = pdfDoc.addPage([400, 300]);
      page.drawText(`Browser QPDF Test Page ${i}`, { x: 40, y: 150, size: 14, font });
    }
    const originalBytes = await pdfDoc.save();

    // 2. Protect with user password 'TestPass123!'
    const protectedResult = await protectPdfBrowser(
      originalBytes,
      'TestPass123!',
      'OwnerMaster999!',
      { print: 'full', modify: 'none', extract: false, annotate: false }
    );

    expect(protectedResult.bytes).toBeDefined();
    expect(protectedResult.bytes.length).toBeGreaterThan(0);
    expect(protectedResult.pageCount).toBe(2);

    // 3. Inspect protected PDF to confirm password is required
    const inspection = await inspectPdfBrowser(protectedResult.bytes);
    expect(inspection.needsPassword).toBe(true);

    // 4. Attempt unlock with wrong password should fail
    await expect(
      unlockPdfBrowser(protectedResult.bytes, 'WrongPass999!')
    ).rejects.toThrow();

    // 5. Unlock with correct password 'TestPass123!'
    const unlockedResult = await unlockPdfBrowser(protectedResult.bytes, 'TestPass123!');
    expect(unlockedResult.bytes).toBeDefined();
    expect(unlockedResult.bytes.length).toBeGreaterThan(0);
    expect(unlockedResult.pageCount).toBe(2);

    // 6. Verify unlocked PDF loads successfully with pdf-lib
    const verifiedDoc = await PDFDocument.load(unlockedResult.bytes);
    expect(verifiedDoc.getPageCount()).toBe(2);
  });
});
