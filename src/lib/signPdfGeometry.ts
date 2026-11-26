export type SignPositionPreset =
  | 'bottom-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'top-right'
  | 'custom';

export interface SignatureImageSizePt {
  imgWidthPt: number;
  imgHeightPt: number;
  effectiveScale: number;
}

export interface SignatureBoxRectPt {
  x: number;
  y: number;
  imgWidthPt: number;
  imgHeightPt: number;
  outerLeftPt: number;
  outerBottomPt: number;
  outerWidthPt: number;
  outerHeightPt: number;
  leftPadPt: number;
  rightPadPt: number;
  bottomPadPt: number;
  topPadPt: number;
}

export interface SignatureOverlayPct {
  leftPct: number;
  topPct: number;
  widthPct: number;
  heightPct: number;
}

export function computeSignatureImageSizePt(
  naturalWidth: number,
  naturalHeight: number,
  scaleVal: number,
  pageWidth: number,
  pageHeight: number,
): SignatureImageSizePt {
  const safeW = Math.max(1, Number.isFinite(naturalWidth) ? naturalWidth : 400);
  const safeH = Math.max(1, Number.isFinite(naturalHeight) ? naturalHeight : 150);
  const safePageW = Math.max(72, Number.isFinite(pageWidth) ? pageWidth : 612);
  const safePageH = Math.max(72, Number.isFinite(pageHeight) ? pageHeight : 792);
  const safeScale =
    Number.isFinite(scaleVal) && scaleVal > 0 ? Math.min(2.5, Math.max(0.3, scaleVal)) : 1;

  const baseMaxW = safePageW * 0.55;
  const baseMaxH = safePageH * 0.4;
  let baseFactor = 0.35;
  if (safeW * baseFactor > baseMaxW) {
    baseFactor = baseMaxW / safeW;
  }
  if (safeH * baseFactor > baseMaxH) {
    baseFactor = Math.min(baseFactor, baseMaxH / safeH);
  }

  const effectiveScale = baseFactor * safeScale;
  return {
    imgWidthPt: safeW * effectiveScale,
    imgHeightPt: safeH * effectiveScale,
    effectiveScale,
  };
}

export function getSignatureBoundsPt(
  imgWidthPt: number,
  imgHeightPt: number,
  pageWidth: number,
  pageHeight: number,
  includeStampBadge: boolean,
): { minX: number; maxX: number; minY: number; maxY: number } {
  const leftPad = includeStampBadge ? 10 : 0;
  const rightPad = includeStampBadge ? 10 : 0;
  const bottomPad = includeStampBadge ? 12 : 0;
  const topPad = includeStampBadge ? 28 : 0;

  const minX = leftPad;
  const maxX = Math.max(minX, pageWidth - imgWidthPt - rightPad);
  const minY = bottomPad;
  const maxY = Math.max(minY, pageHeight - imgHeightPt - topPad);

  return { minX, maxX, minY, maxY };
}

export function clampSignaturePositionPt(
  x: number,
  y: number,
  imgWidthPt: number,
  imgHeightPt: number,
  pageWidth: number,
  pageHeight: number,
  includeStampBadge: boolean,
): { x: number; y: number } {
  const { minX, maxX, minY, maxY } = getSignatureBoundsPt(
    imgWidthPt,
    imgHeightPt,
    pageWidth,
    pageHeight,
    includeStampBadge,
  );
  const safeX = Number.isFinite(x) ? x : minX;
  const safeY = Number.isFinite(y) ? y : minY;
  return {
    x: Math.min(maxX, Math.max(minX, safeX)),
    y: Math.min(maxY, Math.max(minY, safeY)),
  };
}

