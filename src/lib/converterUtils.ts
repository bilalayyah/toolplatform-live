import type * as XLSXTypes from 'xlsx';

export interface ZipEntry {
  name: string;
  data: Uint8Array;
}

export interface TabularData {
  headers: string[];
  rows: Record<string, string>[];
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

export function baseFileName(fileName: string, fallback = 'converted'): string {
  const cleaned = fileName.trim().replace(/\.[^.]+$/, '');
  return cleaned || fallback;
}

export function detectCsvDelimiter(text: string): ',' | ';' | '\t' {
  const clean = stripBom(text);
  const sampleLines: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < clean.length && sampleLines.length < 5; i++) {
    const ch = clean[i];
    if (ch === '"') {
      if (inQuotes && clean[i + 1] === '"') {
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      current += ch;
    } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
      if (current.trim().length > 0) {
        sampleLines.push(current);
      }
      current = '';
      if (ch === '\r' && clean[i + 1] === '\n') i++;
    } else {
      current += ch;
    }
  }
  if (current.trim().length > 0 && sampleLines.length < 5) {
    sampleLines.push(current);
  }

  const candidates: Array<',' | ';' | '\t'> = [',', ';', '\t'];
  let best: ',' | ';' | '\t' = ',';
  let bestScore = -1;

  for (const delim of candidates) {
    const counts = sampleLines.map((line) => {
      let count = 0;
      let q = false;
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
          if (q && line[i + 1] === '"') i++;
          else q = !q;
        } else if (line[i] === delim && !q) {
          count++;
        }
      }
      return count;
    });

    const total = counts.reduce((a, b) => a + b, 0);
    if (total === 0) continue;
    const min = Math.min(...counts);
    const max = Math.max(...counts);
    const consistencyBonus = min === max && min > 0 ? 10 : 0;
    const score = total + consistencyBonus;
    if (score > bestScore) {
      bestScore = score;
      best = delim;
    }
  }

  return best;
}

/**
 * RFC-4180 compliant CSV parser supporting quoted fields, escaped quotes (""),
 * embedded newlines, and optional custom delimiters.
 */
export function parseCsv(text: string, delimiter = ','): string[][] {
  const clean = stripBom(text);
  if (!clean.trim()) return [];

  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];

    if (inQuotes) {
      if (ch === '"') {
        if (clean[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(field);
      field = '';
    } else if (ch === '\r') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
      if (clean[i + 1] === '\n') i++;
    } else if (ch === '\n') {
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += ch;
    }
  }

  row.push(field);
  if (row.length > 1 || row[0] !== '') {
    rows.push(row);
  }

  // Strip trailing completely empty rows
  while (rows.length > 0 && rows[rows.length - 1].every((cell) => cell === '')) {
    rows.pop();
  }

  return rows;
}

export function serializeCsv(
  rows: Array<Array<string | number | boolean | null | undefined>>,
  delimiter = ',',
): string {
  return rows
    .map((row) =>
      row
        .map((raw) => {
          const val = raw === null || raw === undefined ? '' : String(raw);
          const needsQuote =
            val.includes(delimiter) ||
            val.includes('"') ||
            val.includes('\n') ||
            val.includes('\r') ||
            val.startsWith(' ') ||
            val.endsWith(' ');
          if (!needsQuote) return val;
          return `"${val.replace(/"/g, '""')}"`;
        })
        .join(delimiter),
    )
    .join('\r\n');
}

export function inferPrimitive(raw: string, enabled: boolean): string | number | boolean {
  if (!enabled) return raw;
  const trimmed = raw.trim();
  if (trimmed === '') return '';
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  // Preserve strings with leading zeroes such as ZIP/postal codes ("00412")
  if (/^-?(0|[1-9]\d*)(\.\d+)?$/.test(trimmed)) {
    const num = Number(trimmed);
    if (Number.isSafeInteger(num) || (!Number.isNaN(num) && Math.abs(num) < 1e15)) {
      return num;
    }
  }
  return raw;
}

