import Book, { BookDTO } from './book.js';
import { list, create, updateProgress, remove } from './api.js';

const el = {
  form: document.getElementById('bookForm') as HTMLFormElement,
  list: document.getElementById('list') as HTMLDivElement,
  stats: document.getElementById('stats') as HTMLDivElement
};

function renderStats(books: Book[]) {
  const total = books.length;
  const finished = books.filter(b => b.finished).length;
  const reading = books.filter(b => b.status === 'Currently reading').length;
  const totalPages = books.reduce((a, b) => a + b.pages, 0);
  const readPages = books.reduce((a, b) => a + b.pagesRead, 0);

  document.getElementById('stat-total')!.textContent = total.toString();
  document.getElementById('stat-finished')!.textContent = finished.toString();
  document.getElementById('stat-reading')!.textContent = reading.toString();
  document.getElementById('stat-pages')!.textContent = readPages.toString();

  el.stats.classList.remove('hidden');
}

function renderBookCard(b: Book) {
  const { percent } = b.currentlyAt();
  const statusColor = {
    'Read': 'bg-green-900',
    'Currently reading': 'bg-blue-900',
    'Want to read': 'bg-gray-700',
    'Re-read': 'bg-purple-900',
    'DNF': 'bg-red-900',
    'Returned Unread': 'bg-orange-900'
  }[b.status] || 'bg-gray-700';

  return `
  <article class="bg-slate-700 border border-slate-600 rounded-xl overflow-hidden shadow-lg hover:shadow-xl hover:border-blue-500 transition" data-id="${b._id}">
    <!-- Header with color indicator -->
    <div class="${statusColor} h-3 flex-shrink-0"></div>
    
    <div class="p-6">
      <!-- Title and Delete Button -->
      <div class="flex justify-between items-start mb-3">
        <div class="flex-1">
          <h3 class="text-lg font-bold text-white truncate">${b.title} by ${b.author}</h3>
        </div>
        
      </div>

      <!-- Status and Format -->
      <div class="flex gap-2 mb-4">
        <span class="text-xs font-medium bg-slate-600 text-slate-100 px-2 py-1 rounded">${b.status}</span>
        <span class="text-xs font-medium bg-slate-600 text-slate-100 px-2 py-1 rounded">${b.format}</span>
      </div>

      <!-- Progress Section -->
      <div class="mb-4">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm text-slate-300">Progress</span>
          <span class="text-sm font-bold text-blue-400">${percent}%</span>
        </div>
        <div class="w-full bg-slate-600 h-2.5 rounded-full overflow-hidden">
          <div class="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style="width:${percent}%;"></div>
        </div>
        <div class="text-xs text-slate-400 mt-2">${b.pagesRead} / ${b.pages} pages</div>
      </div>

      <!-- Update Progress Section -->
      <div class="flex gap-2 mb-4">
        <input type="number" class="inp flex-1 bg-slate-600 border border-slate-500 text-white p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-400" min="0" max="${b.pages}" value="${b.pagesRead}" />
        <button class="btn-save bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded text-sm transition">Update</button>
        <button class="btn-del text-slate-400 hover:text-red-400 transition text-lg ml-2">✕</button>
      </div>

      <!-- Suggested By -->
      ${b.suggestedBy ? `<div class="text-xs text-slate-400 border-t border-slate-600 pt-3">💡 Suggested by: <span class="text-slate-300">${b.suggestedBy}</span></div>` : ''}

      <!-- Price (if available) -->
      ${b.price ? `<div class="text-xs text-slate-400 mt-2">💰 Price: <span class="text-slate-300">$${b.price.toFixed(2)}</span></div>` : ''}
    </div>
  </article>`;
}

async function load() {
  const data: BookDTO[] = await list();
  const books = data.map(d => new Book(d));
  renderStats(books);
  el.list.innerHTML = books.map(renderBookCard).join('');

  el.list.querySelectorAll('article').forEach(article => {
    const id = (article as HTMLElement).dataset.id!;
    const del = article.querySelector<HTMLButtonElement>('.btn-del')!;
    const save = article.querySelector<HTMLButtonElement>('.btn-save')!;
    const inp = article.querySelector<HTMLInputElement>('.inp')!;

    del.onclick = async () => { await remove(id); await load(); };
    save.onclick = async () => {
      await updateProgress(id, Number(inp.value));
      await load();
    };
  });
}

el.form.onsubmit = async e => {
  e.preventDefault();
  const fd = new FormData(el.form);
  const payload: Partial<BookDTO> = {
    title: String(fd.get('title') ?? ''),
    author: String(fd.get('author') ?? ''),
    pages: Number(fd.get('pages')),
    status: String(fd.get('status') ?? 'Want to read') as any,
    pagesRead: Number(fd.get('pagesRead') ?? 0),
    suggestedBy: String(fd.get('suggestedBy') ?? ''),
    price: Number(fd.get('price') ?? 0),
    finished: false
  };
  await create(payload);
  el.form.reset();
  await load();
};

load();