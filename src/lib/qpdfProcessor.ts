import { PDFDocument } from 'pdf-lib';

let qpdfModule: any = null;
let loadPromise: Promise<any> | null = null;

export async function loadQpdfEngine(onStatus?: (status: string) => void): Promise<any> {
  if (qpdfModule) {
    return qpdfModule;
  }
  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = (async () => {
    onStatus?.('Loading qpdf WebAssembly engine (~2 MB)...');
    const mod = await import('@arshad-shah/qpdf-wasm');
    qpdfModule = mod;
    onStatus?.('qpdf WebAssembly engine ready.');
    return mod;
  })();

  return loadPromise;
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
  onStatus?: (status: string) => void
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
    print: permissions?.print || 'full',
    modify: permissions?.modify || 'none',
    extract: permissions?.extract ?? true,
    annotate: permissions?.annotate ?? true,
  } as any;

  const result = await engine.encrypt(pdfBytes, encryptOpts);

  return { bytes: result.bytes, pageCount };
}

export async function unlockPdfBrowser(
  pdfBytes: Uint8Array,
  password: string,
  onStatus?: (status: string) => void
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
    const msg = (err?.message || '').toLowerCase();
    if (msg.includes('password') || msg.includes('decrypt') || msg.includes('invalid') || msg.includes('bad')) {
      throw new Error('Incorrect password: The provided password failed to decrypt this PDF. Please check the password and try again.');
    }
    throw new Error(err?.message || 'Unable to decrypt PDF. Verify that the file is encrypted and the password is correct.');
  }
}

export async function inspectPdfBrowser(
  pdfBytes: Uint8Array,
  onStatus?: (status: string) => void
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
