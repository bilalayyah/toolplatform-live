import type { ToolGuide } from './tools';

export const COMPRESS_PDF_GUIDE: ToolGuide = {
  howItWorks: {
    heading: 'How Compress PDF Works',
    paragraphs: [
      'Modern PDF documents are structured as complex hierarchical trees containing indirect objects, embedded font descriptors, structural dictionaries, and binary data streams. Over successive revisions, edits, and exports from office software, files accumulate duplicate resource dictionaries, redundant structural markup, and uncompressed cross-reference tables that inflate overall file size without contributing any visible quality to the rendered document pages.',
      'Compress PDF executes an in-memory optimization pipeline powered by browser WebAssembly. Rather than altering visual geometry or rasterizing typography, the engine parses document trees and repacks distinct indirect objects into Flate-compressed streams. This consolidation removes redundant definitions and unreferenced revision baggage while preserving vector fonts, line art, and form elements.',
      'Because the entire optimization pipeline runs locally within your browser tab sandbox, confidential contracts, financial statements, and personal records never travel over an external computer network. Processing speed depends entirely on your local device hardware, allowing rapid multi-file compression without server queuing bottlenecks, email submission requirements, or daily bandwidth allowances.',
    ],
    steps: [
      {
        number: '01',
        title: 'Binary Structure Parsing',
        description:
          'The engine loads your selected PDF bytes into browser memory, systematically scanning the document catalog, pages tree, and indirect object reference tables.',
      },
      {
        number: '02',
        title: 'Object Stream Consolidation',
        description:
          'Loose structural objects, font descriptors, and metadata dictionaries are consolidated into unified, modern compressed object stream containers.',
      },
      {
        number: '03',
        title: 'Redundant Data Removal',
        description:
          'Unreferenced historical revision markers, orphaned trailer dictionaries, and duplicate stream headers are safely detached from the document tree.',
      },
      {
        number: '04',
        title: 'Optimized PDF Serialization',
        description:
          'The streamlined binary stream is serialized into a standards-compliant PDF file and delivered immediately to your device as a local download.',
      },
    ],
    referenceLine:
      'Technical Reference: ISO 32000-1 specification defines cross-reference object stream compaction as the universal standard for modern document interchange and archival efficiency.',
  },
  choiceSection: {
    heading: 'Which PDFs Compress Well?',
    paragraphs: [
      'Compression outcomes depend directly on source document structure. Files exported from word processors or spreadsheets contain extensive layout markup, font tables, and uncompressed reference data. Reorganizing these elements into compact streams yields noticeable byte savings without modifying a single visible word, number, or column boundary.',
      'Conversely, PDF files constructed primarily from high-resolution scanner images or pre-optimized photo albums behave differently. Because scanner photographs and digital snapshots are already stored as compressed image streams inside the document container, restructuring outer PDF objects produces modest gains. Container-level stream optimization does not downsample underlying image resolutions or discard image color data.',
      'Architectural drawings, contracts, research papers, and slide presentations benefit significantly from stream compression. These document types frequently contain recurring headers, styling palettes, and duplicate font references across pages. Repacking them into centralized streams eliminates multi-page redundancy while preserving sharp, zoomable lines and selectable text.',
      'Examine the comparison table below to determine whether container stream optimization aligns with your specific document structure or whether companion conversion, page extraction, or image compression utilities provide a more suitable solution for your distribution channel.',
    ],
    table: {
      title: 'PDF Document Type Compression Suitability',
      headers: ['PDF Document Category', 'Compression Potential', 'Key Consideration'],
      rows: [
        {
          col1: 'Digital Word & Text Reports',
          col2: 'High Potential',
          col3: 'Vector text and fonts stay crisp with zero character distortion.',
        },
        {
          col1: 'Exported Slide Presentations',
          col2: 'High Potential',
          col3: 'Consolidates repeating page layouts and recurring master templates.',
        },
        {
          col1: 'Multi-Page Financial Invoices',
          col2: 'Moderate to High',
          col3: 'Table borders, alignment, and numeric data remain mathematically exact.',
        },
        {
          col1: 'Fillable Government & Job Forms',
          col2: 'Moderate Potential',
          col3: 'Interactive form fields, checkboxes, and buttons remain fully functional.',
        },
        {
          col1: 'Vector CAD & Technical Blueprints',
          col2: 'Moderate Potential',
          col3: 'High-precision coordinate paths and diagram layers are fully preserved.',
        },
        {
          col1: 'Pre-Optimized PDF Archives',
          col2: 'Low Potential',
          col3: 'Files previously processed by modern compressors yield minimal space recovery.',
        },
        {
          col1: 'Scanned Paper Document Batches',
          col2: 'Low to Modest',
          col3: 'Full-page raster scans are stored as images; pixel data is not downsampled.',
        },
        {
          col1: 'Image-Heavy Digital Portfolios',
          col2: 'Low to Modest',
          col3: 'Embedded photograph resolutions are maintained without lossy degradation.',
        },
      ],
    },
    inlineLinksNote:
      'Depending on your document structure, consider combining compression with our dedicated browser companion utilities:',
    inlineLinks: [
      { slug: 'merge-pdf', label: 'Merge PDF for combining reports' },
      { slug: 'split-pdf', label: 'Split PDF for extracting chapters' },
      { slug: 'pdf-to-word', label: 'PDF to Word for text editing' },
      { slug: 'compress-image', label: 'Compress Image for photos' },
      { slug: 'pdf-to-jpg', label: 'PDF to JPG for slide extraction' },
      { slug: 'rotate-pdf', label: 'Rotate PDF for page alignment' },
      { slug: 'sign-pdf', label: 'Sign PDF for electronic signatures' },
      { slug: 'unlock-pdf', label: 'Unlock PDF for password removal' },
    ],
  },
  examples: {
    heading: 'Compress PDF Examples',
    intro:
      'Streamlining PDF file size resolves frequent distribution hurdles where email servers or administrative portals impose strict upload caps. Here are six realistic document scenarios where local browser compression eliminates submission roadblocks:',
    items: [
      {
        title: 'Corporate Earnings Report',
        scenario:
          'A forty-page financial report with recurring spreadsheet tables and font metrics.',
        note: 'Removes duplicate table definitions so documents attach easily to email threads.',
      },
      {
        title: 'Commercial Lease Agreement',
        scenario:
          'A multi-page lease contract with exhibits, floor plans, and drafting revisions.',
        note: 'Cleans out unreferenced drafting revisions while keeping legal text razor-sharp.',
      },
      {
        title: 'University Thesis Paper',
        scenario:
          'An academic thesis with vector diagrams, mathematical formulas, and footnotes.',
        note: 'Compacts structural dictionaries to meet digital repository thresholds.',
      },
      {
        title: 'Technical Product Manual',
        scenario:
          'A multi-chapter product handbook featuring procedural steps and diagrams.',
        note: 'Reduces object overhead so field technicians can open manuals quickly.',
      },
      {
        title: 'Government Permit Dossier',
        scenario:
          'A municipal filing compiled from zoning statements and public records.',
        note: 'Assists in satisfying municipal portal upload criteria without visual loss.',
      },
      {
        title: 'Monthly Customer Invoices',
        scenario:
          'Archived billing statements containing repeated company headers and styling tags.',
        note: 'Streamlines cross-reference tables to trim ongoing digital archive volume.',
      },
    ],
  },
  limitsSection: {
    heading: 'Where Compress PDF Works — and Where It Does Not Fit',
    paragraphs: [
      'Compress PDF is engineered specifically for digital-first documents generated by desktop publishing software, word processors, accounting packages, and vector illustration tools. If your document features selectable text strings, structural tables, font descriptors, or mathematical line drawings, stream reorganization delivers immediate container efficiency. It represents the optimal utility when you require a lighter file size without compromising typography or layout integrity.',
      'Recognizing operational boundaries is equally essential for efficient document management. The browser engine operates on lossless container-level optimizations and does not perform lossy image downsampling or optical character recognition. When a PDF file consists entirely of photographic snapshots or uncompressed flatbed scanner images, restructuring structural containers produces minimal space reduction because underlying pixel matrices remain untouched.',
      'Password-protected and cryptographically secured files cannot be restructured until user authentication has been completed. The browser engine honors standardized document security safeguards and will not manipulate encrypted byte streams without valid authorization. To optimize an encrypted document, first remove protection using Unlock PDF, execute stream compression, and subsequently restore security using Protect PDF.',
      'Furthermore, individual files exceeding fifty megabytes or files with corrupted internal reference hierarchies should not be forced through browser memory. Hardware memory limits across mobile devices establish rigorous runtime constraints. Consult the operational reference table below to ensure successful document processing.',
    ],
    table: {
      title: 'Compress PDF Technical Boundaries and Operating Parameters',
      headers: ['Operating Parameter', 'Technical Specification and Rule'],
      rows: [
        {
          col1: 'Maximum File Size Limit',
          col2: 'Fifty megabytes (50 MB) per individual uploaded document.',
        },
        {
          col1: 'Batch Processing Limit',
          col2: 'Up to five (5) documents simultaneously in a single session.',
        },
        {
          col1: 'Supported Input Format',
          col2: 'Standard PDF files (.pdf extension only).',
        },
        {
          col1: 'Data Privacy & Execution',
          col2: 'One hundred percent in-browser memory execution; zero network transfers.',
        },
        {
          col1: 'Raster Image Downsampling',
          col2: 'Not performed; embedded photo DPI and color depth are fully preserved.',
        },
        {
          col1: 'Encrypted & Locked PDFs',
          col2: 'Must be unlocked with authorized password prior to optimization.',
        },
        {
          col1: 'Document Content Alteration',
          col2: 'Zero text reflow, editing, optical character recognition, or page deletion.',
        },
      ],
    },
  },
  useCases: {
    heading: 'What People Use Compress PDF For',
    intro:
      'Streamlining document file weight resolves common technical obstacles encountered across professional, academic, and personal administrative routines. Users rely on client-side compression for these six primary workflows:',
    items: [
      'Passing Email Attachment Thresholds: Trimming bulky corporate agreements and proposals so documents pass through strict email gateways and attachment constraints.',
      'Fulfilling Employment Portal Criteria: Compacting comprehensive resumes, reference letters, and career dossiers to satisfy job application submission portals.',
      'Speeding Up Mobile Reading: Reducing document byte volume so remote customers and field teams can load catalogs and guides swiftly over cellular networks.',
      'Safeguarding Sensitive Corporate Records: Optimizing private balance sheets, audit trails, and tax filings on local hardware without uploading records to remote cloud servers.',
      'Complying with Regulatory Portal Limits: Preparing legal briefs, public filings, and tender documents to satisfy official digital filing upload thresholds.',
      'Conserving Local Storage Footprint: Archiving thousands of monthly invoices and statement receipts on local drives without losing searchable text or vector clarity.',
    ],
  },
  tips: {
    heading: 'Tips for Smaller PDFs That Stay Readable',
    items: [
      {
        lead: 'Export Directly from Source:',
        text: 'Generate PDF documents directly from your authoring software rather than scanning printed sheets to preserve clean vector text and compact stream structures.',
      },
      {
        lead: 'Enable Font Subsetting:',
        text: 'Configure your publishing software to embed font subsets so only the characters actually used in the document are stored in the file dictionary.',
      },
      {
        lead: 'Remove Unneeded Pages First:',
        text: 'Utilize Split PDF to extract only the vital chapters or appendices before compressing multi-volume documentation.',
      },
      {
        lead: 'Compress Embedded Graphics Early:',
        text: 'Pre-process standalone illustrations using Compress Image before inserting them into document drafts to eliminate unnecessary image bloat.',
      },
      {
        lead: 'Configure Scanner Resolutions Wisely:',
        text: 'When scanning physical documentation, select standard business resolution rather than photo quality to avoid creating giant bitmap pages.',
      },
      {
        lead: 'Check Pre-Existing Optimization:',
        text: 'Inspect documents exported from modern publication engines; files that are already tightly packed will naturally experience modest additional reduction.',
      },
    ],
  },
  troubleshooting: {
    heading: 'Compress PDF Not Working? Fix It Here',
    items: [
      {
        problem: 'File Exceeds Fifty Megabytes:',
        solution:
          'The browser engine enforces a strict 50 MB ceiling to prevent device memory exhaustion. Split large documents into smaller parts using Split PDF before running compression.',
      },
      {
        problem: 'File Size Barely Changes After Processing:',
        solution:
          'Documents that have already been optimized or files consisting primarily of pre-compressed photographs contain little container overhead to eliminate.',
      },
      {
        problem: 'Scanned Document Remains Unusually Large:',
        solution:
          'Scanned pages are saved as full-page bitmap pictures. Container stream compression does not downsample image pixels; reduce scan resolution at the scanner source.',
      },
      {
        problem: 'Browser Tab Freezes on Execution:',
        solution:
          'Extremely complex documents with thousands of objects can overwhelm available device RAM. Close unused background tabs and process files one at a time.',
      },
      {
        problem: 'Password-Protected PDF Fails to Process:',
        solution:
          'Encrypted documents block stream reorganization. Authenticate and remove security using Unlock PDF before applying stream optimization.',
      },
      {
        problem: 'Download Fails to Start Automatically:',
        solution:
          'Aggressive browser extensions or strict download permissions can block generated file transfers. Check your browser download bar or grant download access.',
      },
    ],
  },
  moreTools: {
    heading: 'More PDF Tools on ToolPlatform',
    intro:
      'Comprehensive document administration frequently involves multiple specialized steps. ToolPlatform provides dedicated browser-based utilities to help you assemble, reorganize, and convert files with complete privacy and zero server uploads:',
    tools: [
      {
        slug: 'merge-pdf',
        name: 'Merge PDF',
        reason:
          'Combine multiple standalone reports, exhibits, and statement sheets into a single organized document.',
      },
      {
        slug: 'split-pdf',
        name: 'Split PDF',
        reason:
          'Extract specific chapters, isolate key agreements, or remove unneeded pages prior to distribution.',
      },
      {
        slug: 'pdf-to-word',
        name: 'PDF to Word',
        reason:
          'Extract tabular numbers, lists, and formatted paragraphs into editable Word DOCX documents for revision.',
      },
      {
        slug: 'compress-image',
        name: 'Compress Image',
        reason:
          'Reduce standalone JPEG and PNG photograph file sizes before inserting them into document publications.',
      },
    ],
  },
};
