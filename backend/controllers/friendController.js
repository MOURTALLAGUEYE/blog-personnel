const db = require('../config/db');

// ─── RECHERCHER UN UTILISATEUR PAR USERNAME ─────────────────────────────────
const searchUsers = async (req, res) => {
  try {
    const { username } = req.query;
    if (!username) {
      return res.status(400).json({ message: 'Paramètre username requis' });
    }

    // Exclure l'utilisateur connecté des résultats
    const [users] = await db.query(
      'SELECT id, nom_complet, username FROM users WHERE username LIKE ? AND id != ?',
      [`%${username}%`, req.userId]
    );

    res.json(users);
  } catch (error) {
    console.error('searchUsers error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── LISTE DES AMIS CONFIRMÉS ───────────────────────────────────────────────
const getFriends = async (req, res) => {
  try {
    const [friends] = await db.query(
      `SELECT 
         f.id AS friendship_id,
         f.statut,
         CASE 
           WHEN f.demandeur_id = ? THEN u2.id
           ELSE u1.id
         END AS ami_id,
         CASE 
           WHEN f.demandeur_id = ? THEN u2.nom_complet
           ELSE u1.nom_complet
         END AS nom_complet,
         CASE 
           WHEN f.demandeur_id = ? THEN u2.username
           ELSE u1.username
         END AS username
       FROM friends f
       JOIN users u1 ON f.demandeur_id = u1.id
       JOIN users u2 ON f.receveur_id = u2.id
       WHERE (f.demandeur_id = ? OR f.receveur_id = ?) AND f.statut = 'accepte'`,
      [req.userId, req.userId, req.userId, req.userId, req.userId]
    );

    res.json(friends);
  } catch (error) {
    console.error('getFriends error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── DEMANDES D'AMIS REÇUES EN ATTENTE ─────────────────────────────────────
const getRequests = async (req, res) => {
  try {
    const [requests] = await db.query(
      `SELECT 
         f.id AS friendship_id,
         u.id AS demandeur_id,
         u.nom_complet,
         u.username
       FROM friends f
       JOIN users u ON f.demandeur_id = u.id
       WHERE f.receveur_id = ? AND f.statut = 'en_attente'`,
      [req.userId]
    );

    res.json(requests);
  } catch (error) {
    console.error('getRequests error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── ENVOYER UNE DEMANDE D'AMI ──────────────────────────────────────────────
const sendRequest = async (req, res) => {
  try {
    const { receveur_id } = req.body;

    if (!receveur_id) {
      return res.status(400).json({ message: 'receveur_id requis' });
    }

    if (receveur_id === req.userId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas vous ajouter vous-même' });
    }

    // Vérifier si une relation existe déjà
    const [existing] = await db.query(
      `SELECT id FROM friends 
       WHERE (demandeur_id = ? AND receveur_id = ?) 
          OR (demandeur_id = ? AND receveur_id = ?)`,
      [req.userId, receveur_id, receveur_id, req.userId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Une relation existe déjà avec cet utilisateur' });
    }

    await db.query(
      "INSERT INTO friends (demandeur_id, receveur_id, statut) VALUES (?, ?, 'en_attente')",
      [req.userId, receveur_id]
    );

    res.status(201).json({ message: 'Demande d\'ami envoyée avec succès' });
  } catch (error) {
    console.error('sendRequest error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── CONFIRMER UNE DEMANDE D'AMI ────────────────────────────────────────────
const confirmRequest = async (req, res) => {
  try {
    const { id } = req.params; // friendship_id

    // Vérifier que c'est bien l'utilisateur receveur qui confirme
    const [friendship] = await db.query(
      "SELECT * FROM friends WHERE id = ? AND receveur_id = ? AND statut = 'en_attente'",
      [id, req.userId]
    );

    if (friendship.length === 0) {
      return res.status(404).json({ message: 'Demande introuvable ou non autorisée' });
    }

    await db.query(
      "UPDATE friends SET statut = 'accepte' WHERE id = ?",
      [id]
    );

    res.json({ message: 'Demande d\'ami confirmée' });
  } catch (error) {
    console.error('confirmRequest error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── SUPPRIMER UN AMI ───────────────────────────────────────────────────────
const deleteFriend = async (req, res) => {
  try {
    const { id } = req.params; // friendship_id

    // Vérifier que l'utilisateur connecté fait partie de cette relation
    const [friendship] = await db.query(
      'SELECT * FROM friends WHERE id = ? AND (demandeur_id = ? OR receveur_id = ?)',
      [id, req.userId, req.userId]
    );

    if (friendship.length === 0) {
      return res.status(404).json({ message: 'Relation introuvable ou non autorisée' });
    }

    await db.query('DELETE FROM friends WHERE id = ?', [id]);

    res.json({ message: 'Ami supprimé avec succès' });
  } catch (error) {
    console.error('deleteFriend error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── BLOQUER UN UTILISATEUR ─────────────────────────────────────────────────
const blockFriend = async (req, res) => {
  try {
    const { id } = req.params; // friendship_id

    // Vérifier que l'utilisateur connecté fait partie de cette relation
    const [friendship] = await db.query(
      'SELECT * FROM friends WHERE id = ? AND (demandeur_id = ? OR receveur_id = ?)',
      [id, req.userId, req.userId]
    );

    if (friendship.length === 0) {
      return res.status(404).json({ message: 'Relation introuvable ou non autorisée' });
    }

    await db.query(
      "UPDATE friends SET statut = 'bloque' WHERE id = ?",
      [id]
    );

    res.json({ message: 'Utilisateur bloqué. Ses articles n\'apparaîtront plus sur votre dashboard.' });
  } catch (error) {
    console.error('blockFriend error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  searchUsers,
  getFriends,
  getRequests,
  sendRequest,
  confirmRequest,
  deleteFriend,
  blockFriend
};
