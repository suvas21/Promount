const STORAGE_KEY = 'pm_book_code';

export function getBookCodeFromSearch(search = '') {
  return new URLSearchParams(search).get('book')?.trim() || '';
}

export function getStoredBookCode() {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredBookCode(bookCode) {
  const value = (bookCode || '').toString().trim();
  if (!value) return;
  try {
    localStorage.setItem(STORAGE_KEY, value);
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

