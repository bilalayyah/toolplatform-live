export type LongDescriptionBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'list'; items: string[] };

export function parseLongDescription(text: string): LongDescriptionBlock[] {
  const trimmedInput = text.trim();
  if (!trimmedInput) {
    return [];
  }

  const rawBlocks = trimmedInput
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);

  const result: LongDescriptionBlock[] = [];

  for (const rawBlock of rawBlocks) {
    const lines = rawBlock
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (lines.length === 0) continue;

    if (lines.length === 1 && /^###(?:\s+|$)/.test(lines[0])) {
      const headingText = lines[0].replace(/^###\s*/, '').trim();
      if (headingText) {
        result.push({ type: 'heading', text: headingText });
      }
      continue;
    }

    if (lines.every((line) => /^-\s+/.test(line))) {
      const items = lines
        .map((line) => line.replace(/^-\s+/, '').trim())
        .filter((item) => item.length > 0);
      if (items.length > 0) {
        result.push({ type: 'list', items });
      }
      continue;
    }

    result.push({
      type: 'paragraph',
      text: lines.join(' ').trim(),
    });
  }

  return result;
}