export function normalizeHeaders(rawHeaders: string[]): string[] {
  const seen = new Map<string, number>();
  return rawHeaders.map((h, idx) => {
    const base = h.trim() || `column_${idx + 1}`;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}_${count + 1}`;
  });
}

export function csvRowsToObjects(
  rows: string[][],
  inferTypes: boolean,
): { headers: string[]; records: Array<Record<string, string | number | boolean>> } {
  if (rows.length === 0) return { headers: [], records: [] };
  const headers = normalizeHeaders(rows[0]);
  const records = rows.slice(1).map((row) => {
    const obj: Record<string, string | number | boolean> = {};
    headers.forEach((key, idx) => {
      obj[key] = inferPrimitive(row[idx] ?? '', inferTypes);
    });
    return obj;
  });
  return { headers, records };
}

export function parseXmlDocument(xmlText: string): Document {
  const clean = stripBom(xmlText).trim();
  if (!clean) {
    throw new Error('XML input is empty.');
  }
  const parser = new DOMParser();
  const doc = parser.parseFromString(clean, 'application/xml');
  const parseError = doc.querySelector('parsererror');
  if (parseError) {
    const detail = (parseError.textContent || 'Invalid XML syntax').trim().split('\n')[0];
    throw new Error(`Invalid XML: ${detail}`);
  }
  if (!doc.documentElement) {
    throw new Error('XML document does not contain a root element.');
  }
  return doc;
}

function elementToJsonValue(el: Element, attrPrefix: string): unknown {
  const obj: Record<string, unknown> = {};
  const hasAttrs = el.attributes.length > 0;
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    obj[`${attrPrefix}${attr.name}`] = attr.value;
  }

  const childElements = Array.from(el.children);
  const directText = Array.from(el.childNodes)
    .filter((n) => n.nodeType === Node.TEXT_NODE || n.nodeType === Node.CDATA_SECTION_NODE)
    .map((n) => n.textContent ?? '')
    .join('')
    .trim();

  if (childElements.length === 0) {
    if (!hasAttrs) {
      return directText;
    }
    if (directText.length > 0) {
      obj['#text'] = directText;
    }
    return obj;
  }

  if (directText.length > 0) {
    obj['#text'] = directText;
  }

  for (const child of childElements) {
    const key = child.tagName;
    const val = elementToJsonValue(child, attrPrefix);
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const existing = obj[key];
      if (Array.isArray(existing)) {
        existing.push(val);
      } else {
        obj[key] = [existing, val];
      }
    } else {
      obj[key] = val;
    }
  }

  return obj;
}

export function xmlToJsonData(xmlText: string, attrPrefix = '@'): Record<string, unknown> {
  const doc = parseXmlDocument(xmlText);
  const root = doc.documentElement;
  return {
    [root.tagName]: elementToJsonValue(root, attrPrefix),
  };
}

function flattenElement(
  el: Element,
  prefix: string,
  out: Record<string, string>,
): void {
  for (let i = 0; i < el.attributes.length; i++) {
    const attr = el.attributes[i];
    const key = prefix ? `${prefix}.@${attr.name}` : `@${attr.name}`;
    out[key] = attr.value;
  }

  const children = Array.from(el.children);
  const textContent = Array.from(el.childNodes)
    .filter((n) => n.nodeType === Node.TEXT_NODE || n.nodeType === Node.CDATA_SECTION_NODE)
    .map((n) => n.textContent ?? '')
    .join('')
    .trim();

  if (children.length === 0) {
    if (prefix) {
      out[prefix] = textContent;
    } else if (textContent || el.attributes.length === 0) {
      out[el.tagName] = textContent;
    }
    return;
  }

  if (textContent) {
    out[prefix ? `${prefix}.#text` : '#text'] = textContent;
  }

  // Group siblings by tagName so repeated child tags become indexed if > 1
  const counts = new Map<string, number>();
  for (const child of children) {
    counts.set(child.tagName, (counts.get(child.tagName) ?? 0) + 1);
  }
  const seen = new Map<string, number>();

  for (const child of children) {
    const total = counts.get(child.tagName) ?? 1;
    const idx = (seen.get(child.tagName) ?? 0) + 1;
    seen.set(child.tagName, idx);
    const segment = total > 1 ? `${child.tagName}[${idx}]` : child.tagName;
    const nextPrefix = prefix ? `${prefix}.${segment}` : segment;
    flattenElement(child, nextPrefix, out);
  }
}

