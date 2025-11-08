const path = require('path');
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
require('dotenv').config(); 
const passport = require('passport');
const dotenv = require('dotenv');

dotenv.config();

const initPassport = require('./config/passport');
const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');

const app = express();

// --- DB ---
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((e) => console.error('MongoDB error:', e));

// --- Templates & middlewares ---
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // MemoryStore (ok pour dev)
  })
);

// Passport
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

// variable globale: livres en mémoire
app.locals.books = [
  { id: 1, title: 'Clean Code', author: 'Robert C. Martin' },
  { id: 2, title: 'The Pragmatic Programmer', author: 'Andrew Hunt & David Thomas' },
  { id: 3, title: "You Don't Know JS Yet", author: 'Kyle Simpson' },
];

// rendre l’utilisateur dispo dans les vues
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// routes
app.use('/', authRoutes);
app.use('/books', booksRoutes);

// page d’accueil -> redirection
app.get('/', (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) return res.redirect('/books');
  return res.redirect('/login');
});

// démarrage
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
