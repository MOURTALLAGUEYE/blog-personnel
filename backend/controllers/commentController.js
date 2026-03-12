const db = require('../config/db');

// ─── AJOUTER UN COMMENTAIRE ─────────────────────────────────────────────────
const addComment = async (req, res) => {
  try {
    const { id: articleId } = req.params; // article_id depuis l'URL
    const { contenu } = req.body;

    if (!contenu || contenu.trim() === '') {
      return res.status(400).json({ message: 'Le contenu du commentaire est requis' });
    }

    // Vérifier que l'article existe ET que les commentaires sont activés
    const [articles] = await db.query(
      'SELECT id, commentaires_actifs, user_id FROM articles WHERE id = ?',
      [articleId]
    );

    if (articles.length === 0) {
      return res.status(404).json({ message: 'Article introuvable' });
    }

    const article = articles[0];

    // RÈGLE IMPORTANTE : bloquer si commentaires désactivés
    if (!article.commentaires_actifs) {
      return res.status(403).json({ message: 'Commentaires désactivés pour cet article' });
    }

    // Insérer le commentaire
    const [result] = await db.query(
      'INSERT INTO comments (article_id, user_id, contenu) VALUES (?, ?, ?)',
      [articleId, req.userId, contenu.trim()]
    );

    // Récupérer le commentaire créé avec les infos utilisateur
    const [newComment] = await db.query(
      `SELECT c.id, c.contenu, c.created_at, u.username, u.nom_complet
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    );

    res.status(201).json(newComment[0]);
  } catch (error) {
    console.error('addComment error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// ─── SUPPRIMER UN COMMENTAIRE ───────────────────────────────────────────────
const deleteComment = async (req, res) => {
  try {
    const { id: commentId } = req.params;

    // Vérifier que le commentaire existe et appartient à l'utilisateur connecté
    const [comments] = await db.query(
      'SELECT * FROM comments WHERE id = ? AND user_id = ?',
      [commentId, req.userId]
    );

    if (comments.length === 0) {
      return res.status(404).json({ message: 'Commentaire introuvable ou non autorisé' });
    }

    await db.query('DELETE FROM comments WHERE id = ?', [commentId]);

    res.json({ message: 'Commentaire supprimé avec succès' });
  } catch (error) {
    console.error('deleteComment error:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { addComment, deleteComment };
