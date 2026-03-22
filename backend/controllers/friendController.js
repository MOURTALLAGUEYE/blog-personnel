const db = require('../config/db')

// ─── RECHERCHER UN UTILISATEUR ───────────────────────
const searchUsers = async (req, res) => {
  try {
    const { username } = req.query
    if (!username) {
      return res.status(400).json({ message: 'Paramètre username requis' })
    }

    const [users] = await db.query(
      `SELECT id, nom_complet, nom_utilisateur AS username
       FROM utilisateurs
       WHERE nom_utilisateur LIKE ? AND id != ?`,
      [`%${username}%`, req.user.id]
    )

    res.json(users)
  } catch (error) {
    console.error('searchUsers error:', error.message)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

// ─── LISTE DES AMIS CONFIRMÉS ────────────────────────
const getFriends = async (req, res) => {
  try {
    const [friends] = await db.query(
      `SELECT
         f.id AS friendship_id,
         f.statut,
         CASE WHEN f.demandeur_id = ? THEN u2.id       ELSE u1.id       END AS ami_id,
         CASE WHEN f.demandeur_id = ? THEN u2.nom_complet ELSE u1.nom_complet END AS nom_complet,
         CASE WHEN f.demandeur_id = ? THEN u2.nom_utilisateur ELSE u1.nom_utilisateur END AS username
       FROM amis f
       JOIN utilisateurs u1 ON f.demandeur_id = u1.id
       JOIN utilisateurs u2 ON f.receveur_id  = u2.id
       WHERE (f.demandeur_id = ? OR f.receveur_id = ?)
         AND f.statut = 'accepter'`,
      [req.user.id, req.user.id, req.user.id, req.user.id, req.user.id]
    )

    res.json(friends)
  } catch (error) {
    console.error('getFriends error:', error.message)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

// ─── DEMANDES REÇUES EN ATTENTE ──────────────────────
const getRequests = async (req, res) => {
  try {
    const [requests] = await db.query(
      `SELECT
         f.id AS friendship_id,
         u.id AS demandeur_id,
         u.nom_complet,
         u.nom_utilisateur AS username
       FROM amis f
       JOIN utilisateurs u ON f.demandeur_id = u.id
       WHERE f.receveur_id = ? AND f.statut = 'en_attente'`,
      [req.user.id]
    )

    res.json(requests)
  } catch (error) {
    console.error('getRequests error:', error.message)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

// ─── ENVOYER UNE DEMANDE D'AMI ───────────────────────
const sendRequest = async (req, res) => {
  try {
    const { receveur_id } = req.body

    if (!receveur_id) {
      return res.status(400).json({ message: 'receveur_id requis' })
    }

    if (receveur_id === req.user.id) {
      return res.status(400).json({ message: 'Vous ne pouvez pas vous ajouter vous-même' })
    }

    const [existing] = await db.query(
      `SELECT id FROM amis
       WHERE (demandeur_id = ? AND receveur_id = ?)
          OR (demandeur_id = ? AND receveur_id = ?)`,
      [req.user.id, receveur_id, receveur_id, req.user.id]
    )

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Une relation existe déjà avec cet utilisateur' })
    }

    await db.query(
      "INSERT INTO amis (demandeur_id, receveur_id, statut) VALUES (?, ?, 'en_attente')",
      [req.user.id, receveur_id]
    )

    res.status(201).json({ message: "Demande d'ami envoyée avec succès" })
  } catch (error) {
    console.error('sendRequest error:', error.message)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

// ─── CONFIRMER UNE DEMANDE D'AMI ─────────────────────
const confirmRequest = async (req, res) => {
  try {
    const { id } = req.params

    const [friendship] = await db.query(
      "SELECT * FROM amis WHERE id = ? AND receveur_id = ? AND statut = 'en_attente'",
      [id, req.user.id]
    )

    if (friendship.length === 0) {
      return res.status(404).json({ message: 'Demande introuvable ou non autorisée' })
    }

    await db.query(
      "UPDATE amis SET statut = 'accepter' WHERE id = ?",
      [id]
    )

    res.json({ message: "Demande d'ami confirmée" })
  } catch (error) {
    console.error('confirmRequest error:', error.message)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

// ─── SUPPRIMER UN AMI ────────────────────────────────
const deleteFriend = async (req, res) => {
  try {
    const { id } = req.params

    const [friendship] = await db.query(
      'SELECT * FROM amis WHERE id = ? AND (demandeur_id = ? OR receveur_id = ?)',
      [id, req.user.id, req.user.id]
    )

    if (friendship.length === 0) {
      return res.status(404).json({ message: 'Relation introuvable ou non autorisée' })
    }

    await db.query('DELETE FROM amis WHERE id = ?', [id])

    res.json({ message: 'Ami supprimé avec succès' })
  } catch (error) {
    console.error('deleteFriend error:', error.message)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

// ─── BLOQUER UN UTILISATEUR ──────────────────────────
const blockFriend = async (req, res) => {
  try {
    const { id } = req.params

    const [friendship] = await db.query(
      'SELECT * FROM amis WHERE id = ? AND (demandeur_id = ? OR receveur_id = ?)',
      [id, req.user.id, req.user.id]
    )

    if (friendship.length === 0) {
      return res.status(404).json({ message: 'Relation introuvable ou non autorisée' })
    }

    await db.query(
      "UPDATE amis SET statut = 'bloquer' WHERE id = ?",
      [id]
    )

    res.json({ message: "Utilisateur bloqué" })
  } catch (error) {
    console.error('blockFriend error:', error.message)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

module.exports = {
  searchUsers,
  getFriends,
  getRequests,
  sendRequest,
  confirmRequest,
  deleteFriend,
  blockFriend
}