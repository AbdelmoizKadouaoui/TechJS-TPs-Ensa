import type { BookDTO } from './book.js';

const BASE = 'http://localhost:5000/api/books';

async function j<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const r = await fetch(input, init);
  if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
  return r.json() as Promise<T>;
}

export function list(): Promise<BookDTO[]> {
  return j<BookDTO[]>(BASE);
}

export function create(payload: Partial<BookDTO>): Promise<BookDTO> {
  return j<BookDTO>(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

export function updateProgress(id: string, pagesRead: number): Promise<BookDTO> {
  return j<BookDTO>(`${BASE}/${id}/progress`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pagesRead })
  });
}

export function remove(id: string): Promise<{ message: string }> {
  return j<{ message: string }>(`${BASE}/${id}`, { method: 'DELETE' });
}
