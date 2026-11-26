import {SITE_CONFIG} from '../config/site';
import type {Tool} from './tools';

export const DOCUMENT_TOOLS: readonly Tool[] = [
  {
    id: 'document-receipt-generator',
    name: 'Receipt Generator',
    slug: 'document-receipt-generator',
    category: 'document-tools',
    url: '/document-receipt-generator',
    description:
      'Build template-based payment receipts with number, date, items, and payment method—download PDF/PNG or print (not AI).',
    longDescription:
      'Format neat payment receipts with receipt number, date, itemized entries, payment method, and payer/payee details using structured browser templates (NOT AI). Totals calculate automatically, and you can print or download clean PDF or PNG copies with zero watermarks.',
    keywords: [
      'receipt generator',
      'payment receipt pdf png',
      'print receipt',
      'template receipt not ai',
    ],
    icon: 'Receipt',
    acceptedFormats: ['PDF', 'PNG', 'Print'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Receipt Generator — PDF & PNG | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Create payment receipts with receipt number, date, items, and payment method using browser templates (NOT AI). Download PDF/PNG or print.',
    howTo: [
      {
        title: 'Fill receipt & payment details',
        description:
          'Enter receipt number, date, business name, line items, and payment method.',
      },
      {
        title: 'Preview structured template',
        description:
          'Browser layout templates calculate totals cleanly without AI or account login.',
      },
      {
        title: 'Download PDF, PNG, or print',
        description:
          'Export an unwatermarked PDF or PNG file, or print straight from your browser.',
      },
    ],
    faqs: [
      {
        question: 'Does Receipt Generator use AI?',
        answer:
          'No. Receipts render deterministically from structured layout templates and your entered figures—NOT AI.',
      },
      {
        question: 'Which export options are included?',
        answer:
          'You can download as PDF, download as PNG, or print directly.',
      },
      {
        question: 'Will receipts carry a platform watermark?',
        answer:
          'No. Every Document Tool exports completely watermark-free.',
      },
      {
        question: 'Is any account or upload required?',
        answer:
          'No. All form entries stay inside your browser.',
      },
    ],
    relatedTools: [
      'document-invoice-generator',
      'document-bill-generator',
      'document-quote-generator',
      'merge-pdf',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'document-certificate-generator',
    name: 'Certificate Generator',
    slug: 'document-certificate-generator',
    category: 'document-tools',
    url: '/document-certificate-generator',
    description:
      'Design achievement, completion, or appreciation certificates with 4 templates, logo, and colours—download clean PDF (not AI).',
    longDescription:
      'Produce printable achievement, course completion, or appreciation certificates right in your browser from 4 curated layout templates (NOT AI). Upload an optional organization logo, pick accent colours, customize recipient/issuer names, and download a crisp PDF with zero watermarks.',
    keywords: [
      'certificate generator',
      'completion achievement certificate',
      '4 certificate templates pdf',
      'template certificate not ai',
    ],
    icon: 'Award',
    acceptedFormats: ['PDF', 'PNG/JPG Logo'],
    maxFileSizeMB: null,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Certificate Generator — 4 PDF Templates | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Create achievement, completion, and appreciation certificates with 4 browser templates, logo, and colours (NOT AI). Download clean PDF.',
    howTo: [
      {
        title: 'Pick one of 4 templates',
        description:
          'Choose achievement, completion, or appreciation styling from 4 browser templates (NOT AI).',
      },
      {
        title: 'Add logo, colours & recipient',
        description:
          'Set accent colours, insert your logo locally, and fill recipient, award title, date, and issuer.',
      },
      {
        title: 'Download printable PDF',
        description:
          'Export a crisp, unwatermarked certificate PDF directly inside your browser.',
      },
    ],
    faqs: [
      {
        question: 'How many templates are included in Certificate Generator?',
        answer:
          'It includes 4 built-in templates tailored for achievement, completion, and appreciation certificates.',
      },
      {
        question: 'Does Certificate Generator use AI artwork or copy?',
        answer:
          'No. All 4 layouts and fields are deterministic templates customized with your own text, colours, and logo—NOT AI.',
      },
      {
        question: 'Will exported certificate PDFs have a watermark?',
        answer:
          'No. Every Document Tool exports watermark-free.',
      },
      {
        question: 'Does adding a logo upload my image to a server?',
        answer:
          'No. Logos render locally in your browser during PDF generation.',
      },
    ],
    relatedTools: [
      'document-letter-generator',
      'document-proposal-generator',
      'sign-pdf',
      'create-pdf',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'document-letter-generator',
    name: 'Letter Generator',
    slug: 'document-letter-generator',
    category: 'document-tools',
    url: '/document-letter-generator',
    description:
      'Format formal, business, or informal letters cleanly with addresses, date, subject, greeting, body, and closing (not AI).',
    longDescription:
      'Lay out properly spaced letters using structured formatting templates (NOT AI) across formal, business, and informal styles. Fill sender/recipient addresses, date, subject line, greeting, body paragraphs, and sign-off—then copy, print, or save cleanly inside your browser.',
    keywords: [
      'letter generator',
      'formal business informal letter',
      'letter formatting template not ai',
      'address subject greeting letter',
    ],
    icon: 'Mail',
    acceptedFormats: ['PDF', 'Text', 'Print'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Letter Generator — Formal & Business | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Format formal, business, and informal letters with addresses, date, subject, greeting, body, and closing via templates (NOT AI).',
    howTo: [
      {
        title: 'Pick formal, business, or informal',
        description:
          'Select your letter style and enter sender and recipient address blocks.',
      },
      {
        title: 'Fill subject, greeting, body & closing',
        description:
          'Structured browser templates arrange margins, date, subject, and sign-off cleanly (NOT AI).',
      },
      {
        title: 'Export or print cleanly',
        description:
          'Download an unwatermarked PDF or print straight from your browser tab.',
      },
    ],
    faqs: [
      {
        question: 'Does Letter Generator write the letter with AI?',
        answer:
          'No. It arranges your entered sender/recipient addresses, date, subject, greeting, body, and closing using clean formatting templates—NOT AI.',
      },
      {
        question: 'Which letter styles are supported?',
        answer:
          'Formal, business, and informal letter layouts are included.',
      },
      {
        question: 'Are letter contents uploaded or logged?',
        answer:
          'No. Everything stays private inside your browser.',
      },
      {
        question: 'Can I sign the PDF afterwards?',
        answer:
          'Yes. Pair with Sign PDF to add a basic electronic signature.',
      },
    ],
    relatedTools: [
      'document-contract-generator',
      'document-proposal-generator',
      'document-certificate-generator',
      'sign-pdf',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'document-contract-generator',
    name: 'Contract Generator',
    slug: 'document-contract-generator',
    category: 'document-tools',
    url: '/document-contract-generator',
    description:
      'Assemble template agreements like NDAs with both parties, effective date, and custom clauses; print/PDF—not legal advice (not AI).',
    longDescription:
      'Structure simple written agreements—such as a mutual NDA or basic service agreement—from editable browser templates (NOT AI). Fill both parties’ names/addresses, effective date, and your own clauses, then print to sign or download PDF. Disclaimer: templates are general documents only, not legal advice.',
    keywords: [
      'contract generator',
      'nda agreement template',
      'simple contract pdf',
      'not legal advice template not ai',
    ],
    icon: 'FileSignature',
    acceptedFormats: ['PDF', 'Print'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Contract Generator — Agreement Templates | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build general agreement templates like NDAs with both parties, effective date, and clauses (NOT AI, not legal advice). Download PDF or print.',
    howTo: [
      {
        title: 'Enter party names & effective date',
        description:
          'Pick a starter template (such as NDA) and fill both parties and the effective date.',
      },
      {
        title: 'Customize your own clauses',
        description:
          'Edit or add agreement clauses deterministically inside browser templates (NOT AI).',
      },
      {
        title: 'Download PDF or print to sign',
        description:
          'Save an unwatermarked PDF or print directly—templates are general documents, not legal advice.',
      },
    ],
    faqs: [
      {
        question: 'Do Contract Generator templates count as legal advice?',
        answer:
          'No. Templates are general document starters only and are NOT legal advice. Consult a qualified lawyer for legal review.',
      },
      {
        question: 'Does Contract Generator use AI?',
        answer:
          'No. It populates static document templates strictly from your own parties, dates, and clauses—NOT AI.',
      },
      {
        question: 'Can we print to sign or save as PDF?',
        answer:
          'Yes. Clean PDF download and browser printing are both included.',
      },
      {
        question: 'Are private agreement details uploaded?',
        answer:
          'No. Everything runs locally in your browser.',
      },
    ],
    relatedTools: [
      'document-proposal-generator',
      'document-letter-generator',
      'sign-pdf',
      'document-invoice-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'document-proposal-generator',
    name: 'Proposal Generator',
    slug: 'document-proposal-generator',
    category: 'document-tools',
    url: '/document-proposal-generator',
    description:
      'Build structured project proposals with executive summary, services/prices, timeline, and terms—download PDF (not AI).',
    longDescription:
      'Package client project pitches cleanly with dedicated sections for executive summary, itemized services & pricing totals, project timeline milestones, and payment terms using browser layout templates (NOT AI). Download a crisp watermark-free PDF directly in your browser.',
    keywords: [
      'proposal generator',
      'project proposal pdf',
      'services timeline pricing proposal',
      'template proposal not ai',
    ],
    icon: 'Briefcase',
    acceptedFormats: ['PDF', 'Print'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Proposal Generator — Project PDF | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Assemble project proposals with executive summary, services/prices, timeline, and terms using browser templates (NOT AI). Download PDF.',
    howTo: [
      {
        title: 'Enter summary & client details',
        description:
          'Add your executive summary, client name, and proposal date.',
      },
      {
        title: 'Add services, prices & timeline',
        description:
          'List deliverables, pricing line items, project phases, and terms inside structured templates (NOT AI).',
      },
      {
        title: 'Download watermark-free PDF',
        description:
          'Export a clean project proposal PDF directly in your browser.',
      },
    ],
    faqs: [
      {
        question: 'Does Proposal Generator write proposals with AI?',
        answer:
          'No. You provide your executive summary, services, prices, timeline, and terms—the tool formats them via templates (NOT AI).',
      },
      {
        question: 'Are line-item prices totalled automatically?',
        answer:
          'Yes. Service costs sum automatically in your browser.',
      },
      {
        question: 'Can I save the output as a PDF with no watermark?',
        answer:
          'Yes. Exports are crisp PDFs with zero watermarks.',
      },
      {
        question: 'Need a quick price quote instead of a full proposal?',
        answer:
          'Use Quote Generator for concise line-item price quotations.',
      },
    ],
    relatedTools: [
      'document-quote-generator',
      'document-contract-generator',
      'document-invoice-generator',
      'document-letter-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'document-quote-generator',
    name: 'Quote Generator',
    slug: 'document-quote-generator',
    category: 'document-tools',
    url: '/document-quote-generator',
    description:
      'Create template price quotations with line items, discount, tax, validity date, and calculated totals—download PDF or print (not AI).',
    longDescription:
      'Prepare accurate client price estimates in minutes with itemized quantities, unit prices, discount percentage/amount, tax rate, validity expiry date, and terms—totals calculate cleanly in your browser using structured templates (NOT AI). Download PDF or print with zero watermarks.',
    keywords: [
      'quote generator',
      'price quotation pdf',
      'discount tax validity quote',
      'template quote not ai',
    ],
    icon: 'FileSpreadsheet',
    acceptedFormats: ['PDF', 'Print'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Quote Generator — Price Quotation PDF | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Generate price quotations with line items, discount, tax, validity date, and calculated totals using templates (NOT AI). Download PDF or print.',
    howTo: [
      {
        title: 'Add quote header & validity date',
        description:
          'Enter business/client info, quote reference, and validity date.',
      },
      {
        title: 'Enter line items, discount & tax',
        description:
          'Subtotals, discounts, taxes, and grand total calculate automatically from your template inputs (NOT AI).',
      },
      {
        title: 'Download PDF or print',
        description:
          'Export an unwatermarked PDF quotation or print directly from your browser.',
      },
    ],
    faqs: [
      {
        question: 'Does Quote Generator calculate discounts and tax automatically?',
        answer:
          'Yes. Subtotal, discount, tax, and grand total update instantaneously as you edit rows.',
      },
      {
        question: 'Does it use AI to estimate prices?',
        answer:
          'No. You enter exact rates and terms manually inside structured browser templates—NOT AI.',
      },
      {
        question: 'Can I set a quote validity date and custom terms?',
        answer:
          'Yes. Both validity expiry date and terms/notes fields are built in.',
      },
      {
        question: 'Will exported quotes include a watermark?',
        answer:
          'No. All Document Tools export watermark-free.',
      },
    ],
    relatedTools: [
      'document-invoice-generator',
      'document-bill-generator',
      'document-proposal-generator',
      'document-receipt-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'document-bill-generator',
    name: 'Bill Generator',
    slug: 'document-bill-generator',
    category: 'document-tools',
    url: '/document-bill-generator',
    description:
      'Generate simple currency-neutral bills with business details, optional GSTIN, customer, items, and tax—print or save PDF (not AI).',
    longDescription:
      'Assemble clean everyday bills in your browser with business details, optional GSTIN/tax ID field, customer details, itemized rows, and configurable tax rate. Totals calculate automatically, and the layout is completely currency-neutral (pick any symbol/code)—print or save watermark-free PDF (NOT AI).',
    keywords: [
      'bill generator',
      'gstin bill maker',
      'currency neutral bill pdf',
      'print save bill not ai',
    ],
    icon: 'FileText',
    acceptedFormats: ['PDF', 'Print'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Bill Generator — Simple Printable Bills | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Create currency-neutral bills with business details, GSTIN, customer, line items, and tax using templates (NOT AI). Print or save PDF.',
    howTo: [
      {
        title: 'Enter business, GSTIN & customer',
        description:
          'Fill business details, optional GSTIN, customer info, and your currency symbol.',
      },
      {
        title: 'Add items & tax rate',
        description:
          'Browser formulas sum line items and tax rate cleanly inside structured templates (NOT AI).',
      },
      {
        title: 'Print or save clean PDF',
        description:
          'Print directly or download a watermark-free PDF copy.',
      },
    ],
    faqs: [
      {
        question: 'Is Bill Generator locked to one currency?',
        answer:
          'No. It is completely currency-neutral—type any currency symbol or code you need.',
      },
      {
        question: 'Does it support an optional GSTIN field?',
        answer:
          'Yes. You can fill in a GSTIN or tax ID field or leave it blank when not needed.',
      },
      {
        question: 'Does Bill Generator use AI?',
        answer:
          'No. Arithmetic and document formatting run from deterministic browser templates—NOT AI.',
      },
      {
        question: 'Need a branded invoice with logo upload and due date?',
        answer:
          'Use Invoice Generator under Document Tools.',
      },
    ],
    relatedTools: [
      'document-invoice-generator',
      'document-receipt-generator',
      'document-quote-generator',
      'finance-gst-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'document-invoice-generator',
    name: 'Invoice Generator',
    slug: 'document-invoice-generator',
    category: 'document-tools',
    url: '/document-invoice-generator',
    description:
      'Create currency-neutral invoices with logo, client details, line items, tax rate, and due date—print or save PDF (not AI).',
    longDescription:
      'Build crisp, professional client invoices in your browser using structured templates (NOT AI): upload an optional business logo locally, set any currency symbol/code, add client billing info, invoice number, due date, itemized rows, and tax rate. Totals compute automatically—print or save a clean watermark-free PDF.',
    keywords: [
      'invoice generator',
      'currency neutral invoice pdf',
      'logo invoice tax due date',
      'template invoice not ai',
    ],
    icon: 'FileSpreadsheet',
    acceptedFormats: ['PDF', 'Print', 'PNG/JPG Logo'],
    maxFileSizeMB: null,
    maxFiles: 1,
    processingMethod: 'browser',
    seoTitle: `Invoice Generator — Free PDF Invoices | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Build currency-neutral invoices with logo, client details, line items, tax rate, and due date (NOT AI). Print or save clean PDF.',
    howTo: [
      {
        title: 'Add logo, currency & client details',
        description:
          'Pick any currency symbol, optionally add your logo locally, and fill client + due date fields.',
      },
      {
        title: 'Enter line items and tax rate',
        description:
          'Subtotals, tax, and invoice balance calculate deterministically inside browser templates (NOT AI).',
      },
      {
        title: 'Print or save PDF',
        description:
          'Download a clean, unwatermarked PDF invoice or print straight from your browser.',
      },
    ],
    faqs: [
      {
        question: 'Is Invoice Generator currency-neutral?',
        answer:
          'Yes. Type any currency symbol or code (USD, EUR, GBP, INR, AUD, etc.) and amounts format accordingly.',
      },
      {
        question: 'Does Invoice Generator use AI or add a watermark?',
        answer:
          'No AI and no watermark—invoices render deterministically from your inputs inside your browser.',
      },
      {
        question: 'Are client names or invoice totals uploaded to a server?',
        answer:
          'No. Logos, line items, and PDF export run locally in your browser.',
      },
      {
        question: 'Can I generate an accompanying payment receipt later?',
        answer:
          'Yes. Use Receipt Generator once an invoice has been paid.',
      },
    ],
    relatedTools: [
      'document-bill-generator',
      'document-quote-generator',
      'document-receipt-generator',
      'document-proposal-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
];
