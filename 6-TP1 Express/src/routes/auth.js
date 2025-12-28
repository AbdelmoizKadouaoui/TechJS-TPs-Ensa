const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/User');
const router = express.Router();
router.get('/register', (req, res) => res.render('register'));
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).render('register', { error: 'Username et mot de passe obligatoires.' });
    }
    const exists = await User.findOne({ username });
    if (exists) {
      return res.render('register', { error: "Ce nom d'utilisateur est déjà pris." });
    }
    const hash = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hash });
    return res.redirect('/login?registered=1');
  } catch (e) {
    console.error(e);
    return res.render('register', { error: 'Erreur serveur.' });
  }
});
router.get('/login', (req, res) => {
  res.render('login', {
    error: req.query.error ? 'Identifiants invalides.' : null,
    registered: req.query.registered,
  });
});
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/books',
    failureRedirect: '/login?error=1',
  })
);

// --- Logout ---
router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/login');
  });
});

module.exports = router;
