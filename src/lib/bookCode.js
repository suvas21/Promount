const STORAGE_KEY = 'pm_book_code';
const BOOK_CODE_TTL_MS = 30 * 60 * 1000; // 30 minutes

export function getBookCodeFromSearch(search = '') {
  return new URLSearchParams(search).get('book')?.trim() || '';
}

export function getStoredBookCode() {
  try {
    // Session-scoped + TTL to avoid carrying promo too long.
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return '';

    // Backward compatibility with older plain-string format.
    if (!raw.startsWith('{')) return raw;

    const parsed = JSON.parse(raw);
    if (!parsed?.bookCode) return '';

    if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(STORAGE_KEY);
      return '';
    }

    return parsed.bookCode;
  } catch {
    return '';
  }
}

export function setStoredBookCode(bookCode) {
  const value = (bookCode || '').toString().trim();
  if (!value) return;
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        bookCode: value,
        savedAt: Date.now(),
        expiresAt: Date.now() + BOOK_CODE_TTL_MS
      })
    );
    // Clean up legacy persisted value so old promos stop "sticking forever".
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function getEffectiveBookCode(search = '') {
  return getBookCodeFromSearch(search) || getStoredBookCode();
}

export function withBookParam(pathname, search = '') {
  const current = getBookCodeFromSearch(search);
  if (current) return `${pathname}${search || ''}`;

  const stored = getStoredBookCode();
  if (!stored) return `${pathname}${search || ''}`;

  const params = new URLSearchParams(search || '');
  params.set('book', stored);
  const nextSearch = params.toString();
  return `${pathname}?${nextSearch}`;
}

