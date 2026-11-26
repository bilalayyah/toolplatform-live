import React, {useMemo, useState} from 'react';
import {AlertCircle, Router, Scale, Search} from 'lucide-react';
import type {Tool} from '../../data/tools';
import {
  BUNDLED_OUI_TABLE,
  NICE_CLASSES,
  lookupOui,
  type NiceClassEntry,
} from '../../data/lookupData';

interface Props {
  tool: Tool;
}

const SAMPLE_MAC_EXAMPLES = [
  {label: 'Apple', value: 'A4:83:E7:12:34:56'},
  {label: 'Intel', value: '80:86:F2:44:55:66'},
  {label: 'Raspberry Pi', value: 'DC:A6:32:01:02:03'},
  {label: 'Cisco', value: '00:40:96:AA:BB:CC'},
  {label: 'Randomized MAC', value: '02:AB:CD:11:22:33'},
  {label: 'Not in bundle', value: 'DE:AD:BE:EF:00:01'},
];

const NICE_QUICK_QUERIES = [
  'mobile app software',
  'clothing t-shirts',
  'coffee shop restaurant',
  'cosmetics skincare',
  'online store retail',
  'consulting fintech',
];

function scoreNiceClass(entry: NiceClassEntry, tokens: string[]): number {
  if (tokens.length === 0) return 1;
  const heading = entry.heading.toLowerCase();
  const desc = entry.description.toLowerCase();
  const kws = entry.keywords.join(' ').toLowerCase();
  const numStr = String(entry.classNumber);

  let score = 0;
  for (const token of tokens) {
    if (numStr === token || `class ${entry.classNumber}` === tokens.join(' ')) score += 12;
    if (entry.keywords.some((k) => k.toLowerCase() === token)) score += 10;
    else if (kws.includes(token)) score += 6;
    if (heading.includes(token)) score += 5;
    if (desc.includes(token)) score += 3;
  }
  return score;
}

export function LookupToolsRunner({tool}: Props) {
  if (tool.slug === 'lookup-mac-address-lookup') {
    return <MacAddressLookupWorkspace tool={tool} />;
  }
  return <TrademarkClassFinderWorkspace tool={tool} />;
}

