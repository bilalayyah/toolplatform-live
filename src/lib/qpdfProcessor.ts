import { PDFDocument } from 'pdf-lib';
import qpdfWasmUrl from '@arshad-shah/qpdf-wasm/qpdf.wasm?url';

let qpdfModule: any = null;
let loadPromise: Promise<any> | null = null;

function formatQpdfFailure(err: any, fallback: string, onStatus?: (status: string) => void): Error {
  console.error('qpdf-wasm error:', err, err?.cause ? { cause: err.cause } : undefined);
  onStatus?.('');
  const msg = String(err?.message || '').toLowerCase();
  if (
    err?.code === 'WRONG_PASSWORD' ||
    msg.includes('invalid password') ||
    msg.includes('incorrect password')
  ) {
    return new Error(
      'Incorrect password: The provided password failed to decrypt this PDF. Please check the password and try again.',
    );
  }
  if (
    err?.code === 'WASM_ERROR' ||
    msg.includes('initialize qpdf') ||
    msg.includes('unable to fetch wasm') ||
    msg.includes('webassembly')
  ) {
    qpdfModule = null;
    loadPromise = null;
    return new Error('The PDF engine failed to load — please reload the page and try again.');
  }
  if (msg.includes('password') || msg.includes('decrypt') || msg.includes('invalid') || msg.includes('bad')) {
    return new Error(
      'Incorrect password: The provided password failed to decrypt this PDF. Please check the password and try again.',
    );
  }
  return new Error(err?.message || fallback);
}

export async function loadQpdfEngine(
  onStatus?: (status: string) => void,
  importer: () => Promise<any> = () => import('@arshad-shah/qpdf-wasm'),
): Promise<any> {
  if (qpdfModule) {
    return qpdfModule;
  }
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    try {
      onStatus?.('Loading qpdf WebAssembly engine (~2.8 MB)...');
      const mod = await importer();
      if (typeof window !== 'undefined' && typeof mod?.configure === 'function' && qpdfWasmUrl) {
        const resolvedWasmUrl = new URL(qpdfWasmUrl, window.location.href).href;
        mod.configure({ wasmUrl: resolvedWasmUrl });
      }
      qpdfModule = mod;
      onStatus?.('qpdf WebAssembly engine ready.');
      return mod;
    } catch (err: any) {
      qpdfModule = null;
      loadPromise = null;
      onStatus?.('');
      console.error('Failed to load qpdf WebAssembly engine:', err, err?.cause ? { cause: err.cause } : undefined);
      throw new Error('The PDF engine failed to load — please reload the page and try again.');
    }
  })();

  return loadPromise;
}

export function resetQpdfEngineCacheForTests(): void {
  qpdfModule = null;
  loadPromise = null;
}

export async function protectPdfBrowser(
  pdfBytes: Uint8Array,
  userPassword: string,
  ownerPassword?: string,
  permissions?: {
    print?: 'none' | 'low' | 'full';
    modify?: 'none' | 'assembly' | 'form' | 'annotate' | 'all';
    extract?: boolean;
    annotate?: boolean;
  },
  onStatus?: (status: string) => void,
): Promise<{ bytes: Uint8Array; pageCount: number }> {
  const engine = await loadQpdfEngine(onStatus);
  onStatus?.('Encrypting PDF with AES-256 via 100% in-browser qpdf-wasm...');

  let pageCount = 1;
  try {
    const doc = await PDFDocument.load(pdfBytes);
    pageCount = doc.getPageCount();
  } catch {}

  const encryptOpts = {
    userPassword,
    ownerPassword: ownerPassword && ownerPassword.trim().length > 0 ? ownerPassword : userPassword,
    permissions: {
      print: permissions?.print || 'full',
      modify: permissions?.modify || 'none',
      extract: permissions?.extract ?? true,
      annotate: permissions?.annotate ?? true,
    },
  };

  try {
    const result = await engine.encrypt(pdfBytes, encryptOpts);
    return { bytes: result.bytes, pageCount };
  } catch (err: any) {
    throw formatQpdfFailure(
      err,
      'Unable to encrypt PDF. Please verify the file is a valid PDF and try again.',
      onStatus,
    );
  }
}

export async function unlockPdfBrowser(
  pdfBytes: Uint8Array,
  password: string,
  onStatus?: (status: string) => void,
): Promise<{ bytes: Uint8Array; pageCount: number }> {
  const engine = await loadQpdfEngine(onStatus);
  onStatus?.('Decrypting PDF via qpdf-wasm...');

  try {
    const result = await engine.decrypt(pdfBytes, password);
    let pageCount = 1;
    try {
      const doc = await PDFDocument.load(result.bytes);
      pageCount = doc.getPageCount();
    } catch {}

    return { bytes: result.bytes, pageCount };
  } catch (err: any) {
    throw formatQpdfFailure(
      err,
      'Unable to decrypt PDF. Verify that the file is encrypted and the password is correct.',
      onStatus,
    );
  }
}

export async function inspectPdfBrowser(
  pdfBytes: Uint8Array,
  onStatus?: (status: string) => void,
): Promise<{ needsPassword: boolean; pageCount: number }> {
  const engine = await loadQpdfEngine(onStatus);
  try {
    const info = await engine.inspect(pdfBytes);
    return {
      needsPassword: Boolean(info?.needsPassword),
      pageCount: Number(info?.pageCount) || 1,
    };
  } catch {
    return { needsPassword: false, pageCount: 1 };
  }
}
