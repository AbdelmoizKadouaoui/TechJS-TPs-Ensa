export default class Book {
    constructor(data) {
        this._id = data._id;
        this.title = data.title;
        this.author = data.author;
        this.pages = Number(data.pages);
        this.status = (data.status ?? 'Want to read');
        this.price = Number(data.price ?? 0);
        this.pagesRead = Math.min(Number(data.pagesRead ?? 0), this.pages);
        this.format = (data.format ?? 'Print');
        this.suggestedBy = data.suggestedBy ?? '';
        this.finished = Boolean(data.finished ?? this.pagesRead >= this.pages);
    }
    currentlyAt() {
        const percent = this.pages ? Math.round((this.pagesRead / this.pages) * 100) : 0;
        return { page: this.pagesRead, total: this.pages, percent };
    }
    async deleteBook(apiDelete) {
        if (!this._id)
            throw new Error('No _id');
        await apiDelete(this._id);
    }
}
