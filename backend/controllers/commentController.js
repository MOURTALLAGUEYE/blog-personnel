const db = require('../config/db')

// ─── AJOUTER UN COMMENTAIRE ──────────────────────────
const addComment = async (req, res) => {
  try {
    const { id: articleId } = req.params
    const { contenu }       = req.body
    const contenuStr        = String(contenu || '').trim()

    if (!contenuStr) {
      return res.status(400).json({ message: 'Le contenu du commentaire est requis' })
    }

    const [articles] = await db.query(
      'SELECT id, commentaires_actifs FROM articles WHERE id = ?',
      [articleId]
    )

    if (articles.length === 0) {
      return res.status(404).json({ message: 'Article introuvable' })
    }

    if (!articles[0].commentaires_actifs) {
      return res.status(403).json({ message: 'Commentaires désactivés pour cet article' })
    }

    const [result] = await db.query(
      'INSERT INTO comments (article_id, user_id, contenu) VALUES (?, ?, ?)',
      [articleId, req.user.id, contenuStr]
    )

    const [newComment] = await db.query(
      `SELECT c.id, c.contenu, c.created_at, c.user_id,
              u.username, u.nom_complet
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    )

    res.status(201).json({
      message: 'Commentaire ajouté',
      comment: newComment[0]
    })

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

// ─── SUPPRIMER UN COMMENTAIRE ────────────────────────
const deleteComment = async (req, res) => {
  try {
    const { id: commentId } = req.params

    const [comments] = await db.query(
      'SELECT * FROM comments WHERE id = ? AND user_id = ?',
      [commentId, req.user.id]
    )

    if (comments.length === 0) {
      return res.status(404).json({ message: 'Commentaire introuvable ou non autorisé' })
    }

    await db.query('DELETE FROM comments WHERE id = ?', [commentId])

    res.status(200).json({ message: 'Commentaire supprimé avec succès' })

  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

module.exports = { addComment, deleteComment }