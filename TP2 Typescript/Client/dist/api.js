const BASE = 'http://localhost:5000/api/books';
async function j(input, init) {
    const r = await fetch(input, init);
    if (!r.ok)
        throw new Error(`${r.status} ${r.statusText}`);
    return r.json();
}
export function list() {
    return j(BASE);
}
export function create(payload) {
    return j(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
}
export function updateProgress(id, pagesRead) {
    return j(`${BASE}/${id}/progress`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pagesRead })
    });
}
export function remove(id) {
    return j(`${BASE}/${id}`, { method: 'DELETE' });
}
