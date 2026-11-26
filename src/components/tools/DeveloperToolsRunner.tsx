import React, {useState, useEffect, useMemo, useRef} from 'react';
import {Copy, Check, Braces, Code, FileCode, Palette, Volume2, Mic, Binary, Link2, Download, AlertCircle, RefreshCw, Sparkles, Play, Pause, Square} from 'lucide-react';
import type {Tool} from '../../data/tools';

interface Props {
  tool: Tool;
}

export function DeveloperToolsRunner({tool}: Props) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyText = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0A8CFF]/10 text-[#0A8CFF]">
            {tool.slug === 'developer-json-formatter' && <Braces className="h-5 w-5" />}
            {tool.slug === 'developer-xml-formatter' && <FileCode className="h-5 w-5" />}
            {tool.slug === 'developer-code-beautifier' && <Code className="h-5 w-5" />}
            {tool.slug === 'developer-color-picker' && <Palette className="h-5 w-5" />}
            {tool.slug === 'developer-text-to-speech' && <Volume2 className="h-5 w-5" />}
            {tool.slug === 'developer-speech-to-text' && <Mic className="h-5 w-5" />}
            {tool.slug === 'developer-base64-encoder-decoder' && <Binary className="h-5 w-5" />}
            {tool.slug === 'developer-url-encoder-decoder' && <Link2 className="h-5 w-5" />}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-950 dark:text-white">
              {tool.name} — Interactive Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deterministic browser execution · Zero server transfer · Real client-side computation
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Active Browser Tool
        </span>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {tool.slug === 'developer-json-formatter' && <JsonFormatter onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'developer-xml-formatter' && <XmlFormatter onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'developer-code-beautifier' && <CodeBeautifier onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'developer-color-picker' && <ColorPicker onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'developer-text-to-speech' && <TextToSpeech onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'developer-speech-to-text' && <SpeechToText onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'developer-base64-encoder-decoder' && <Base64Tool onCopy={copyText} copiedKey={copiedKey} />}
        {tool.slug === 'developer-url-encoder-decoder' && <UrlTool onCopy={copyText} copiedKey={copiedKey} />}
      </div>
    </div>
  );
}

