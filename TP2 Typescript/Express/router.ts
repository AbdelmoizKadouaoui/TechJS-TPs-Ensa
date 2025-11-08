import { Router, Request, Response } from 'express';
import Book, { BookDoc } from './book';

const router = Router();

// Créer
router.post('/', async (req: Request, res: Response) => {
  try {
    const created = await new Book(req.body as Partial<BookDoc>).save();
    res.status(201).json(created);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    res.status(400).json({ error: msg });
  }
});

// Lire
router.get('/', async (_req: Request, res: Response) => {
  const items = await Book.find().sort({ _id: -1 });
  res.json(items);
});

// Mettre à jour la progression (pages lues)
router.put('/:id/progress', async (req: Request, res: Response) => {
  const { pagesRead } = req.body as { pagesRead: number };
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });

  const val = Math.max(0, Number(pagesRead));
  book.pagesRead = Math.min(val, book.pages);
  await book.save(); // hook calcule finished
  res.json(book);
});

// Supprimer
router.delete('/:id', async (req: Request, res: Response) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: 'deleted' });
});

export default router;
