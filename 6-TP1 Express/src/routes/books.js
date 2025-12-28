const express = require('express');
const { ensureAuth } = require('../middleware/auth');

const router = express.Router();

// liste protégée
router.get('/', ensureAuth, (req, res) => {
  res.render('books', { books: req.app.locals.books });
});

module.exports = router;