// =========================================================================
// 1. JSON FORMATTER
// Verification check: turns {"a":1} into pretty-printed JSON
// =========================================================================
function JsonFormatter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [inputJson, setInputJson] = useState<string>('{"name":"ToolPlatform","tools":172,"active":true,"categories":["PDF","Image","Developer","Finance"]}');
  const [indent, setIndent] = useState<number>(2);
  const [outputJson, setOutputJson] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatJson = (spaces: number) => {
    try {
      if (!inputJson.trim()) {
        setOutputJson('');
        setErrorMsg(null);
        return;
      }
      const parsed = JSON.parse(inputJson);
      const formatted = JSON.stringify(parsed, null, spaces);
      setOutputJson(formatted);
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid JSON syntax');
    }
  };

  const minifyJson = () => {
    try {
      if (!inputJson.trim()) {
        setOutputJson('');
        setErrorMsg(null);
        return;
      }
      const parsed = JSON.parse(inputJson);
      const minified = JSON.stringify(parsed);
      setOutputJson(minified);
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid JSON syntax');
    }
  };

  useEffect(() => {
    formatJson(indent);
  }, [inputJson, indent]);

  const downloadJson = () => {
    if (!outputJson) return;
    const blob = new Blob([outputJson], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIndent(2);
              formatJson(2);
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold border ${
              indent === 2 ? 'border-[#0A8CFF] bg-sky-50 text-[#0A8CFF]' : 'border-slate-200'
            }`}
          >
            2 Spaces
          </button>
          <button
            type="button"
            onClick={() => {
              setIndent(4);
              formatJson(4);
            }}
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold border ${
              indent === 4 ? 'border-[#0A8CFF] bg-sky-50 text-[#0A8CFF]' : 'border-slate-200'
            }`}
          >
            4 Spaces
          </button>
          <button
            type="button"
            onClick={minifyJson}
            className="rounded-xl px-3 py-1.5 text-xs font-semibold border border-slate-200 hover:border-slate-300"
          >
            Minify (Compact)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setInputJson('{"a":1}')}
            className="text-xs text-slate-500 hover:text-slate-800 hover:underline"
          >
            Load sample: &#123;&quot;a&quot;:1&#125;
          </button>
          {outputJson && (
            <button
              type="button"
              onClick={downloadJson}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
            Raw JSON Input
          </label>
          <textarea
            rows={12}
            value={inputJson}
            onChange={(e) => setInputJson(e.target.value)}
            placeholder="Paste messy or unformatted JSON here..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 font-mono text-xs text-slate-900 dark:text-slate-100 focus:border-[#0A8CFF] focus:outline-none"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Formatted Output
            </label>
            {outputJson && (
              <button
                type="button"
                onClick={() => onCopy(outputJson, 'json')}
                className="text-xs text-[#0A8CFF] font-semibold hover:underline flex items-center gap-1"
              >
                {copiedKey === 'json' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'json' ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
          <textarea
            rows={12}
            readOnly
            value={outputJson}
            placeholder="Formatted JSON will appear here..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 font-mono text-xs text-slate-900 dark:text-slate-100 select-all"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>JSON Syntax Error: {errorMsg}</span>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 2. XML FORMATTER
// =========================================================================
function XmlFormatter({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [inputXml, setInputXml] = useState<string>('<root><item id="1"><name>ToolPlatform</name><category>Developer</category></item><item id="2"><name>Calculator</name><category>Finance</category></item></root>');
  const [outputXml, setOutputXml] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatXml = () => {
    try {
      if (!inputXml.trim()) {
        setOutputXml('');
        setErrorMsg(null);
        return;
      }

      // Real browser DOMParser validation
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(inputXml, 'text/xml');
      const parserError = xmlDoc.getElementsByTagName('parsererror');

      if (parserError.length > 0) {
        setErrorMsg(parserError[0].textContent || 'Invalid XML syntax');
        return;
      }

      // Beautify indentation
      const PADDING = '  ';
      const reg = /(>)(<)(\/*)/g;
      let formatted = inputXml.replace(reg, '$1\r\n$2$3');
      let pad = 0;
      formatted = formatted
        .split('\r\n')
        .map((node) => {
          let indent = 0;
          if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
          } else if (node.match(/^<\/\w/)) {
            if (pad !== 0) pad -= 1;
          } else if (node.match(/^<\w[^>]*[^/]>.*$/)) {
            indent = 1;
          } else {
            indent = 0;
          }
          const padding = new Array(pad + 1).join(PADDING);
          pad += indent;
          return padding + node;
        })
        .join('\r\n');

      setOutputXml(formatted);
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error parsing XML');
    }
  };

  const minifyXml = () => {
    try {
      const minified = inputXml
        .replace(/>\s+</g, '><')
        .replace(/<!--[\s\S]*?-->/g, '')
        .trim();
      setOutputXml(minified);
      setErrorMsg(null);
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  };

  useEffect(() => {
    formatXml();
  }, [inputXml]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={formatXml}
            className="rounded-xl px-3 py-1.5 text-xs font-semibold border border-[#0A8CFF] bg-sky-50 text-[#0A8CFF]"
          >
            Format XML (Indented)
          </button>
          <button
            type="button"
            onClick={minifyXml}
            className="rounded-xl px-3 py-1.5 text-xs font-semibold border border-slate-200"
          >
            Minify XML
          </button>
        </div>
        {outputXml && (
          <button
            type="button"
            onClick={() => onCopy(outputXml, 'xml')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            {copiedKey === 'xml' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>Copy XML</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Raw XML Input
          </label>
          <textarea
            rows={12}
            value={inputXml}
            onChange={(e) => setInputXml(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 font-mono text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Formatted XML Output
          </label>
          <textarea
            rows={12}
            readOnly
            value={outputXml}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 font-mono text-xs"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>XML Validation Error: {errorMsg}</span>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 3. CODE BEAUTIFIER (JS, HTML, CSS, JSON)
// =========================================================================
function CodeBeautifier({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [lang, setLang] = useState<'auto' | 'js' | 'html' | 'css' | 'json'>('auto');
  const [code, setCode] = useState<string>('function calculateTotal(items){let total=0;for(let i=0;i<items.length;i++){total+=items[i].price*items[i].qty;}return total;}');
  const [formattedCode, setFormattedCode] = useState<string>('');
  const [indentSize, setIndentSize] = useState<number>(2);

  const beautify = () => {
    if (!code.trim()) {
      setFormattedCode('');
      return;
    }

    let detected = lang;
    if (detected === 'auto') {
      const trimmed = code.trim();
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) detected = 'json';
      else if (trimmed.startsWith('<')) detected = 'html';
      else if (trimmed.includes('{') && trimmed.includes(':') && (trimmed.includes(';') || trimmed.includes('color'))) detected = 'css';
      else detected = 'js';
    }

    if (detected === 'json') {
      try {
        const p = JSON.parse(code);
        setFormattedCode(JSON.stringify(p, null, indentSize));
        return;
      } catch {
        // Fall back to general JS beautifier
      }
    }

    // General structural formatting
    const indentStr = ' '.repeat(indentSize);
    let indentLevel = 0;
    let out = '';
    const lines = code
      .replace(/;/g, ';\n')
      .replace(/\{/g, '{\n')
      .replace(/\}/g, '\n}\n')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    for (const line of lines) {
      if (line.startsWith('}')) indentLevel = Math.max(0, indentLevel - 1);
      out += indentStr.repeat(indentLevel) + line + '\n';
      if (line.endsWith('{')) indentLevel++;
    }

    setFormattedCode(out.trim());
  };

  useEffect(() => {
    beautify();
  }, [code, lang, indentSize]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold"
          >
            <option value="auto">Auto-Detect Language</option>
            <option value="js">JavaScript / TypeScript</option>
            <option value="json">JSON</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(parseInt(e.target.value, 10))}
            className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-bold"
          >
            <option value="2">2 Spaces</option>
            <option value="4">4 Spaces</option>
          </select>
        </div>

        {formattedCode && (
          <button
            type="button"
            onClick={() => onCopy(formattedCode, 'beautify')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            {copiedKey === 'beautify' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>Copy Code</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Input Raw Code
          </label>
          <textarea
            rows={12}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 font-mono text-xs"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Beautified Code
          </label>
          <textarea
            rows={12}
            readOnly
            value={formattedCode}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 4. COLOR PICKER & PALETTE GENERATOR
// =========================================================================
function ColorPicker({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [hex, setHex] = useState<string>('#0A8CFF');

  // Convert hex to rgb
  const rgb = useMemo(() => {
    let cleaned = hex.replace('#', '');
    if (cleaned.length === 3) {
      cleaned = cleaned.split('').map((c) => c + c).join('');
    }
    const r = parseInt(cleaned.slice(0, 2), 16) || 0;
    const g = parseInt(cleaned.slice(2, 4), 16) || 0;
    const b = parseInt(cleaned.slice(4, 6), 16) || 0;
    return {r, g, b};
  }, [hex]);

  // Convert rgb to hsl
  const hsl = useMemo(() => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }, [rgb]);

  // Harmonies
  const harmonies = useMemo(() => {
    const shiftHue = (deg: number) => `hsl(${(hsl.h + deg + 360) % 360}, ${hsl.s}%, ${hsl.l}%)`;
    return {
      complementary: shiftHue(180),
      analogous1: shiftHue(30),
      analogous2: shiftHue(-30),
      triadic1: shiftHue(120),
      triadic2: shiftHue(240),
    };
  }, [hsl]);

  return (
    <div className="space-y-6">
      {/* Visual picker block */}
      <div className="flex flex-wrap items-center gap-6 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40">
        <input
          type="color"
          value={hex}
          onChange={(e) => setHex(e.target.value.toUpperCase())}
          className="h-20 w-20 rounded-2xl cursor-pointer border border-slate-300 shadow-md"
        />
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-slate-500">HEX Code</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={hex}
              onChange={(e) => setHex(e.target.value)}
              className="w-32 rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-lg font-bold"
            />
          </div>
        </div>
      </div>

      {/* Format values */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">HEX</span>
            <div className="font-mono text-lg font-bold">{hex}</div>
          </div>
          <button
            type="button"
            onClick={() => onCopy(hex, 'hex')}
            className="text-xs text-[#0A8CFF] font-semibold hover:underline"
          >
            {copiedKey === 'hex' ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">RGB</span>
            <div className="font-mono text-base font-bold">rgb({rgb.r}, {rgb.g}, {rgb.b})</div>
          </div>
          <button
            type="button"
            onClick={() => onCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
            className="text-xs text-[#0A8CFF] font-semibold hover:underline"
          >
            {copiedKey === 'rgb' ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white dark:bg-slate-900 p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400">HSL</span>
            <div className="font-mono text-base font-bold">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</div>
          </div>
          <button
            type="button"
            onClick={() => onCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
            className="text-xs text-[#0A8CFF] font-semibold hover:underline"
          >
            {copiedKey === 'hsl' ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Harmonic Palettes */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
          Generated Color Harmonies:
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="rounded-xl border border-slate-200 p-3 text-center space-y-2">
            <div className="h-10 rounded-lg shadow-inner" style={{backgroundColor: hex}} />
            <span className="text-[11px] font-bold block">Current</span>
          </div>
          <div className="rounded-xl border border-slate-200 p-3 text-center space-y-2">
            <div className="h-10 rounded-lg shadow-inner" style={{backgroundColor: harmonies.complementary}} />
            <span className="text-[11px] font-bold block">Complementary</span>
          </div>
          <div className="rounded-xl border border-slate-200 p-3 text-center space-y-2">
            <div className="h-10 rounded-lg shadow-inner" style={{backgroundColor: harmonies.analogous1}} />
            <span className="text-[11px] font-bold block">Analogous +30°</span>
          </div>
          <div className="rounded-xl border border-slate-200 p-3 text-center space-y-2">
            <div className="h-10 rounded-lg shadow-inner" style={{backgroundColor: harmonies.triadic1}} />
            <span className="text-[11px] font-bold block">Triadic 120°</span>
          </div>
          <div className="rounded-xl border border-slate-200 p-3 text-center space-y-2">
            <div className="h-10 rounded-lg shadow-inner" style={{backgroundColor: harmonies.triadic2}} />
            <span className="text-[11px] font-bold block">Triadic 240°</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 5. TEXT TO SPEECH (USES BROWSER SPEECH SYNTHESIS)
// =========================================================================
function TextToSpeech({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [text, setText] = useState<string>('Hello! Welcome to the client-side text to speech tool. All speech synthesis executes locally inside your browser.');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const load = () => {
        const v = window.speechSynthesis.getVoices();
        setVoices(v);
        if (v.length > 0 && !selectedVoice) setSelectedVoice(v[0].name);
      };
      load();
      window.speechSynthesis.onvoiceschanged = load;
    }
  }, []);

  const speak = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    if (selectedVoice) {
      const v = voices.find((x) => x.name === selectedVoice);
      if (v) utter.voice = v;
    }
    utter.rate = rate;
    utter.pitch = pitch;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utter);
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
          Enter Text to Speak
        </label>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type any phrase or paragraph..."
          className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Select Voice</label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-semibold"
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Speech Rate: {rate}x</label>
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Pitch: {pitch}</label>
          <input
            type="range"
            min="0.5"
            max="1.5"
            step="0.1"
            value={pitch}
            onChange={(e) => setPitch(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={speak}
          className="inline-flex items-center gap-2 rounded-xl bg-[#0A8CFF] hover:bg-[#0077E6] px-5 py-2.5 text-sm font-bold text-white shadow-sm"
        >
          <Play className="h-4 w-4" />
          <span>{isSpeaking ? 'Restart Speech' : 'Play Speech'}</span>
        </button>
        <button
          type="button"
          onClick={stop}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
        >
          <Square className="h-4 w-4 text-rose-500" />
          <span>Stop</span>
        </button>
      </div>

      <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-4 text-xs text-sky-950">
        <strong>Browser Speech Synthesis Notice: </strong>
        Voices, accents, and audio quality depend directly on your device operating system (macOS/iOS Siri voices, Windows Speech voices, or Android voices) and browser capabilities.
      </div>
    </div>
  );
}

// =========================================================================
// 6. SPEECH TO TEXT (USES WEBKIT SPEECH RECOGNITION)
// =========================================================================
function SpeechToText({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [transcript, setTranscript] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setErrorMsg('Web Speech API is not supported in this browser. Please use Google Chrome, Edge, or Safari.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setErrorMsg(null);
      };

      recognition.onresult = (event: any) => {
        let current = '';
        for (let i = 0; i < event.results.length; i++) {
          current += event.results[i][0].transcript + ' ';
        }
        setTranscript(current.trim());
      };

      recognition.onerror = (e: any) => {
        setIsListening(false);
        setErrorMsg(`Microphone error: ${e.error || 'Permission denied or no speech detected.'}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not start microphone');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={toggleListening}
          className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-all shadow-sm ${
            isListening ? 'bg-rose-600 animate-pulse' : 'bg-[#0A8CFF] hover:bg-[#0077E6]'
          }`}
        >
          <Mic className="h-4 w-4" />
          <span>{isListening ? 'Stop Listening' : 'Start Speech to Text'}</span>
        </button>

        {transcript && (
          <button
            type="button"
            onClick={() => onCopy(transcript, 'stt')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            {copiedKey === 'stt' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
            <span>Copy Transcript</span>
          </button>
        )}
      </div>

      <textarea
        rows={8}
        value={transcript}
        onChange={(e) => setTranscript(e.target.value)}
        placeholder={isListening ? 'Listening to your microphone... speak now...' : 'Click "Start Speech to Text" and speak into your microphone.'}
        className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-sm"
      />

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-4 text-xs text-sky-950">
        <strong>Browser Microphone Notice: </strong>
        Speech-to-text requires microphone permission and relies on your browser’s native Web Speech Recognition API (supported in Google Chrome, Microsoft Edge, and Apple Safari).
      </div>
    </div>
  );
}

// =========================================================================
// 7. BASE64 ENCODER / DECODER
// Verification requirement: Base64 encode of "hello" = "aGVsbG8="
// =========================================================================
function Base64Tool({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [text, setText] = useState<string>('hello');
  const [output, setOutput] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const process = () => {
    try {
      if (!text) {
        setOutput('');
        setErrorMsg(null);
        return;
      }
      if (mode === 'encode') {
        // UTF-8 safe encode
        const encoded = btoa(unescape(encodeURIComponent(text)));
        setOutput(encoded);
        setErrorMsg(null);
      } else {
        // UTF-8 safe decode
        const decoded = decodeURIComponent(escape(atob(text.trim())));
        setOutput(decoded);
        setErrorMsg(null);
      }
    } catch {
      setErrorMsg('Invalid Base64 string for decoding.');
      setOutput('');
    }
  };

  useEffect(() => {
    process();
  }, [text, mode]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            setMode('encode');
            setText('hello');
          }}
          className={`rounded-xl px-4 py-2 text-xs font-semibold border ${
            mode === 'encode' ? 'border-[#0A8CFF] bg-sky-50 text-[#0A8CFF]' : 'border-slate-200'
          }`}
        >
          Encode to Base64
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('decode');
            setText('aGVsbG8=');
          }}
          className={`rounded-xl px-4 py-2 text-xs font-semibold border ${
            mode === 'decode' ? 'border-[#0A8CFF] bg-sky-50 text-[#0A8CFF]' : 'border-slate-200'
          }`}
        >
          Decode from Base64
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            {mode === 'encode' ? 'Text Input to Encode' : 'Base64 Input to Decode'}
          </label>
          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 font-mono text-sm"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Resulting Output
            </label>
            {output && (
              <button
                type="button"
                onClick={() => onCopy(output, 'b64')}
                className="text-xs text-[#0A8CFF] font-semibold hover:underline flex items-center gap-1"
              >
                {copiedKey === 'b64' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'b64' ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
          <textarea
            rows={8}
            readOnly
            value={output}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 font-mono text-sm select-all"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 8. URL ENCODER / DECODER
// =========================================================================
function UrlTool({onCopy, copiedKey}: {onCopy: (t: string, k: string) => void; copiedKey: string | null}) {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [inputUrl, setInputUrl] = useState<string>('https://example.com/search?q=online tools&category=developer tools&filter=free');
  const [outputUrl, setOutputUrl] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const process = () => {
    try {
      if (!inputUrl) {
        setOutputUrl('');
        setErrorMsg(null);
        return;
      }
      if (mode === 'encode') {
        setOutputUrl(encodeURIComponent(inputUrl));
        setErrorMsg(null);
      } else {
        setOutputUrl(decodeURIComponent(inputUrl));
        setErrorMsg(null);
      }
    } catch {
      setErrorMsg('Malformed URI sequence');
    }
  };

  useEffect(() => {
    process();
  }, [inputUrl, mode]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMode('encode')}
          className={`rounded-xl px-4 py-2 text-xs font-semibold border ${
            mode === 'encode' ? 'border-[#0A8CFF] bg-sky-50 text-[#0A8CFF]' : 'border-slate-200'
          }`}
        >
          URL Encode
        </button>
        <button
          type="button"
          onClick={() => setMode('decode')}
          className={`rounded-xl px-4 py-2 text-xs font-semibold border ${
            mode === 'decode' ? 'border-[#0A8CFF] bg-sky-50 text-[#0A8CFF]' : 'border-slate-200'
          }`}
        >
          URL Decode
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1">
            Input URL / String
          </label>
          <textarea
            rows={8}
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 font-mono text-xs"
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Processed Output
            </label>
            {outputUrl && (
              <button
                type="button"
                onClick={() => onCopy(outputUrl, 'url')}
                className="text-xs text-[#0A8CFF] font-semibold hover:underline flex items-center gap-1"
              >
                {copiedKey === 'url' ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedKey === 'url' ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>
          <textarea
            rows={8}
            readOnly
            value={outputUrl}
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 p-3 font-mono text-xs select-all"
          />
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}