function findRepeatingRecordElements(root: Element): Element[] {
  const direct = Array.from(root.children);
  if (direct.length === 0) return [root];

  const byTag = new Map<string, Element[]>();
  for (const child of direct) {
    const list = byTag.get(child.tagName) ?? [];
    list.push(child);
    byTag.set(child.tagName, list);
  }

  // Prefer dominant repeating direct children
  let bestGroup: Element[] = [];
  for (const group of byTag.values()) {
    if (group.length > bestGroup.length) {
      bestGroup = group;
    }
  }
  if (bestGroup.length >= 2) {
    return bestGroup;
  }

  // If root has a single container child whose children repeat (e.g. <response><items><item/>...</items></response>)
  if (direct.length === 1 && direct[0].children.length >= 2) {
    return findRepeatingRecordElements(direct[0]);
  }

  // If all direct children are leaf nodes with no children of their own, treat root itself as 1 record
  const anyNested = direct.some((el) => el.children.length > 0 || el.attributes.length > 0);
  if (!anyNested) {
    return [root];
  }

  return direct;
}

export function xmlToTabularRows(xmlText: string): TabularData {
  const doc = parseXmlDocument(xmlText);
  const records = findRepeatingRecordElements(doc.documentElement);

  const flatRows: Record<string, string>[] = [];
  const headerOrder: string[] = [];
  const headerSet = new Set<string>();

  for (const recordEl of records) {
    const row: Record<string, string> = {};
    flattenElement(recordEl, '', row);
    for (const key of Object.keys(row)) {
      if (!headerSet.has(key)) {
        headerSet.add(key);
        headerOrder.push(key);
      }
    }
    flatRows.push(row);
  }

  return {
    headers: headerOrder,
    rows: flatRows,
  };
}

export function sanitizeXmlTag(name: string, fallback = 'field'): string {
  const trimmed = name.trim().replace(/[^a-zA-Z0-9_.-]+/g, '_');
  if (!trimmed) return fallback;
  if (!/^[a-zA-Z_]/.test(trimmed)) {
    return `_${trimmed}`;
  }
  return trimmed;
}

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function serializeJsonValueToXml(
  key: string,
  value: unknown,
  itemTag: string,
  depth: number,
  indentSize: number,
): string {
  const pad = indentSize > 0 ? ' '.repeat(depth * indentSize) : '';
  const nl = indentSize > 0 ? '\n' : '';
  const tag = sanitizeXmlTag(key, itemTag);

  if (value === null || value === undefined) {
    return `${pad}<${tag} />${nl}`;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return `${pad}<${tag} />${nl}`;
    if (depth === 0) {
      const inner = value
        .map((item) => serializeJsonValueToXml(itemTag, item, itemTag, depth + 1, indentSize))
        .join('');
      return `${pad}<${tag}>${nl}${inner}${pad}</${tag}>${nl}`;
    }
    return value
      .map((item) => serializeJsonValueToXml(tag, item, itemTag, depth, indentSize))
      .join('');
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return `${pad}<${tag} />${nl}`;

    const attrs: string[] = [];
    const children: Array<[string, unknown]> = [];
    let textNode: string | null = null;

    for (const [k, v] of entries) {
      if (k.startsWith('@') && k.length > 1 && (typeof v !== 'object' || v === null)) {
        const attrName = sanitizeXmlTag(k.slice(1), 'attr');
        attrs.push(`${attrName}="${escapeXml(String(v ?? ''))}"`);
      } else if (k === '#text' && (typeof v !== 'object' || v === null)) {
        textNode = escapeXml(String(v ?? ''));
      } else {
        children.push([k, v]);
      }
    }

    const attrStr = attrs.length > 0 ? ` ${attrs.join(' ')}` : '';
    if (children.length === 0) {
      if (textNode !== null) {
        return `${pad}<${tag}${attrStr}>${textNode}</${tag}>${nl}`;
      }
      return `${pad}<${tag}${attrStr} />${nl}`;
    }

    const inner =
      (textNode !== null ? `${pad}${indentSize > 0 ? ' '.repeat(indentSize) : ''}${textNode}${nl}` : '') +
      children
        .map(([ck, cv]) => serializeJsonValueToXml(ck, cv, itemTag, depth + 1, indentSize))
        .join('');
    return `${pad}<${tag}${attrStr}>${nl}${inner}${pad}</${tag}>${nl}`;
  }

  return `${pad}<${tag}>${escapeXml(String(value))}</${tag}>${nl}`;
}

