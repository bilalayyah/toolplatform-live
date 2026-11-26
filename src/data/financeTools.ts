import {SITE_CONFIG} from '../config/site';
import type {Tool} from './tools';

export const FINANCE_TOOLS: readonly Tool[] = [
  {
    id: 'finance-gst-calculator',
    name: 'GST Calculator',
    slug: 'finance-gst-calculator',
    category: 'finance-tools',
    url: '/finance-gst-calculator',
    description:
      'India-specific Indian GST calculator: add GST or extract included GST at any slab rate with CGST/SGST split in your browser.',
    longDescription:
      'Add Indian Goods and Services Tax (GST) to a base price or reverse-extract GST already included in a MRP price at any rate (5%, 12%, 18%, 28%, or custom), displaying the 50/50 CGST and SGST breakdown instantaneously. Note honestly: this is India-specific for Indian GST rules.',
    keywords: [
      'gst calculator',
      'indian gst calculator',
      'add remove gst',
      'cgst sgst split',
      'india specific gst',
    ],
    icon: 'Percent',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `GST Calculator (India) — CGST/SGST | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'India-specific Indian GST calculator: add GST or extract included GST at any slab rate with instant CGST/SGST split.',
    howTo: [
      {
        title: 'Choose Add or Extract GST',
        description:
          'Once live, pick whether your amount is pre-tax (GST exclusive) or tax-included (GST inclusive).',
      },
      {
        title: 'Pick Indian GST rate',
        description:
          'Select 5%, 12%, 18%, 28%, or enter a custom rate for Indian GST calculations.',
      },
      {
        title: 'Read CGST, SGST & total',
        description:
          'Inspect net price, total GST, 50/50 CGST/SGST split, and gross total.',
      },
    ],
    faqs: [
      {
        question: 'Is this GST Calculator specific to one country?',
        answer:
          'Yes—honest notice: this calculator is India-specific for Indian GST (including CGST + SGST split), though custom percentage extraction works arithmetically.',
      },
      {
        question: 'How does extracting GST included in a price work?',
        answer:
          'It divides the gross price by (1 + rate/100) to isolate the exact base amount and embedded GST.',
      },
      {
        question: 'Does it show the CGST and SGST breakdown?',
        answer:
          'Yes. Total GST splits cleanly into equal 50% CGST and 50% SGST components for intra-state supply.',
      },
      {
        question: 'Need to issue an itemized bill or invoice?',
        answer:
          'Use Bill Generator or Invoice Generator under Document Tools.',
      },
    ],
    relatedTools: [
      'finance-income-tax-calculator',
      'finance-salary-calculator',
      'finance-discount-calculator',
      'document-bill-generator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'finance-income-tax-calculator',
    name: 'Income Tax Calculator',
    slug: 'finance-income-tax-calculator',
    category: 'finance-tools',
    url: '/finance-income-tax-calculator',
    description:
      'India-specific income-tax calculator comparing New vs Old regime for FY 2025–26 & 2026–27 with ₹75,000 deduction, 87A, surcharge & 4% cess.',
    longDescription:
      'Compare Indian Income Tax under the New vs Old tax regimes for FY 2025–26 and FY 2026–27 in your browser, incorporating the ₹75,000 standard deduction, Section 87A rebate rules, applicable surcharge tiers, and 4% Health & Education Cess. Note honestly: this is India-specific for Indian income-tax slabs only.',
    keywords: [
      'income tax calculator',
      'indian income tax slabs',
      'new vs old regime fy 2025-26 2026-27',
      '75000 standard deduction 87a',
      '4 percent cess surcharge',
    ],
    icon: 'Landmark',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Income Tax Calculator (India FY 2025–27) | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'India-specific Indian income-tax calculator comparing New vs Old regime for FY 2025–26 & 2026–27 (₹75,000 std deduction, 87A, surcharge, 4% cess).',
    howTo: [
      {
        title: 'Pick financial year (FY 2025–26 / 2026–27)',
        description:
          'Once live, choose the Indian financial year and enter gross annual income.',
      },
      {
        title: 'Add Old-Regime deductions if any',
        description:
          'Input eligible deductions (80C, 80D, HRA) while New Regime applies the ₹75,000 salaried standard deduction automatically.',
      },
      {
        title: 'Compare New vs Old tax',
        description:
          'View slab breakdown, Section 87A rebate, surcharge, 4% cess, and side-by-side savings.',
      },
    ],
    faqs: [
      {
        question: 'Which country’s tax rules does this Income Tax Calculator use?',
        answer:
          'It is India-specific—built strictly for Indian income-tax slabs (FY 2025–26 and FY 2026–27) in INR.',
      },
      {
        question: 'Does it include the ₹75,000 standard deduction, 87A rebate, surcharge, and 4% cess?',
        answer:
          'Yes. All four Indian tax components are modeled transparently in the slab breakdown.',
      },
      {
        question: 'Is this official tax filing or CA advice?',
        answer:
          'No. It is an educational tax comparison estimator—verify final filings on the official portal or with a Chartered Accountant.',
      },
      {
        question: 'Want monthly take-home CTC pay breakdown instead?',
        answer:
          'Use Salary Calculator under Finance Tools.',
      },
    ],
    relatedTools: [
      'finance-salary-calculator',
      'finance-gst-calculator',
      'finance-sip-calculator',
      'finance-fd-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'finance-salary-calculator',
    name: 'Salary Calculator',
    slug: 'finance-salary-calculator',
    category: 'finance-tools',
    url: '/finance-salary-calculator',
    description:
      'India-specific CTC to monthly in-hand salary breakdown for FY 2026–27 factoring PF, professional tax, and new-regime income tax.',
    longDescription:
      'Enter your annual CTC package in INR to inspect estimated monthly in-hand salary for FY 2026–27, accounting for employee Provident Fund (PF), state professional tax, ₹75,000 standard deduction, and New-Regime income tax. Note honestly: this is India-specific for Indian CTC/tax structures.',
    keywords: [
      'salary calculator',
      'ctc to in hand salary',
      'india ctc fy 2026-27',
      'pf professional tax new regime',
      'india specific salary',
    ],
    icon: 'Wallet',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Salary Calculator — India CTC to In-Hand | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'India-specific Indian CTC calculator showing monthly in-hand salary for FY 2026–27 with PF, professional tax, and New-Regime tax.',
    howTo: [
      {
        title: 'Enter annual CTC in INR',
        description:
          'Once live, type your annual Cost to Company (CTC) and optional employer bonus/gratuity splits.',
      },
      {
        title: 'Configure PF & professional tax',
        description:
          'Adjust standard EPF settings and state professional tax deductions.',
      },
      {
        title: 'Inspect monthly in-hand pay',
        description:
          'View estimated monthly net take-home alongside New-Regime TDS.',
      },
    ],
    faqs: [
      {
        question: 'Is Salary Calculator tailored to Indian payrolls?',
        answer:
          'Yes—honest notice: it is India-specific, built around Indian CTC structures, EPF, professional tax, and FY 2026–27 New-Regime income tax.',
      },
      {
        question: 'Why can actual payslips differ slightly from CTC estimates?',
        answer:
          'Company-specific employer PF caps, variable bonus schedules, and state professional tax slabs vary by employer.',
      },
      {
        question: 'Does this upload salary details anywhere?',
        answer:
          'No. All figures stay privately in your browser.',
      },
      {
        question: 'Can I compare Old vs New tax regimes separately?',
        answer:
          'Yes. Use Income Tax Calculator under Finance Tools.',
      },
    ],
    relatedTools: [
      'finance-income-tax-calculator',
      'finance-gst-calculator',
      'finance-emi-calculator',
      'finance-sip-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'finance-discount-calculator',
    name: 'Discount Calculator',
    slug: 'finance-discount-calculator',
    category: 'finance-tools',
    url: '/finance-discount-calculator',
    description:
      'Enter original price and discount % to see exact discount amount, final payable price, and total amount saved.',
    longDescription:
      'Verify store markdowns or promotional offers in seconds inside your browser: enter the original price and discount percentage (plus optional second stacked discount or sales tax) to see exact discount amount, final price, and amount saved.',
    keywords: [
      'discount calculator',
      'sale percentage off',
      'final price saved',
      'percent discount',
    ],
    icon: 'Tag',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Discount Calculator — Sale Price & Savings | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Calculate discount amount, final price, and total amount saved from any original price and discount percentage in your browser.',
    howTo: [
      {
        title: 'Enter original price',
        description:
          'Once live, type the listed price in any currency.',
      },
      {
        title: 'Enter discount percentage',
        description:
          'Input the discount % (plus optional stacked discount or tax).',
      },
      {
        title: 'View final price & savings',
        description:
          'Read exact discount amount, final price, and money saved instantly.',
      },
    ],
    faqs: [
      {
        question: 'Does Discount Calculator work with any currency?',
        answer:
          'Yes. Percentage discount arithmetic applies equally to any currency.',
      },
      {
        question: 'Can I calculate stacked discounts like 20% + extra 10% off?',
        answer:
          'Yes. Sequential discount support applies the second percentage to the already-discounted price.',
      },
      {
        question: 'Need GST-inclusive or exclusive price breakdown?',
        answer:
          'Use GST Calculator under Finance Tools for Indian GST splits.',
      },
      {
        question: 'Is this calculation instantaneous and offline?',
        answer:
          'Yes. Pure math runs inside your browser tab.',
      },
    ],
    relatedTools: [
      'finance-gst-calculator',
      'finance-emi-calculator',
      'document-quote-generator',
      'unit-currency-converter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'finance-emi-calculator',
    name: 'EMI Calculator',
    slug: 'finance-emi-calculator',
    category: 'finance-tools',
    url: '/finance-emi-calculator',
    description:
      'Calculate monthly EMI, total interest payable, and total loan repayment for home, car, or personal loans in your browser.',
    longDescription:
      'Plan home mortgages, auto financing, or personal loans using the standard reducing-balance EMI formula inside your browser: enter principal amount, annual interest rate %, and tenure in months or years to view monthly EMI, total interest cost, and total repayment.',
    keywords: [
      'emi calculator',
      'loan emi interest repayment',
      'home car personal loan',
      'monthly installment calculator',
    ],
    icon: 'Calculator',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `EMI Calculator — Home, Car & Personal Loans | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Compute monthly EMI, total interest payable, and total repayment for home, car, or personal loans directly in your browser.',
    howTo: [
      {
        title: 'Enter loan amount & rate',
        description:
          'Once live, enter loan principal and annual interest percentage.',
      },
      {
        title: 'Set loan tenure',
        description:
          'Pick duration in months or years for home, car, or personal loan repayment.',
      },
      {
        title: 'Review EMI & total interest',
        description:
          'Inspect monthly installment, cumulative interest, and total repayment amount.',
      },
    ],
    faqs: [
      {
        question: 'Which loans work with EMI Calculator?',
        answer:
          'Any standard reducing-balance loan—home loans, car loans, education loans, and personal loans.',
      },
      {
        question: 'Does it include processing fees or insurance add-ons?',
        answer:
          'Standard EMI covers principal + interest repayment; separate lender fees or GST on charges depend on your loan contract.',
      },
      {
        question: 'Does EMI Calculator assume a specific currency?',
        answer:
          'No. The mathematical EMI formula works for INR, USD, EUR, GBP, or any currency.',
      },
      {
        question: 'Want to compare fixed-deposit returns instead?',
        answer:
          'Use FD Calculator under Finance Tools.',
      },
    ],
    relatedTools: [
      'finance-fd-calculator',
      'finance-sip-calculator',
      'finance-salary-calculator',
      'finance-discount-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'finance-sip-calculator',
    name: 'SIP Calculator',
    slug: 'finance-sip-calculator',
    category: 'finance-tools',
    url: '/finance-sip-calculator',
    description:
      'Estimate monthly mutual fund SIP growth over time in your browser—ESTIMATE ONLY, market returns are not guaranteed.',
    longDescription:
      'Project how consistent monthly Systematic Investment Plan (SIP) contributions could compound over your chosen investment horizon using an assumed expected annual return rate. Important ESTIMATE-ONLY disclaimer: mutual fund returns fluctuate with market risk and are never guaranteed—projections are illustrative math only, not financial advice.',
    keywords: [
      'sip calculator',
      'mutual fund sip estimate',
      'monthly investment calculator',
      'sip estimate only',
    ],
    icon: 'TrendingUp',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `SIP Calculator — Mutual Fund Estimator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Estimate potential monthly mutual fund SIP growth in your browser. ESTIMATE ONLY—actual market returns vary and are not guaranteed.',
    howTo: [
      {
        title: 'Enter monthly SIP amount & years',
        description:
          'Once live, type your monthly contribution and investment duration in years.',
      },
      {
        title: 'Set illustrative return %',
        description:
          'Choose an assumed annual return rate strictly for hypothetical scenario comparison.',
      },
      {
        title: 'Inspect invested vs estimated value',
        description:
          'Review total invested capital alongside illustrative ESTIMATE-ONLY projected wealth.',
      },
    ],
    faqs: [
      {
        question: 'Are SIP Calculator numbers guaranteed mutual fund returns?',
        answer:
          'No—ESTIMATE-ONLY disclaimer: results assume a constant hypothetical return rate for illustration only. Actual mutual fund returns vary with market risk.',
      },
      {
        question: 'Does this factor in expense ratios, exit loads, or capital gains tax?',
        answer:
          'No. Standard SIP compounding illustrates gross pre-tax growth based on your rate input.',
      },
      {
        question: 'Is this investment advice or fund recommendation?',
        answer:
          'No. It is purely a mathematical planning estimator.',
      },
      {
        question: 'Need guaranteed fixed-rate compounding schedules?',
        answer:
          'Use FD Calculator for fixed-deposit maturity calculations.',
      },
    ],
    relatedTools: [
      'finance-fd-calculator',
      'finance-emi-calculator',
      'finance-income-tax-calculator',
      'finance-salary-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'finance-fd-calculator',
    name: 'FD Calculator',
    slug: 'finance-fd-calculator',
    category: 'finance-tools',
    url: '/finance-fd-calculator',
    description:
      'Calculate fixed deposit maturity value and interest with monthly, quarterly, half-yearly, or yearly compounding and year-by-year schedule.',
    longDescription:
      'Compute exact Fixed Deposit (FD) maturity proceeds and earned interest inside your browser by choosing deposit amount, interest rate, tenure, and compounding frequency (monthly, quarterly, half-yearly, or yearly), complete with a clear year-by-year schedule.',
    keywords: [
      'fd calculator',
      'fixed deposit maturity',
      'quarterly compounding schedule',
      'deposit interest calculator',
    ],
    icon: 'PiggyBank',
    acceptedFormats: ['Numeric'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `FD Calculator — Maturity & Schedule | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Calculate fixed deposit maturity value and interest with monthly, quarterly, half-yearly, or yearly compounding and yearly schedule.',
    howTo: [
      {
        title: 'Enter deposit amount, rate & tenure',
        description:
          'Once live, enter principal amount, bank interest rate %, and duration.',
      },
      {
        title: 'Choose compounding frequency',
        description:
          'Pick monthly, quarterly, half-yearly, or yearly compounding.',
      },
      {
        title: 'View maturity & yearly schedule',
        description:
          'Inspect total interest, maturity value, and year-by-year growth schedule.',
      },
    ],
    faqs: [
      {
        question: 'Which compounding intervals are supported in FD Calculator?',
        answer:
          'Monthly, quarterly, half-yearly, and yearly compounding are all selectable.',
      },
      {
        question: 'Does it include a year-by-year growth table?',
        answer:
          'Yes. A year-by-year compounding schedule breaks down opening balance, interest, and closing balance.',
      },
      {
        question: 'Which compounding frequency do most Indian bank FDs use?',
        answer:
          'Most standard bank term deposits compound quarterly, though non-cumulative payouts can be monthly.',
      },
      {
        question: 'Does FD Calculator deduct TDS automatically?',
        answer:
          'Calculations display gross pre-tax maturity value; bank TDS depends on tax rules and Form 15G/15H status.',
      },
    ],
    relatedTools: [
      'finance-sip-calculator',
      'finance-emi-calculator',
      'finance-income-tax-calculator',
      'finance-salary-calculator',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
  {
    id: 'finance-advanced-scientific-calculator',
    name: 'Advanced Scientific Calculator',
    slug: 'finance-advanced-scientific-calculator',
    category: 'finance-tools',
    url: '/finance-advanced-scientific-calculator',
    description:
      'Browser scientific calculator with basic/scientific mode switch, trigonometry, log/ln, square roots, powers, and brackets.',
    longDescription:
      'Switch smoothly between a clean basic keypad and full scientific mode inside your browser—supporting nested parentheses/brackets, trigonometry (sin, cos, tan in degrees or radians), log/ln, square roots, exponents/powers, π/e constants, and expression history.',
    keywords: [
      'advanced scientific calculator',
      'trig log ln calculator',
      'basic scientific switch',
      'brackets powers roots',
    ],
    icon: 'Calculator',
    acceptedFormats: ['Numeric / Expression'],
    maxFileSizeMB: null,
    maxFiles: null,
    processingMethod: 'browser',
    seoTitle: `Advanced Scientific Calculator | ${SITE_CONFIG.siteName}`,
    seoDescription:
      'Switch between basic and scientific calculator modes with trigonometry, log/ln, square roots, powers, and brackets in your browser.',
    howTo: [
      {
        title: 'Choose Basic or Scientific mode',
        description:
          'Once live, toggle between compact basic arithmetic or full scientific functions.',
      },
      {
        title: 'Enter expressions with brackets',
        description:
          'Use sin/cos/tan, log/ln, square roots, powers, and nested brackets with keyboard or click input.',
      },
      {
        title: 'Inspect answer & formula history',
        description:
          'Copy precise results computed locally in your browser tab.',
      },
    ],
    faqs: [
      {
        question: 'Can I switch between Basic and Scientific layouts?',
        answer:
          'Yes. A mode switch lets you toggle between standard arithmetic and scientific functions.',
      },
      {
        question: 'Are degree and radian modes supported for trigonometry?',
        answer:
          'Yes. Switch between DEG and RAD before evaluating sin, cos, or tan expressions.',
      },
      {
        question: 'Does it support nested brackets and operator precedence?',
        answer:
          'Yes. Full PEMDAS/BODMAS bracket evaluation is supported cleanly.',
      },
      {
        question: 'Does it solve physics equations with missing variables too?',
        answer:
          'Use Physics Calculator under Science Tools when you want formula templates for F = ma, KE, PE, and V = IR.',
      },
    ],
    relatedTools: [
      'science-physics-calculator',
      'science-chemistry-solutions-calculator',
      'finance-emi-calculator',
      'unit-unit-converter',
    ],
    popular: false,
    featured: false,
    rating: null,
    status: 'active',
  },
];
