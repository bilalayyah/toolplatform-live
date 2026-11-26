import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import type * as XLSXTypes from 'xlsx';
import {
  AlertCircle,
  Check,
  Copy,
  Download,
  FileArchive,
  FileCode2,
  FileSpreadsheet,
  FolderOpen,
  Loader2,
  Sparkles,
  Trash2,
} from 'lucide-react';
import type {Tool} from '../../data/tools';
import {
  baseFileName,
  createSampleCsvFile,
  createSampleExcelFile,
  createSampleJsonFile,
  createSampleXmlFile,
  createZipBlob,
  csvRowsToObjects,
  detectCsvDelimiter,
  formatBytes,
  inferPrimitive,
  jsonToXmlString,
  normalizeHeaders,
  parseCsv,
  rowsToXmlString,
  serializeCsv,
  stripBom,
  xmlToJsonData,
  xmlToTabularRows,
} from '../../lib/converterUtils';

interface Props {
  tool: Tool;
}

type SplitExcelMode = 'sheet' | 'rows' | 'column';
type DelimiterChoice = 'auto' | ',' | ';' | '\t';

interface ParsedSheet {
  name: string;
  aoa: string[][];
}

interface GeneratedPart {
  name: string;
  size: number;
  url: string;
  data: Uint8Array<ArrayBuffer>;
  detail: string;
  previewText?: string;
}

interface ConversionResult {
  kind: 'single' | 'multi';
  parts: GeneratedPart[];
  zipUrl?: string;
  zipName?: string;
  zipSize?: number;
  outputSize: number;
  previewKind: 'table' | 'code' | 'parts';
  previewHeaders?: string[];
  previewRows?: string[][];
  previewCode?: string;
  summaryText: string;
}

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB for the 11 data converters

const TEXT_INPUT_SLUGS = new Set([
  'csv-to-excel',
  'split-csv',
  'csv-to-json',
  'csv-to-xml',
  'json-to-xml',
  'xml-to-excel',
  'xml-to-csv',
  'xml-to-json',
]);

const EXCEL_INPUT_SLUGS = new Set(['split-excel', 'excel-to-csv', 'excel-to-xml']);
const CSV_INPUT_SLUGS = new Set(['csv-to-excel', 'split-csv', 'csv-to-json', 'csv-to-xml']);
const XML_INPUT_SLUGS = new Set(['xml-to-excel', 'xml-to-csv', 'xml-to-json']);

function getAcceptAttr(tool: Tool): string {
  const exts = (tool.acceptedFormats || []).map((f) => `.${f.toLowerCase()}`);
  return exts.join(',');
}

function getInputCategoryLabel(slug: string): string {
  if (EXCEL_INPUT_SLUGS.has(slug)) return 'Excel (.xlsx, .xls)';
  if (CSV_INPUT_SLUGS.has(slug)) return 'CSV (.csv)';
  if (XML_INPUT_SLUGS.has(slug)) return 'XML (.xml)';
  return 'JSON (.json)';
}

function sanitizeSheetFilePart(name: string): string {
  return name.trim().replace(/[^a-zA-Z0-9_-]+/g, '_').replace(/^_+|_+$/g, '') || 'part';
}

