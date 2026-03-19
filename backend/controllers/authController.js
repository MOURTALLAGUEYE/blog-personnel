const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const db     = require('../config/db')

// ── INSCRIPTION ──────────────────────────────────────
const register = async (req, res) => {
  const { nom_complet, username, password } = req.body

  if (!nom_complet || !username || !password) {
    return res.status(400).json({ message: 'Tous les champs sont obligatoires' })
  }

  try {
    const [existing] = await db.query(
      'SELECT id FROM users WHERE username = ?', [username]
    )
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Ce username est déjà pris' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const [result] = await db.query(
      'INSERT INTO users (nom_complet, username, password) VALUES (?, ?, ?)',
      [nom_complet, username, hashedPassword]
    )

    res.status(201).json({
      message: 'Inscription réussie',
      user: { id: result.insertId, nom_complet, username }
    })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

// ── CONNEXION ────────────────────────────────────────
const login = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Username et mot de passe requis' })
  }

  try {
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ?', [username]
    )
    if (users.length === 0) {
      return res.status(401).json({ message: 'Username ou mot de passe incorrect' })
    }

    const user    = users[0]
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(401).json({ message: 'Username ou mot de passe incorrect' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: { id: user.id, nom_complet: user.nom_complet, username: user.username }
    })
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

module.exports = { register, login }