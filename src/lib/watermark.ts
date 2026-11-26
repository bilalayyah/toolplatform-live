import {SITE_CONFIG, toolHasWatermark} from '../config/site';

/**
 * Draws the ToolPlatform logo-only watermark in the bottom-right corner
 * strictly honoring src/config/site.ts:
 * - Only applies if toolHasWatermark(toolSlug) is true (the Watermark 5)
 * - Bottom-right placement, ~60% opacity, max 15% of image width
 */
export function applyToolPlatformWatermark(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  toolSlug: string,
): boolean {
  if (!SITE_CONFIG.watermark.enabled) return false;
  if (!toolHasWatermark(toolSlug)) return false;
  if (width < 24 || height < 24) return false;

  const maxAllowedByWidth = Math.floor(
    width * (SITE_CONFIG.watermark.maxWidthPercent / 100),
  );
  const maxAllowedByHeight = Math.floor(height * 0.25);
  const size = Math.max(12, Math.min(56, maxAllowedByWidth, maxAllowedByHeight));
  const margin = Math.max(4, Math.min(16, Math.round(size * 0.28)));

  const x = width - size - margin;
  const y = height - size - margin;
  const radius = Math.round(size * 0.24);

  ctx.save();
  ctx.globalAlpha = SITE_CONFIG.watermark.opacity;

  // Rounded square badge (#0A8CFF)
  ctx.fillStyle = SITE_CONFIG.primaryColor;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + size - radius, y);
  ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
  ctx.lineTo(x + size, y + size - radius);
  ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
  ctx.lineTo(x + radius, y + size);
  ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();

  // Logo-only stacked layers glyph inside badge (white)
  const cx = x + size / 2;
  const cy = y + size / 2;
  const r = size * 0.27;
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = Math.max(1.25, size * 0.075);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Top diamond
  ctx.beginPath();
  ctx.moveTo(cx, cy - r * 0.95);
  ctx.lineTo(cx + r, cy - r * 0.35);
  ctx.lineTo(cx, cy + r * 0.25);
  ctx.lineTo(cx - r, cy - r * 0.35);
  ctx.closePath();
  ctx.stroke();

  // Middle chevron
  ctx.beginPath();
  ctx.moveTo(cx - r, cy + r * 0.15);
  ctx.lineTo(cx, cy + r * 0.72);
  ctx.lineTo(cx + r, cy + r * 0.15);
  ctx.stroke();

  // Bottom chevron
  ctx.beginPath();
  ctx.moveTo(cx - r, cy + r * 0.6);
  ctx.lineTo(cx, cy + r * 1.12);
  ctx.lineTo(cx + r, cy + r * 0.6);
  ctx.stroke();

  ctx.restore();
  return true;
}
