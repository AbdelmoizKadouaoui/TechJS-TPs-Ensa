export type Status =
  | 'Read' | 'Re-read' | 'DNF' | 'Currently reading' | 'Returned Unread' | 'Want to read';
export type Format = 'Print' | 'PDF' | 'Ebook' | 'AudioBook';

export interface BookDTO {
  _id?: string;
  title: string;
  author: string;
  pages: number;
  status: Status;
  price: number;
  pagesRead: number;
  format: Format;
  suggestedBy?: string;
  finished: boolean;
}

export default class Book implements BookDTO {
  _id?: string;
  title: string;
  author: string;
  pages: number;
  status: Status;
  price: number;
  pagesRead: number;
  format: Format;
  suggestedBy?: string;
  finished: boolean;

  constructor(data: Partial<BookDTO> & Pick<BookDTO, 'title'|'author'|'pages'>) {
    this._id = data._id;
    this.title = data.title;
    this.author = data.author;
    this.pages = Number(data.pages);
    this.status = (data.status ?? 'Want to read') as Status;
    this.price = Number(data.price ?? 0);
    this.pagesRead = Math.min(Number(data.pagesRead ?? 0), this.pages);
    this.format = (data.format ?? 'Print') as Format;
    this.suggestedBy = data.suggestedBy ?? '';
    this.finished = Boolean(data.finished ?? this.pagesRead >= this.pages);
  }

  currentlyAt() {
    const percent = this.pages ? Math.round((this.pagesRead / this.pages) * 100) : 0;
    return { page: this.pagesRead, total: this.pages, percent };
  }

  async deleteBook(apiDelete: (id: string) => Promise<unknown>) {
    if (!this._id) throw new Error('No _id');
    await apiDelete(this._id);
  }
}
