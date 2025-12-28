"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const book_1 = __importDefault(require("./book"));
const router = (0, express_1.Router)();
// Créer
router.post('/', async (req, res) => {
    try {
        const created = await new book_1.default(req.body).save();
        res.status(201).json(created);
    }
    catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        res.status(400).json({ error: msg });
    }
});
// Lire
router.get('/', async (_req, res) => {
    const items = await book_1.default.find().sort({ _id: -1 });
    res.json(items);
});
// Mettre à jour la progression (pages lues)
router.put('/:id/progress', async (req, res) => {
    const { pagesRead } = req.body;
    const book = await book_1.default.findById(req.params.id);
    if (!book)
        return res.status(404).json({ message: 'Book not found' });
    const val = Math.max(0, Number(pagesRead));
    book.pagesRead = Math.min(val, book.pages);
    await book.save(); // hook calcule finished
    res.json(book);
});
// Supprimer
router.delete('/:id', async (req, res) => {
    await book_1.default.findByIdAndDelete(req.params.id);
    res.json({ message: 'deleted' });
});
exports.default = router;