export function ConverterToolsRunner({tool}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createdUrlsRef = useRef<string[]>([]);

  const [inputMode, setInputMode] = useState<'file' | 'paste'>('file');
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceName, setSourceName] = useState<string>('');
  const [inputBytes, setInputBytes] = useState<number>(0);
  const [textInput, setTextInput] = useState<string>('');

  // Excel parsed state
  const [sheets, setSheets] = useState<ParsedSheet[]>([]);
  const [selectedSheetIndex, setSelectedSheetIndex] = useState<number>(0);

  // Tool-specific options
  const [delimiterChoice, setDelimiterChoice] = useState<DelimiterChoice>('auto');
  const [excelCsvDelimiter, setExcelCsvDelimiter] = useState<',' | ';' | '\t'>(',');
  const [inferTypes, setInferTypes] = useState<boolean>(true);
  const [prettyPrint, setPrettyPrint] = useState<boolean>(true);
  const [rootTag, setRootTag] = useState<string>(
    tool.slug === 'json-to-xml' ? 'root' : 'records',
  );
  const [rowTag, setRowTag] = useState<string>(tool.slug === 'json-to-xml' ? 'item' : 'record');
  const [attrPrefix, setAttrPrefix] = useState<string>('@');
  const [rowsPerSplit, setRowsPerSplit] = useState<number>(2);
  const [keepHeader, setKeepHeader] = useState<boolean>(true);
  const [splitExcelMode, setSplitExcelMode] = useState<SplitExcelMode>('sheet');
  const [splitColumnIndex, setSplitColumnIndex] = useState<number>(0);

  const [loadingSample, setLoadingSample] = useState<boolean>(false);
  const [converting, setConverting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [conversion, setConversion] = useState<ConversionResult | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const isTextBased = TEXT_INPUT_SLUGS.has(tool.slug);
  const isExcelInput = EXCEL_INPUT_SLUGS.has(tool.slug);
  const isCsvInput = CSV_INPUT_SLUGS.has(tool.slug);
  const isXmlInput = XML_INPUT_SLUGS.has(tool.slug);
  const isJsonInput = tool.slug === 'json-to-xml';

  const revokeGeneratedUrls = useCallback(() => {
    for (const url of createdUrlsRef.current) {
      URL.revokeObjectURL(url);
    }
    createdUrlsRef.current = [];
  }, []);

  // Reset state cleanly when tool changes
  useEffect(() => {
    revokeGeneratedUrls();
    setSourceFile(null);
    setSourceName('');
    setInputBytes(0);
    setTextInput('');
    setSheets([]);
    setSelectedSheetIndex(0);
    setDelimiterChoice('auto');
    setExcelCsvDelimiter(',');
    setInferTypes(true);
    setPrettyPrint(true);
    setRootTag(tool.slug === 'json-to-xml' ? 'root' : 'records');
    setRowTag(tool.slug === 'json-to-xml' ? 'item' : 'record');
    setAttrPrefix('@');
    setRowsPerSplit(2);
    setKeepHeader(true);
    setSplitExcelMode('sheet');
    setSplitColumnIndex(0);
    setErrorMessage(null);
    setConversion(null);
    setInputMode('file');
  }, [tool.slug, revokeGeneratedUrls]);

  useEffect(() => {
    return () => {
      revokeGeneratedUrls();
    };
  }, [revokeGeneratedUrls]);

  const registerBlobUrl = useCallback((blob: Blob): string => {
    const url = URL.createObjectURL(blob);
    createdUrlsRef.current.push(url);
    return url;
  }, []);

  const loadSelectedFile = useCallback(
    async (file: File) => {
      setErrorMessage(null);
      const maxMB = tool.maxFileSizeMB ?? 10;
      const maxBytes = maxMB * 1024 * 1024;
      if (file.size > maxBytes) {
        setErrorMessage(
          `File "${file.name}" is ${formatBytes(file.size)}, which exceeds the ${maxMB} MB limit for ${tool.name}.`,
        );
        return;
      }

      const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
      const allowed = (tool.acceptedFormats || []).map((f) => f.toLowerCase());
      if (allowed.length > 0 && ext && !allowed.includes(ext)) {
        setErrorMessage(
          `Unsupported format ".${ext}". Please select a ${tool.acceptedFormats?.join(' or ')} file.`,
        );
        return;
      }

      setSourceFile(file);
      setSourceName(file.name);
      setInputBytes(file.size);

      if (isExcelInput) {
        try {
          const XLSX: typeof XLSXTypes = await import('xlsx');
          const buf = await file.arrayBuffer();
          const wb = XLSX.read(new Uint8Array(buf), {type: 'array'});
          if (!wb.SheetNames.length) {
            throw new Error('This workbook contains no worksheets.');
          }
          const parsedSheets: ParsedSheet[] = wb.SheetNames.map((name) => {
            const ws = wb.Sheets[name];
            const aoa = XLSX.utils.sheet_to_json<unknown[]>(ws, {
              header: 1,
              defval: '',
              raw: false,
            });
            const normalized = aoa.map((row) =>
              Array.isArray(row) ? row.map((cell) => (cell == null ? '' : String(cell))) : [],
            );
            return {name, aoa: normalized};
          });
          setSheets(parsedSheets);
          setSelectedSheetIndex(0);
          setSplitColumnIndex(0);
        } catch (err) {
          setSheets([]);
          setErrorMessage(
            err instanceof Error ? err.message : 'Unable to read this Excel workbook.',
          );
        }
      } else {
        try {
          const text = stripBom(await file.text());
          setTextInput(text);
          setSheets([]);
        } catch {
          setErrorMessage('Could not read the selected text file.');
        }
      }
    },
    [tool, isExcelInput],
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await loadSelectedFile(file);
    }
    e.target.value = '';
  };

  const handleLoadSample = async () => {
    setLoadingSample(true);
    setErrorMessage(null);
    try {
      let sampleFile: File;
      if (isExcelInput) {
        sampleFile = await createSampleExcelFile();
      } else if (isCsvInput) {
        sampleFile = createSampleCsvFile();
      } else if (isXmlInput) {
        sampleFile = createSampleXmlFile();
      } else {
        sampleFile = createSampleJsonFile();
      }
      await loadSelectedFile(sampleFile);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to create sample file.');
    } finally {
      setLoadingSample(false);
    }
  };

  const handlePasteChange = (nextText: string) => {
    const byteLength = new TextEncoder().encode(nextText).length;
    if (byteLength > MAX_FILE_BYTES) {
      setErrorMessage(
        `Pasted content (${formatBytes(byteLength)}) exceeds the 10 MB limit for ${tool.name}.`,
      );
      return;
    }
    setErrorMessage(null);
    setSourceFile(null);
    if (!sourceName || sourceFile) {
      const ext = isCsvInput ? 'csv' : isXmlInput ? 'xml' : 'json';
      setSourceName(`pasted-data.${ext}`);
    }
    setTextInput(nextText);
    setInputBytes(byteLength);
  };

  const handleClearInput = () => {
    revokeGeneratedUrls();
    setSourceFile(null);
    setSourceName('');
    setInputBytes(0);
    setTextInput('');
    setSheets([]);
    setSelectedSheetIndex(0);
    setConversion(null);
    setErrorMessage(null);
  };

  // Parsed Input Preview memo
  const parsedInputPreview = useMemo(() => {
    if (isExcelInput) {
      if (sheets.length === 0) return null;
      const activeSheet = sheets[selectedSheetIndex] || sheets[0];
      const aoa = activeSheet.aoa;
      const headers = aoa[0] ? normalizeHeaders(aoa[0]) : [];
      const dataRows = aoa.slice(1);
      return {
        mode: 'table' as const,
        headers,
        rows: dataRows,
        meta: `${sheets.length} sheet${sheets.length === 1 ? '' : 's'} · ${dataRows.length} data rows in "${activeSheet.name}"`,
      };
    }

    if (!textInput.trim()) return null;

    if (isCsvInput) {
      const delim = delimiterChoice === 'auto' ? detectCsvDelimiter(textInput) : delimiterChoice;
      const parsed = parseCsv(textInput, delim);
      if (parsed.length === 0) return null;
      const headers = normalizeHeaders(parsed[0]);
      const dataRows = parsed.slice(1);
      const delimLabel = delim === '\t' ? 'Tab' : delim === ';' ? 'Semicolon (;)' : 'Comma (,)';
      return {
        mode: 'table' as const,
        headers,
        rows: dataRows,
        meta: `${dataRows.length} data rows · ${headers.length} columns · Delimiter: ${delimLabel}`,
        detectedDelimiter: delim,
      };
    }

    if (isXmlInput) {
      try {
        if (tool.slug === 'xml-to-json') {
          return {
            mode: 'code' as const,
            code: textInput.slice(0, 4000),
            truncated: textInput.length > 4000,
            meta: `${textInput.split(/\r?\n/).length} lines · Valid XML ready`,
          };
        }
        const tab = xmlToTabularRows(textInput);
        const rowsAoa = tab.rows.map((r) => tab.headers.map((h) => r[h] ?? ''));
        return {
          mode: 'table' as const,
          headers: tab.headers,
          rows: rowsAoa,
          meta: `${tab.rows.length} flattened record${tab.rows.length === 1 ? '' : 's'} · ${tab.headers.length} columns`,
        };
      } catch (err) {
        return {
          mode: 'error' as const,
          error: err instanceof Error ? err.message : 'Invalid XML input.',
        };
      }
    }

    if (isJsonInput) {
      try {
        JSON.parse(stripBom(textInput));
        return {
          mode: 'code' as const,
          code: textInput.slice(0, 4000),
          truncated: textInput.length > 4000,
          meta: `${textInput.split(/\r?\n/).length} lines · Valid JSON ready`,
        };
      } catch (err) {
        return {
          mode: 'error' as const,
          error: err instanceof Error ? err.message : 'Invalid JSON syntax.',
        };
      }
    }

    return null;
  }, [
    isExcelInput,
    isCsvInput,
    isXmlInput,
    isJsonInput,
    sheets,
    selectedSheetIndex,
    textInput,
    delimiterChoice,
    tool.slug,
  ]);

  const activeSheetHeaders = useMemo(() => {
    if (!isExcelInput || sheets.length === 0) return [];
    const active = sheets[selectedSheetIndex] || sheets[0];
    return active.aoa[0] ? normalizeHeaders(active.aoa[0]) : [];
  }, [isExcelInput, sheets, selectedSheetIndex]);

  // Perform live conversion whenever input or options change
  useEffect(() => {
    let cancelled = false;

    async function runConversion() {
      const hasInput = isExcelInput ? sheets.length > 0 : textInput.trim().length > 0;
      if (!hasInput) {
        revokeGeneratedUrls();
        setConversion(null);
        return;
      }

      setConverting(true);
      setErrorMessage(null);

      try {
        const stem = baseFileName(sourceName || tool.slug, tool.slug);
        const nextUrlsToTrack: string[] = [];
        const makeUrl = (blob: Blob) => {
          const url = URL.createObjectURL(blob);
          nextUrlsToTrack.push(url);
          return url;
        };

        let nextResult: ConversionResult;

        if (tool.slug === 'csv-to-excel') {
          const XLSX: typeof XLSXTypes = await import('xlsx');
          const delim =
            delimiterChoice === 'auto' ? detectCsvDelimiter(textInput) : delimiterChoice;
          const rows = parseCsv(textInput, delim);
          if (rows.length === 0) throw new Error('CSV input contains no rows.');
          const typedAoa = rows.map((r, rowIdx) =>
            r.map((cell) => (rowIdx === 0 ? cell : inferPrimitive(cell, inferTypes))),
          );
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.aoa_to_sheet(typedAoa);
          XLSX.utils.book_append_sheet(wb, ws, 'Data');
          const buf = XLSX.write(wb, {bookType: 'xlsx', type: 'array'}) as ArrayBuffer;
          const u8 = new Uint8Array(buf);
          const blob = new Blob([u8], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const outName = `${stem}.xlsx`;
          nextResult = {
            kind: 'single',
            parts: [
              {
                name: outName,
                size: u8.byteLength,
                url: makeUrl(blob),
                data: u8,
                detail: `${Math.max(0, rows.length - 1)} data rows · 1 worksheet`,
              },
            ],
            outputSize: u8.byteLength,
            previewKind: 'table',
            previewHeaders: normalizeHeaders(rows[0] || []),
            previewRows: rows.slice(1),
            summaryText: `Generated XLSX workbook (${Math.max(0, rows.length - 1)} data rows)`,
          };
        } else if (tool.slug === 'split-csv') {
          const delim =
            delimiterChoice === 'auto' ? detectCsvDelimiter(textInput) : delimiterChoice;
          const rows = parseCsv(textInput, delim);
          if (rows.length === 0) throw new Error('CSV input contains no rows.');
          const headerRow = rows[0];
          const dataRows = keepHeader ? rows.slice(1) : rows;
          if (dataRows.length === 0) {
            throw new Error('No data rows available to split after the header row.');
          }
          const chunkSize = Math.max(1, Math.min(50000, Math.floor(rowsPerSplit) || 1));
          const encoder = new TextEncoder();
          const parts: GeneratedPart[] = [];
          let partIndex = 1;

          for (let i = 0; i < dataRows.length; i += chunkSize) {
            const chunk = dataRows.slice(i, i + chunkSize);
            const fullRows = keepHeader ? [headerRow, ...chunk] : chunk;
            const csvString = serializeCsv(fullRows, delim);
            const encoded = encoder.encode(csvString);
            const u8 = new Uint8Array(new ArrayBuffer(encoded.byteLength));
            u8.set(encoded);
            const blob = new Blob([u8], {type: 'text/csv;charset=utf-8'});
            parts.push({
              name: `${stem}-part-${partIndex}.csv`,
              size: u8.byteLength,
              url: makeUrl(blob),
              data: u8,
              detail: `${chunk.length} data row${chunk.length === 1 ? '' : 's'}${keepHeader ? ' (+ header)' : ''}`,
              previewText: csvString,
            });
            partIndex++;
          }

          const totalOut = parts.reduce((acc, p) => acc + p.size, 0);
          let zipUrl: string | undefined;
          let zipName: string | undefined;
          let zipSize: number | undefined;
          if (parts.length > 1) {
            const zipBlob = createZipBlob(parts.map((p) => ({name: p.name, data: p.data})));
            zipUrl = makeUrl(zipBlob);
            zipName = `${stem}-split-csv.zip`;
            zipSize = zipBlob.size;
          }

          nextResult = {
            kind: 'multi',
            parts,
            zipUrl,
            zipName,
            zipSize,
            outputSize: totalOut,
            previewKind: 'parts',
            summaryText: `Split into ${parts.length} CSV file${parts.length === 1 ? '' : 's'} (${chunkSize} rows/part max)`,
          };
        } else if (tool.slug === 'csv-to-json') {
          const delim =
            delimiterChoice === 'auto' ? detectCsvDelimiter(textInput) : delimiterChoice;
          const rows = parseCsv(textInput, delim);
          if (rows.length === 0) throw new Error('CSV input contains no rows.');
          const {records} = csvRowsToObjects(rows, inferTypes);
          const jsonString = prettyPrint ? JSON.stringify(records, null, 2) : JSON.stringify(records);
          const encoded = new TextEncoder().encode(jsonString);
          const u8 = new Uint8Array(new ArrayBuffer(encoded.byteLength));
          u8.set(encoded);
          const blob = new Blob([u8], {type: 'application/json;charset=utf-8'});
          nextResult = {
            kind: 'single',
            parts: [
              {
                name: `${stem}.json`,
                size: u8.byteLength,
                url: makeUrl(blob),
                data: u8,
                detail: `${records.length} JSON object${records.length === 1 ? '' : 's'}`,
              },
            ],
            outputSize: u8.byteLength,
            previewKind: 'code',
            previewCode: jsonString,
            summaryText: `Converted ${records.length} rows to JSON array`,
          };
        } else if (tool.slug === 'csv-to-xml') {
          const delim =
            delimiterChoice === 'auto' ? detectCsvDelimiter(textInput) : delimiterChoice;
          const rows = parseCsv(textInput, delim);
          if (rows.length === 0) throw new Error('CSV input contains no rows.');
          const {headers, records} = csvRowsToObjects(rows, false);
          const xmlString = rowsToXmlString(headers, records, rootTag, rowTag);
          const encoded = new TextEncoder().encode(xmlString);
          const u8 = new Uint8Array(new ArrayBuffer(encoded.byteLength));
          u8.set(encoded);
          const blob = new Blob([u8], {type: 'application/xml;charset=utf-8'});
          nextResult = {
            kind: 'single',
            parts: [
              {
                name: `${stem}.xml`,
                size: u8.byteLength,
                url: makeUrl(blob),
                data: u8,
                detail: `${records.length} <${rowTag}> elements`,
              },
            ],
            outputSize: u8.byteLength,
            previewKind: 'code',
            previewCode: xmlString,
            summaryText: `Converted ${records.length} CSV rows to well-formed XML`,
          };
        } else if (tool.slug === 'json-to-xml') {
          const xmlString = jsonToXmlString(textInput, rootTag, rowTag, prettyPrint);
          const encoded = new TextEncoder().encode(xmlString);
          const u8 = new Uint8Array(new ArrayBuffer(encoded.byteLength));
          u8.set(encoded);
          const blob = new Blob([u8], {type: 'application/xml;charset=utf-8'});
          nextResult = {
            kind: 'single',
            parts: [
              {
                name: `${stem}.xml`,
                size: u8.byteLength,
                url: makeUrl(blob),
                data: u8,
                detail: 'Valid UTF-8 XML document',
              },
            ],
            outputSize: u8.byteLength,
            previewKind: 'code',
            previewCode: xmlString,
            summaryText: 'Generated well-formed XML document',
          };
        } else if (tool.slug === 'xml-to-json') {
          const jsonObj = xmlToJsonData(textInput, attrPrefix);
          const jsonString = prettyPrint ? JSON.stringify(jsonObj, null, 2) : JSON.stringify(jsonObj);
          const encoded = new TextEncoder().encode(jsonString);
          const u8 = new Uint8Array(new ArrayBuffer(encoded.byteLength));
          u8.set(encoded);
          const blob = new Blob([u8], {type: 'application/json;charset=utf-8'});
          nextResult = {
            kind: 'single',
            parts: [
              {
                name: `${stem}.json`,
                size: u8.byteLength,
                url: makeUrl(blob),
                data: u8,
                detail: 'Structured JSON output',
              },
            ],
            outputSize: u8.byteLength,
            previewKind: 'code',
            previewCode: jsonString,
            summaryText: 'Parsed XML hierarchy & attributes into JSON',
          };
        } else if (tool.slug === 'xml-to-csv') {
          const tab = xmlToTabularRows(textInput);
          const aoa = [
            tab.headers,
            ...tab.rows.map((r) => tab.headers.map((h) => r[h] ?? '')),
          ];
          const csvString = serializeCsv(aoa, ',');
          const encoded = new TextEncoder().encode(csvString);
          const u8 = new Uint8Array(new ArrayBuffer(encoded.byteLength));
          u8.set(encoded);
          const blob = new Blob([u8], {type: 'text/csv;charset=utf-8'});
          nextResult = {
            kind: 'single',
            parts: [
              {
                name: `${stem}.csv`,
                size: u8.byteLength,
                url: makeUrl(blob),
                data: u8,
                detail: `${tab.rows.length} rows · ${tab.headers.length} columns`,
              },
            ],
            outputSize: u8.byteLength,
            previewKind: 'code',
            previewCode: csvString,
            summaryText: `Flattened ${tab.rows.length} XML records to CSV`,
          };
        } else if (tool.slug === 'xml-to-excel') {
          const XLSX: typeof XLSXTypes = await import('xlsx');
          const tab = xmlToTabularRows(textInput);
          const aoa: Array<Array<string | number | boolean>> = [
            tab.headers,
            ...tab.rows.map((r) => tab.headers.map((h) => inferPrimitive(r[h] ?? '', inferTypes))),
          ];
          const wb = XLSX.utils.book_new();
          const ws = XLSX.utils.aoa_to_sheet(aoa);
          XLSX.utils.book_append_sheet(wb, ws, 'XML_Data');
          const buf = XLSX.write(wb, {bookType: 'xlsx', type: 'array'}) as ArrayBuffer;
          const u8 = new Uint8Array(buf);
          const blob = new Blob([u8], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          nextResult = {
            kind: 'single',
            parts: [
              {
                name: `${stem}.xlsx`,
                size: u8.byteLength,
                url: makeUrl(blob),
                data: u8,
                detail: `${tab.rows.length} rows · ${tab.headers.length} columns`,
              },
            ],
            outputSize: u8.byteLength,
            previewKind: 'table',
            previewHeaders: tab.headers,
            previewRows: tab.rows.map((r) => tab.headers.map((h) => r[h] ?? '')),
            summaryText: `Flattened ${tab.rows.length} XML records to XLSX workbook`,
          };
        } else if (tool.slug === 'excel-to-csv') {
          const sheet = sheets[selectedSheetIndex] || sheets[0];
          if (!sheet || sheet.aoa.length === 0) {
            throw new Error('The selected worksheet is empty.');
          }
          const csvString = serializeCsv(sheet.aoa, excelCsvDelimiter);
          const encoded = new TextEncoder().encode(csvString);
          const u8 = new Uint8Array(new ArrayBuffer(encoded.byteLength));
          u8.set(encoded);
          const blob = new Blob([u8], {type: 'text/csv;charset=utf-8'});
          const sheetSuffix = sheets.length > 1 ? `-${sanitizeSheetFilePart(sheet.name)}` : '';
          nextResult = {
            kind: 'single',
            parts: [
              {
                name: `${stem}${sheetSuffix}.csv`,
                size: u8.byteLength,
                url: makeUrl(blob),
                data: u8,
                detail: `Sheet "${sheet.name}" · ${Math.max(0, sheet.aoa.length - 1)} data rows`,
              },
            ],
            outputSize: u8.byteLength,
            previewKind: 'code',
            previewCode: csvString,
            summaryText: `Exported worksheet "${sheet.name}" to UTF-8 CSV`,
          };
        } else if (tool.slug === 'excel-to-xml') {
          const sheet = sheets[selectedSheetIndex] || sheets[0];
          if (!sheet || sheet.aoa.length === 0) {
            throw new Error('The selected worksheet is empty.');
          }
          const {headers, records} = csvRowsToObjects(sheet.aoa, false);
          const xmlString = rowsToXmlString(headers, records, rootTag, rowTag);
          const encoded = new TextEncoder().encode(xmlString);
          const u8 = new Uint8Array(new ArrayBuffer(encoded.byteLength));
          u8.set(encoded);
          const blob = new Blob([u8], {type: 'application/xml;charset=utf-8'});
          const sheetSuffix = sheets.length > 1 ? `-${sanitizeSheetFilePart(sheet.name)}` : '';
          nextResult = {
            kind: 'single',
            parts: [
              {
                name: `${stem}${sheetSuffix}.xml`,
                size: u8.byteLength,
                url: makeUrl(blob),
                data: u8,
                detail: `Sheet "${sheet.name}" · ${records.length} <${rowTag}> nodes`,
              },
            ],
            outputSize: u8.byteLength,
            previewKind: 'code',
            previewCode: xmlString,
            summaryText: `Converted worksheet "${sheet.name}" (${records.length} rows) to XML`,
          };
        } else if (tool.slug === 'split-excel') {
          const XLSX: typeof XLSXTypes = await import('xlsx');
          const parts: GeneratedPart[] = [];

          const buildXlsxPart = (
            partName: string,
            sheetName: string,
            aoa: string[][],
            detail: string,
          ): GeneratedPart => {
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(aoa);
            XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31) || 'Sheet1');
            const buf = XLSX.write(wb, {bookType: 'xlsx', type: 'array'}) as ArrayBuffer;
            const u8 = new Uint8Array(buf);
            const blob = new Blob([u8], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });
            return {
              name: partName,
              size: u8.byteLength,
              url: makeUrl(blob),
              data: u8,
              detail,
            };
          };

          if (splitExcelMode === 'sheet') {
            sheets.forEach((sheet, idx) => {
              const safeSheet = sanitizeSheetFilePart(sheet.name || `sheet_${idx + 1}`);
              parts.push(
                buildXlsxPart(
                  `${stem}-${safeSheet}.xlsx`,
                  sheet.name,
                  sheet.aoa,
                  `${Math.max(0, sheet.aoa.length - 1)} data rows · Sheet "${sheet.name}"`,
                ),
              );
            });
          } else if (splitExcelMode === 'rows') {
            const active = sheets[selectedSheetIndex] || sheets[0];
            if (!active || active.aoa.length === 0) {
              throw new Error('The selected worksheet is empty.');
            }
            const header = active.aoa[0];
            const dataRows = keepHeader ? active.aoa.slice(1) : active.aoa;
            if (dataRows.length === 0) {
              throw new Error('No data rows to split after the header row.');
            }
            const chunkSize = Math.max(1, Math.min(50000, Math.floor(rowsPerSplit) || 1));
            let partIdx = 1;
            for (let i = 0; i < dataRows.length; i += chunkSize) {
              const chunk = dataRows.slice(i, i + chunkSize);
              const rowsForSheet = keepHeader ? [header, ...chunk] : chunk;
              parts.push(
                buildXlsxPart(
                  `${stem}-${sanitizeSheetFilePart(active.name)}-part-${partIdx}.xlsx`,
                  active.name,
                  rowsForSheet,
                  `${chunk.length} data row${chunk.length === 1 ? '' : 's'}${keepHeader ? ' (+ header)' : ''}`,
                ),
              );
              partIdx++;
            }
          } else {
            // splitExcelMode === 'column'
            const active = sheets[selectedSheetIndex] || sheets[0];
            if (!active || active.aoa.length < 2) {
              throw new Error(
                'Need at least a header row and 1 data row to split by column value.',
              );
            }
            const header = active.aoa[0];
            const colIdx = Math.min(splitColumnIndex, Math.max(0, header.length - 1));
            const colName = header[colIdx] || `Column ${colIdx + 1}`;
            const groups = new Map<string, string[][]>();
            for (const row of active.aoa.slice(1)) {
              const key = (row[colIdx] ?? '').trim() || '(Blank)';
              const list = groups.get(key) ?? [];
              list.push(row);
              groups.set(key, list);
            }
            const usedNames = new Map<string, number>();
            for (const [val, groupRows] of groups.entries()) {
              const rawPart = sanitizeSheetFilePart(val);
              const count = (usedNames.get(rawPart) ?? 0) + 1;
              usedNames.set(rawPart, count);
              const uniquePart = count === 1 ? rawPart : `${rawPart}_${count}`;
              const rowsForSheet = keepHeader ? [header, ...groupRows] : groupRows;
              parts.push(
                buildXlsxPart(
                  `${stem}-${uniquePart}.xlsx`,
                  active.name,
                  rowsForSheet,
                  `${colName}: "${val}" (${groupRows.length} row${groupRows.length === 1 ? '' : 's'})`,
                ),
              );
            }
          }

          const totalOut = parts.reduce((acc, p) => acc + p.size, 0);
          let zipUrl: string | undefined;
          let zipName: string | undefined;
          let zipSize: number | undefined;
          if (parts.length > 1) {
            const zipBlob = createZipBlob(parts.map((p) => ({name: p.name, data: p.data})));
            zipUrl = makeUrl(zipBlob);
            zipName = `${stem}-split-excel.zip`;
            zipSize = zipBlob.size;
          }

          nextResult = {
            kind: 'multi',
            parts,
            zipUrl,
            zipName,
            zipSize,
            outputSize: totalOut,
            previewKind: 'parts',
            summaryText: `Split into ${parts.length} XLSX workbook${parts.length === 1 ? '' : 's'}`,
          };
        } else {
          throw new Error(`Unsupported converter slug: ${tool.slug}`);
        }

        if (cancelled) {
          for (const url of nextUrlsToTrack) URL.revokeObjectURL(url);
          return;
        }

        revokeGeneratedUrls();
        createdUrlsRef.current = nextUrlsToTrack;
        setConversion(nextResult);
      } catch (err) {
        if (!cancelled) {
          revokeGeneratedUrls();
          setConversion(null);
          setErrorMessage(
            err instanceof Error ? err.message : 'Conversion failed for this input.',
          );
        }
      } finally {
        if (!cancelled) {
          setConverting(false);
        }
      }
    }

    runConversion();

    return () => {
      cancelled = true;
    };
  }, [
    tool.slug,
    isExcelInput,
    sheets,
    selectedSheetIndex,
    textInput,
    sourceName,
    delimiterChoice,
    excelCsvDelimiter,
    inferTypes,
    prettyPrint,
    rootTag,
    rowTag,
    attrPrefix,
    rowsPerSplit,
    keepHeader,
    splitExcelMode,
    splitColumnIndex,
    revokeGeneratedUrls,
  ]);

  const handleCopyCode = async () => {
    if (!conversion?.previewCode) return;
    try {
      await navigator.clipboard.writeText(conversion.previewCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 1800);
    } catch {
      // Clipboard blocked in restricted iframe
    }
  };

  const hasLoadedInput = isExcelInput ? sheets.length > 0 : textInput.trim().length > 0;
  const maxMB = tool.maxFileSizeMB ?? 10;

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80">
        <div className="flex items-center gap-2.5">
          {isExcelInput || tool.slug === 'csv-to-excel' || tool.slug === 'xml-to-excel' ? (
            <FileSpreadsheet className="h-5 w-5 text-[#0A8CFF]" />
          ) : (
            <FileCode2 className="h-5 w-5 text-[#0A8CFF]" />
          )}
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{tool.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {maxMB} MB max per file · Processed locally in your browser · Zero watermarks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleLoadSample}
            disabled={loadingSample}
            className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 px-3 py-1.5 text-xs font-semibold text-[#0A8CFF] hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors cursor-pointer disabled:opacity-60"
          >
            {loadingSample ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            <span>Try sample file</span>
          </button>

          {hasLoadedInput && (
            <button
              type="button"
              onClick={handleClearInput}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Input Mode Switcher for text-based formats */}
        {isTextBased && (
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <button
              type="button"
              onClick={() => setInputMode('file')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                inputMode === 'file'
                  ? 'bg-[#0A8CFF] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Upload {tool.acceptedFormats?.join('/')} File
            </button>
            <button
              type="button"
              onClick={() => setInputMode('paste')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                inputMode === 'paste'
                  ? 'bg-[#0A8CFF] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Paste {tool.acceptedFormats?.[0]} Text
            </button>
            {sourceName && (
              <span className="ml-auto text-xs font-mono text-slate-500 dark:text-slate-400">
                {sourceName} ({formatBytes(inputBytes)})
              </span>
            )}
          </div>
        )}

        {/* File Dropzone */}
        {(!isTextBased || inputMode === 'file') && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept={getAcceptAttr(tool)}
              onChange={handleFileChange}
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) loadSelectedFile(file);
              }}
              className="rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0A8CFF] bg-slate-50/70 dark:bg-slate-950/50 p-6 text-center cursor-pointer transition-colors"
            >
              <FolderOpen className="mx-auto h-7 w-7 text-[#0A8CFF] mb-2" />
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {sourceFile
                  ? `Selected: ${sourceFile.name} (${formatBytes(sourceFile.size)})`
                  : `Drop your ${getInputCategoryLabel(tool.slug)} file here, or click to browse`}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Accepted: {tool.acceptedFormats?.join(', ')} · Max {maxMB} MB · 1 file
              </div>
            </div>
          </div>
        )}

        {/* Paste Textarea */}
        {isTextBased && inputMode === 'paste' && (
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Paste or edit raw {tool.acceptedFormats?.[0]} data (max {maxMB} MB)
            </label>
            <textarea
              value={textInput}
              onChange={(e) => handlePasteChange(e.target.value)}
              rows={7}
              placeholder={`Paste ${tool.acceptedFormats?.[0]} content here, or click "Try sample file" above...`}
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-3 text-xs font-mono text-slate-800 dark:text-slate-200 focus:border-[#0A8CFF] focus:outline-none"
            />
          </div>
        )}

        {/* Tool-specific controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-4">
          {isCsvInput && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                CSV Delimiter
              </label>
              <select
                value={delimiterChoice}
                onChange={(e) => setDelimiterChoice(e.target.value as DelimiterChoice)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
              >
                <option value="auto">Auto-detect</option>
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value={'\t'}>Tab (\t)</option>
              </select>
            </div>
          )}

          {isExcelInput && sheets.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Active Worksheet
              </label>
              <select
                value={selectedSheetIndex}
                onChange={(e) => {
                  setSelectedSheetIndex(Number(e.target.value));
                  setSplitColumnIndex(0);
                }}
                disabled={tool.slug === 'split-excel' && splitExcelMode === 'sheet'}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs disabled:opacity-60"
              >
                {sheets.map((s, idx) => (
                  <option key={idx} value={idx}>
                    {s.name} ({Math.max(0, s.aoa.length - 1)} rows)
                  </option>
                ))}
              </select>
            </div>
          )}

          {tool.slug === 'excel-to-csv' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Output CSV Delimiter
              </label>
              <select
                value={excelCsvDelimiter}
                onChange={(e) => setExcelCsvDelimiter(e.target.value as ',' | ';' | '\t')}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
              >
                <option value=",">Comma (,)</option>
                <option value=";">Semicolon (;)</option>
                <option value={'\t'}>Tab (\t)</option>
              </select>
            </div>
          )}

          {tool.slug === 'split-excel' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Split Mode
                </label>
                <select
                  value={splitExcelMode}
                  onChange={(e) => setSplitExcelMode(e.target.value as SplitExcelMode)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                >
                  <option value="sheet">By worksheet tab</option>
                  <option value="rows">By row count</option>
                  <option value="column">By column value</option>
                </select>
              </div>

              {splitExcelMode === 'rows' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rows per XLSX File
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50000}
                    value={rowsPerSplit}
                    onChange={(e) => setRowsPerSplit(Math.max(1, Number(e.target.value) || 1))}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                  />
                </div>
              )}

              {splitExcelMode === 'column' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Group by Column
                  </label>
                  <select
                    value={splitColumnIndex}
                    onChange={(e) => setSplitColumnIndex(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                  >
                    {activeSheetHeaders.length === 0 ? (
                      <option value={0}>Load workbook first</option>
                    ) : (
                      activeSheetHeaders.map((hdr, idx) => (
                        <option key={idx} value={idx}>
                          {hdr}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              )}

              {splitExcelMode !== 'sheet' && (
                <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer self-end pb-2">
                  <input
                    type="checkbox"
                    checked={keepHeader}
                    onChange={(e) => setKeepHeader(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span>Keep header row in every file</span>
                </label>
              )}
            </>
          )}

          {tool.slug === 'split-csv' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Rows per CSV Part
                </label>
                <input
                  type="number"
                  min={1}
                  max={50000}
                  value={rowsPerSplit}
                  onChange={(e) => setRowsPerSplit(Math.max(1, Number(e.target.value) || 1))}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
                />
              </div>
              <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer self-end pb-2">
                <input
                  type="checkbox"
                  checked={keepHeader}
                  onChange={(e) => setKeepHeader(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span>Repeat header row in every chunk</span>
              </label>
            </>
          )}

          {(tool.slug === 'csv-to-excel' ||
            tool.slug === 'csv-to-json' ||
            tool.slug === 'xml-to-excel') && (
            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer self-end pb-2">
              <input
                type="checkbox"
                checked={inferTypes}
                onChange={(e) => setInferTypes(e.target.checked)}
                className="rounded border-slate-300"
              />
              <span>Infer numbers & booleans</span>
            </label>
          )}

          {(tool.slug === 'csv-to-json' ||
            tool.slug === 'json-to-xml' ||
            tool.slug === 'xml-to-json') && (
            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer self-end pb-2">
              <input
                type="checkbox"
                checked={prettyPrint}
                onChange={(e) => setPrettyPrint(e.target.checked)}
                className="rounded border-slate-300"
              />
              <span>Pretty-print output</span>
            </label>
          )}

          {(tool.slug === 'csv-to-xml' ||
            tool.slug === 'excel-to-xml' ||
            tool.slug === 'json-to-xml') && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Root XML Tag
                </label>
                <input
                  type="text"
                  value={rootTag}
                  onChange={(e) => setRootTag(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {tool.slug === 'json-to-xml' ? 'Array Item Tag' : 'Row Element Tag'}
                </label>
                <input
                  type="text"
                  value={rowTag}
                  onChange={(e) => setRowTag(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-mono"
                />
              </div>
            </>
          )}

          {tool.slug === 'xml-to-json' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Attribute Key Prefix
              </label>
              <select
                value={attrPrefix}
                onChange={(e) => setAttrPrefix(e.target.value)}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs"
              >
                <option value="@">@attr (default)</option>
                <option value="_">_attr</option>
                <option value="">No prefix</option>
              </select>
            </div>
          )}
        </div>

        {/* Error Display */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Live Previews Grid: Input vs Output */}
        {(parsedInputPreview || conversion) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Parsed Input Preview */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-white dark:bg-slate-900">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Parsed Input Preview
                </span>
                {parsedInputPreview && 'meta' in parsedInputPreview && (
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {parsedInputPreview.meta}
                  </span>
                )}
              </div>

              <div className="p-3 flex-1 overflow-auto max-h-72">
                {parsedInputPreview?.mode === 'table' && (
                  <>
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          {parsedInputPreview.headers.slice(0, 10).map((h, i) => (
                            <th
                              key={i}
                              className="py-1.5 px-2 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsedInputPreview.rows.slice(0, 8).map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            className="border-b border-slate-100 dark:border-slate-800/70"
                          >
                            {parsedInputPreview.headers.slice(0, 10).map((_, cIdx) => (
                              <td
                                key={cIdx}
                                className="py-1.5 px-2 text-slate-600 dark:text-slate-300 whitespace-nowrap max-w-[160px] truncate"
                              >
                                {row[cIdx] ?? ''}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parsedInputPreview.rows.length > 8 && (
                      <div className="pt-2 text-[11px] text-slate-500">
                        Showing first 8 of {parsedInputPreview.rows.length} rows
                      </div>
                    )}
                  </>
                )}

                {parsedInputPreview?.mode === 'code' && (
                  <pre className="text-[11px] font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all">
                    {parsedInputPreview.code}
                    {parsedInputPreview.truncated ? '\n…(preview truncated)' : ''}
                  </pre>
                )}

                {parsedInputPreview?.mode === 'error' && (
                  <div className="text-xs text-rose-600 dark:text-rose-400">
                    {parsedInputPreview.error}
                  </div>
                )}
              </div>
            </div>

            {/* Live Converted Output Preview */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 bg-white dark:bg-slate-900">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  Converted Output Preview
                </span>
                <div className="flex items-center gap-2">
                  {converting && <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0A8CFF]" />}
                  {conversion?.previewCode && (
                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0A8CFF] hover:underline cursor-pointer"
                    >
                      {copiedCode ? (
                        <>
                          <Check className="h-3 w-3" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              <div className="p-3 flex-1 overflow-auto max-h-72">
                {conversion?.previewKind === 'table' && conversion.previewHeaders && (
                  <>
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          {conversion.previewHeaders.slice(0, 10).map((h, i) => (
                            <th
                              key={i}
                              className="py-1.5 px-2 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap"
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(conversion.previewRows || []).slice(0, 8).map((row, rIdx) => (
                          <tr
                            key={rIdx}
                            className="border-b border-slate-100 dark:border-slate-800/70"
                          >
                            {conversion.previewHeaders!.slice(0, 10).map((_, cIdx) => (
                              <td
                                key={cIdx}
                                className="py-1.5 px-2 text-slate-600 dark:text-slate-300 whitespace-nowrap max-w-[160px] truncate"
                              >
                                {row[cIdx] ?? ''}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {(conversion.previewRows || []).length > 8 && (
                      <div className="pt-2 text-[11px] text-slate-500">
                        Showing first 8 of {conversion.previewRows!.length} rows in output sheet
                      </div>
                    )}
                  </>
                )}

                {conversion?.previewKind === 'code' && conversion.previewCode !== undefined && (
                  <pre className="text-[11px] font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-all">
                    {conversion.previewCode.slice(0, 5000)}
                    {conversion.previewCode.length > 5000 ? '\n…(preview truncated, download full file below)' : ''}
                  </pre>
                )}

                {conversion?.previewKind === 'parts' && (
                  <div className="space-y-2">
                    {conversion.parts.map((part, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                            {part.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {part.detail} · {formatBytes(part.size)}
                          </div>
                        </div>
                        <a
                          href={part.url}
                          download={part.name}
                          className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 text-[11px] font-semibold transition-colors"
                        >
                          <Download className="h-3 w-3" />
                          <span>Save</span>
                        </a>
                      </div>
                    ))}
                  </div>
                )}

                {!conversion && !converting && (
                  <div className="text-xs text-slate-500">
                    Load valid input to preview the converted output.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Output Summary + Input vs Output File Size + Download Action Bar */}
        {conversion && (
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20 p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>{conversion.summaryText}</span>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                Input: {formatBytes(inputBytes)} → Output: {formatBytes(conversion.outputSize)}
                {conversion.zipSize !== undefined && ` (ZIP: ${formatBytes(conversion.zipSize)})`}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {conversion.kind === 'single' && conversion.parts[0] && (
                <a
                  href={conversion.parts[0].url}
                  download={conversion.parts[0].name}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-semibold shadow-sm transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download {conversion.parts[0].name}</span>
                </a>
              )}

              {conversion.kind === 'multi' && conversion.zipUrl && conversion.zipName && (
                <a
                  href={conversion.zipUrl}
                  download={conversion.zipName}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-semibold shadow-sm transition-colors"
                >
                  <FileArchive className="h-4 w-4" />
                  <span>Download All (.zip)</span>
                </a>
              )}

              {conversion.kind === 'multi' && !conversion.zipUrl && conversion.parts[0] && (
                <a
                  href={conversion.parts[0].url}
                  download={conversion.parts[0].name}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 text-xs font-semibold shadow-sm transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download {conversion.parts[0].name}</span>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