export function resolveSignaturePositionPt(
  position: SignPositionPreset,
  customX: number,
  customY: number,
  imgWidthPt: number,
  imgHeightPt: number,
  pageWidth: number,
  pageHeight: number,
  includeStampBadge: boolean,
): { x: number; y: number } {
  let rawX = pageWidth - imgWidthPt - 40;
  let rawY = 40;

  if (position === 'bottom-left') {
    rawX = 40;
    rawY = 40;
  } else if (position === 'bottom-center') {
    rawX = (pageWidth - imgWidthPt) / 2;
    rawY = 40;
  } else if (position === 'top-right') {
    rawX = pageWidth - imgWidthPt - 40;
    rawY = pageHeight - imgHeightPt - 40;
  } else if (position === 'custom') {
    rawX = Number.isFinite(customX) ? customX : 40;
    rawY = Number.isFinite(customY) ? customY : 40;
  }

  return clampSignaturePositionPt(
    rawX,
    rawY,
    imgWidthPt,
    imgHeightPt,
    pageWidth,
    pageHeight,
    includeStampBadge,
  );
}

export function computeSignatureBoxRectPt(
  x: number,
  y: number,
  imgWidthPt: number,
  imgHeightPt: number,
  includeStampBadge: boolean,
): SignatureBoxRectPt {
  const leftPadPt = includeStampBadge ? 10 : 0;
  const rightPadPt = includeStampBadge ? 10 : 0;
  const bottomPadPt = includeStampBadge ? 12 : 0;
  const topPadPt = includeStampBadge ? 28 : 0;

  return {
    x,
    y,
    imgWidthPt,
    imgHeightPt,
    outerLeftPt: x - leftPadPt,
    outerBottomPt: y - bottomPadPt,
    outerWidthPt: imgWidthPt + leftPadPt + rightPadPt,
    outerHeightPt: imgHeightPt + bottomPadPt + topPadPt,
    leftPadPt,
    rightPadPt,
    bottomPadPt,
    topPadPt,
  };
}

export function signatureBoxToOverlayPct(
  box: SignatureBoxRectPt,
  pageWidth: number,
  pageHeight: number,
): SignatureOverlayPct {
  const safePageW = Math.max(1, pageWidth);
  const safePageH = Math.max(1, pageHeight);
  const outerTopFromPdfBottomPt = box.outerBottomPt + box.outerHeightPt;
  const outerTopFromDomTopPt = safePageH - outerTopFromPdfBottomPt;

  return {
    leftPct: (box.outerLeftPt / safePageW) * 100,
    topPct: (outerTopFromDomTopPt / safePageH) * 100,
    widthPct: (box.outerWidthPt / safePageW) * 100,
    heightPct: (box.outerHeightPt / safePageH) * 100,
  };
}

export function applyPointerDeltaToPositionPt(
  startXPt: number,
  startYPt: number,
  dxPx: number,
  dyPx: number,
  previewWidthPx: number,
  previewHeightPx: number,
  imgWidthPt: number,
  imgHeightPt: number,
  pageWidth: number,
  pageHeight: number,
  includeStampBadge: boolean,
): { x: number; y: number } {
  const safePreviewW = Math.max(1, previewWidthPx);
  const safePreviewH = Math.max(1, previewHeightPx);
  const dxPt = dxPx * (pageWidth / safePreviewW);
  const dyPt = -dyPx * (pageHeight / safePreviewH);
  const clamped = clampSignaturePositionPt(
    startXPt + dxPt,
    startYPt + dyPt,
    imgWidthPt,
    imgHeightPt,
    pageWidth,
    pageHeight,
    includeStampBadge,
  );
  return {
    x: Math.round(clamped.x),
    y: Math.round(clamped.y),
  };
}

export function renderTypedSignatureDataUrl(
  text: string,
  style: 'cursive' | 'brush' | 'formal',
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 440;
  canvas.height = 140;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable.');
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0F172A';
  if (style === 'brush') {
    ctx.font = 'italic bold 44px "Brush Script MT", cursive, serif';
  } else if (style === 'formal') {
    ctx.font = 'italic 38px "Georgia", "Times New Roman", serif';
  } else {
    ctx.font = 'italic 46px "Caveat", "Dancing Script", "Segoe Script", cursive';
  }
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.trim(), 220, 65);
  ctx.strokeStyle = '#0A8CFF';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(50, 105);
  ctx.bezierCurveTo(160, 120, 280, 92, 390, 108);
  ctx.stroke();
  return canvas.toDataURL('image/png');
}