function MacAddressLookupWorkspace({tool}: Props) {
  const [query, setQuery] = useState('A4:83:E7:12:34:56');
  const bundledCount = Object.keys(BUNDLED_OUI_TABLE).length;

  const result = useMemo(() => lookupOui(query), [query]);
  const hexCleaned = query.trim().replace(/[:\-.\s]/g, '').toUpperCase();
  const looksLikePartialHex = /^[0-9A-F]{1,5}$/.test(hexCleaned);

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80">
        <div className="flex items-center gap-2.5">
          <Router className="h-5 w-5 text-[#0A8CFF]" />
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{tool.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              Manufacturer-only lookup · {bundledCount} bundled IEEE OUI prefixes · Offline in browser
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 px-4 py-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div>
            <span className="font-semibold">Manufacturer-only from bundled OUI data:</span> This lookup checks a local bundled IEEE OUI vendor table inside your browser (no network requests or external APIs). A MAC prefix identifies only the network adapter manufacturer—never an individual device owner, account, or physical location.
          </div>
        </div>

        <div className="space-y-2.5">
          <label
            htmlFor="mac-lookup-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            Enter full MAC address, 6-hex OUI prefix, or vendor name
          </label>
          <div className="relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="mac-lookup-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. A4:83:E7:12:34:56, 80-86-F2, or Apple"
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-4 py-2.5 text-sm font-mono text-slate-900 dark:text-slate-100 focus:border-[#0A8CFF] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-slate-500 dark:text-slate-400">Examples:</span>
            {SAMPLE_MAC_EXAMPLES.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => setQuery(sample.value)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 hover:border-[#0A8CFF] px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                {sample.label}
              </button>
            ))}
          </div>
        </div>

        {!query.trim() ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-5 text-xs text-slate-500">
            Enter at least 6 hex characters of a MAC address (such as <code className="font-mono">A4:83:E7</code>) or a vendor name to look up matching entries in the bundled OUI table.
          </div>
        ) : result.normalizedPrefix ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-5 space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Bundled OUI Vendor</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {result.vendor ?? 'Unknown manufacturer (not in bundled OUI data)'}
                </div>
              </div>
              <div className="text-right font-mono text-xs text-slate-600 dark:text-slate-300 tabular-nums">
                OUI Prefix: {result.normalizedPrefix}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Transmission Type</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {result.isMulticast ? 'Multicast (bit 0 = 1)' : 'Unicast (bit 0 = 0)'}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block">Administration Bit</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {result.isLocallyAdministered
                    ? 'Locally Administered / Randomized MAC (bit 1 = 1)'
                    : 'Universally Administered IEEE OUI (bit 1 = 0)'}
                </span>
              </div>
            </div>

            {result.isLocallyAdministered && !result.vendor && (
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Note: The second hex character indicates a locally administered or privacy-randomized address, which typically has no hardware vendor assignment.
              </p>
            )}
          </div>
        ) : looksLikePartialHex ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-5 text-xs text-slate-600 dark:text-slate-300">
            Enter at least 6 hex digits (3 octets, e.g. <code className="font-mono">A4:83:E7</code>) to match an OUI manufacturer prefix.
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                Bundled OUI Vendor Search Results
              </span>
              <span className="text-slate-500 tabular-nums">{result.matches.length} matches</span>
            </div>
            {result.matches.length === 0 ? (
              <div className="p-5 text-xs text-slate-600 dark:text-slate-300">
                Unknown manufacturer (not in bundled OUI data).
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800 max-h-72 overflow-auto">
                {result.matches.map((m) => (
                  <div
                    key={m.prefix}
                    className="px-4 py-2.5 flex items-center justify-between gap-4 text-xs"
                  >
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-100 tabular-nums">
                      {m.prefix}
                    </span>
                    <span className="text-slate-600 dark:text-slate-300 text-right">{m.vendor}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function TrademarkClassFinderWorkspace({tool}: Props) {
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Goods' | 'Services'>('all');

  const filteredClasses = useMemo(() => {
    const tokens = query
      .toLowerCase()
      .split(/[\s,;/]+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 2 || /^\d+$/.test(t));

    return NICE_CLASSES.filter((entry) =>
      typeFilter === 'all' ? true : entry.type === typeFilter,
    )
      .map((entry) => ({
        entry,
        score: scoreNiceClass(entry, tokens),
      }))
      .filter(({score}) => (tokens.length === 0 ? true : score > 0))
      .sort((a, b) =>
        tokens.length === 0
          ? a.entry.classNumber - b.entry.classNumber
          : b.score - a.score || a.entry.classNumber - b.entry.classNumber,
      );
  }, [query, typeFilter]);

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-[18px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80">
        <div className="flex items-center gap-2.5">
          <Scale className="h-5 w-5 text-[#0A8CFF]" />
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">{tool.name}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Nice Classification (45 classes: 1–34 Goods, 35–45 Services) · Guide only, not legal advice
            </p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 px-4 py-3 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
          <div>
            <span className="font-semibold">Guide only — NOT legal advice:</span> Use this offline Nice Classification index as a preliminary reference to browse Classes 1–45. Always consult a qualified trademark attorney or official national registry before filing.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe goods or services (e.g. mobile app, t-shirts, coffee shop, 42)..."
              className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:border-[#0A8CFF] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl shrink-0">
            {(
              [
                {id: 'all', label: 'All (45)'},
                {id: 'Goods', label: 'Goods (1–34)'},
                {id: 'Services', label: 'Services (35–45)'},
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTypeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  typeFilter === tab.id
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Common lookups:</span>
          {NICE_QUICK_QUERIES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setQuery(example);
                setTypeFilter('all');
              }}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/70 hover:border-[#0A8CFF] px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
            >
              {example}
            </button>
          ))}
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs font-semibold text-[#0A8CFF] hover:underline ml-auto cursor-pointer"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
          Showing {filteredClasses.length} of {NICE_CLASSES.length} Nice Classification classes
        </div>

        {filteredClasses.length === 0 ? (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 p-6 text-center space-y-2">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              No Nice classes matched &ldquo;{query}&rdquo;
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Try broader everyday terms like &ldquo;software&rdquo;, &ldquo;clothing&rdquo;, &ldquo;food&rdquo;, or &ldquo;consulting&rdquo;.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[540px] overflow-y-auto">
            {filteredClasses.map(({entry}) => (
              <div key={entry.classNumber} className="p-4 bg-white dark:bg-slate-900 space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <div className="text-sm font-bold text-slate-900 dark:text-white tabular-nums">
                    Class {entry.classNumber}: {entry.heading}
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {entry.type} · Nice {entry.classNumber}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {entry.description}
                </p>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
                  Terms: {entry.keywords.slice(0, 7).join(' · ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