export function jsonToXmlString(
  jsonText: string,
  rootTag = 'root',
  itemTag = 'item',
  pretty = true,
): string {
  const clean = stripBom(jsonText).trim();
  if (!clean) {
    throw new Error('JSON input is empty.');
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(clean);
  } catch (err) {
    throw new Error(
      `Invalid JSON syntax: ${err instanceof Error ? err.message : 'Unable to parse JSON.'}`,
    );
  }

  const safeRoot = sanitizeXmlTag(rootTag, 'root');
  const safeItem = sanitizeXmlTag(itemTag, 'item');
  const indentSize = pretty ? 2 : 0;

  let body: string;
  if (
    parsed !== null &&
    typeof parsed === 'object' &&
    !Array.isArray(parsed) &&
    Object.keys(parsed as Record<string, unknown>).length === 1 &&
    rootTag === 'root'
  ) {
    const [[onlyKey, onlyVal]] = Object.entries(parsed as Record<string, unknown>);
    body = serializeJsonValueToXml(onlyKey, onlyVal, safeItem, 0, indentSize);
  } else {
    body = serializeJsonValueToXml(safeRoot, parsed, safeItem, 0, indentSize);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n${body.trimEnd()}\n`;
}

export function rowsToXmlString(
  headers: string[],
  rows: Array<Record<string, unknown>>,
  rootTag = 'records',
  rowTag = 'record',
): string {
  const safeRoot = sanitizeXmlTag(rootTag, 'records');
  const safeRow = sanitizeXmlTag(rowTag, 'record');
  const safeCols = normalizeHeaders(headers).map((h) => ({
    rawKey: h,
    xmlTag: sanitizeXmlTag(h, 'column'),
  }));

  const lines: string[] = ['<?xml version="1.0" encoding="UTF-8"?>', `<${safeRoot}>`];
  for (const row of rows) {
    lines.push(`  <${safeRow}>`);
    for (const col of safeCols) {
      const val = row[col.rawKey];
      const text = val === null || val === undefined ? '' : String(val);
      lines.push(`    <${col.xmlTag}>${escapeXml(text)}</${col.xmlTag}>`);
    }
    lines.push(`  </${safeRow}>`);
  }
  lines.push(`</${safeRoot}>`);
  return lines.join('\n') + '\n';
}

// Pure-TypeScript STORE (uncompressed) ZIP archive builder with standard CRC32
const CRC32_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) !== 0 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc = CRC32_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function createZipBlob(entries: ZipEntry[]): Blob {
  const encoder = new TextEncoder();
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.name);
    const data = entry.data;
    const crc = crc32(data);

    // Local file header (30 bytes + name)
    const localHeader = new ArrayBuffer(30 + nameBytes.length);
    const lv = new DataView(localHeader);
    lv.setUint32(0, 0x04034b50, true); // Local file header signature
    lv.setUint16(4, 20, true); // Version needed
    lv.setUint16(6, 0x0800, true); // UTF-8 filename flag
    lv.setUint16(8, 0, true); // Compression method 0 (STORE)
    lv.setUint16(10, 0, true); // Mod time
    lv.setUint16(12, 0x5421, true); // Mod date
    lv.setUint32(14, crc, true);
    lv.setUint32(18, data.length, true);
    lv.setUint32(22, data.length, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    new Uint8Array(localHeader, 30).set(nameBytes);

    const localU8 = new Uint8Array(localHeader);
    localParts.push(localU8, data);

    // Central directory header (46 bytes + name)
    const centralHeader = new ArrayBuffer(46 + nameBytes.length);
    const cv = new DataView(centralHeader);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0x5421, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, data.length, true);
    cv.setUint32(24, data.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    new Uint8Array(centralHeader, 46).set(nameBytes);

    centralParts.push(new Uint8Array(centralHeader));
    offset += localU8.length + data.length;
  }

  const centralSize = centralParts.reduce((sum, p) => sum + p.length, 0);
  const eocd = new ArrayBuffer(22);
  const ev = new DataView(eocd);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  const totalSize = offset + centralSize + 22;
  const archive = new Uint8Array(new ArrayBuffer(totalSize));
  let pos = 0;
  for (const part of localParts) {
    archive.set(part, pos);
    pos += part.length;
  }
  for (const part of centralParts) {
    archive.set(part, pos);
    pos += part.length;
  }
  archive.set(new Uint8Array(eocd), pos);

  return new Blob([archive], { type: 'application/zip' });
}

export const SAMPLE_CSV_TEXT = `OrderID,Customer,Region,Units,TotalUSD,Paid
ORD-1001,"Acme, Inc.",North,12,1440.00,true
ORD-1002,Beacon Labs,West,5,625.50,true
ORD-1003,Crest Retail,North,18,2160.00,false
ORD-1004,Delta Logistics,South,9,1080.00,true
ORD-1005,Evergreen Co,West,14,1680.00,true
ORD-1006,Frontier Studio,South,7,840.00,false
`;

export const SAMPLE_JSON_TEXT = `{
  "catalog": {
    "updated": "2026-04-12",
    "currency": "USD",
    "products": [
      {
        "sku": "TP-101",
        "name": "Wireless Keypad",
        "category": "Accessories",
        "price": 49.99,
        "inStock": true
      },
      {
        "sku": "TP-102",
        "name": "USB-C Dock",
        "category": "Hardware",
        "price": 129.0,
        "inStock": true
      },
      {
        "sku": "TP-103",
        "name": "Desk Mat XL",
        "category": "Workspace",
        "price": 24.5,
        "inStock": false
      }
    ]
  }
}
`;

export const SAMPLE_XML_TEXT = `<?xml version="1.0" encoding="UTF-8"?>
<orders currency="USD">
  <order id="ORD-1001" status="shipped">
    <customer>Acme, Inc.</customer>
    <region>North</region>
    <units>12</units>
    <total>1440.00</total>
  </order>
  <order id="ORD-1002" status="shipped">
    <customer>Beacon Labs</customer>
    <region>West</region>
    <units>5</units>
    <total>625.50</total>
  </order>
  <order id="ORD-1003" status="pending">
    <customer>Crest Retail</customer>
    <region>North</region>
    <units>18</units>
    <total>2160.00</total>
  </order>
  <order id="ORD-1004" status="shipped">
    <customer>Delta Logistics</customer>
    <region>South</region>
    <units>9</units>
    <total>1080.00</total>
  </order>
</orders>
`;

export function createSampleCsvFile(): File {
  return new File([SAMPLE_CSV_TEXT], 'orders-sample.csv', { type: 'text/csv;charset=utf-8' });
}

export function createSampleJsonFile(): File {
  return new File([SAMPLE_JSON_TEXT], 'catalog-sample.json', {
    type: 'application/json;charset=utf-8',
  });
}

export function createSampleXmlFile(): File {
  return new File([SAMPLE_XML_TEXT], 'orders-sample.xml', {
    type: 'application/xml;charset=utf-8',
  });
}

export async function createSampleExcelFile(): Promise<File> {
  const XLSX: typeof XLSXTypes = await import('xlsx');
  const wb = XLSX.utils.book_new();

  const salesSheet = XLSX.utils.aoa_to_sheet([
    ['OrderID', 'Customer', 'Region', 'Units', 'TotalUSD', 'Status'],
    ['ORD-1001', 'Acme, Inc.', 'North', 12, 1440.0, 'Shipped'],
    ['ORD-1002', 'Beacon Labs', 'West', 5, 625.5, 'Shipped'],
    ['ORD-1003', 'Crest Retail', 'North', 18, 2160.0, 'Pending'],
    ['ORD-1004', 'Delta Logistics', 'South', 9, 1080.0, 'Shipped'],
    ['ORD-1005', 'Evergreen Co', 'West', 14, 1680.0, 'Shipped'],
    ['ORD-1006', 'Frontier Studio', 'South', 7, 840.0, 'Pending'],
  ]);

  const inventorySheet = XLSX.utils.aoa_to_sheet([
    ['SKU', 'Item', 'Warehouse', 'Stock'],
    ['TP-101', 'Wireless Keypad', 'East Hub', 48],
    ['TP-102', 'USB-C Dock', 'West Hub', 19],
    ['TP-103', 'Desk Mat XL', 'Central', 120],
  ]);

  XLSX.utils.book_append_sheet(wb, salesSheet, 'Sales');
  XLSX.utils.book_append_sheet(wb, inventorySheet, 'Inventory');

  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' }) as ArrayBuffer;
  return new File([new Uint8Array(out)], 'sales-sample.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
}
