import { Schema, model, Document } from 'mongoose';

export type Status =
  | 'Read' 
  | 'Re-read' 
  | 'DNF' 
  | 'Currently reading' 
  | 'Returned Unread' 
  | 'Want to read';

export type Format = 'Print' 
  | 'PDF' 
  | 'Ebook' 
  | 'AudioBosok';

export interface BookDoc extends Document {
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

const bookSchema = new Schema<BookDoc>({
  title: { type: String, required: true, trim: true },
  author: { type: String, required: true, trim: true },
  pages: { type: Number, required: true, min: 1 },
  status: {
    type: String,
    enum: ['Read',
          'Re-read',
          'DNF',
          'Currently reading',
          'Returned Unread',
          'Want to read'],
    default: 'Want to read'
  },
  price: { type: Number, default: 0 },
  pagesRead: { type: Number, default: 0, min: 0 },
  format: { type: String, enum: ['Print','PDF','Ebook','AudioBook'], default: 'Print' },
  suggestedBy: { type: String, default: '' },
  finished: { type: Boolean, default: false }
});

bookSchema.pre('save', function(next) {
  if (this.pagesRead > this.pages) this.pagesRead = this.pages;
  this.finished = this.pagesRead >= this.pages;
  next();
});

export default model<BookDoc>('Book', bookSchema);
