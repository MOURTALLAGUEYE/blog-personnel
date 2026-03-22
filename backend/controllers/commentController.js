const db = require('../config/db')

// ─── AJOUTER UN COMMENTAIRE ──────────────────────────────
const addComment = async (req, res) => {
  try {
    const { id: articleId } = req.params
    const { contenu } = req.body
    const contenuStr = String(contenu).trim()
    if (!contenuStr) {

      return res.status(400).json({ message: 'Le contenu du commentaire est requis' })
    }

    // Vérifier que l'article existe et que les commentaires sont activés
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

    // Insérer le commentaire
    const [result] = await db.query(
      'INSERT INTO commentaires (article_id, utilisateur_id, contenu) VALUES (?, ?, ?)',
      [articleId, req.user.id, contenuStr]

    )

    // Récupérer le commentaire créé avec les infos utilisateur
    const [newComment] = await db.query(
      `SELECT c.id, c.contenu, c.cree_a, c.utilisateur_id,
              u.nom_utilisateur AS username, u.nom_complet
       FROM commentaires c
       JOIN utilisateurs u ON c.utilisateur_id = u.id
       WHERE c.id = ?`,
      [result.insertId]
    )

    res.status(201).json({
      message: 'Commentaire ajouté',
      comment: newComment[0]
    })

  } catch (error) {
    console.error('addComment error:', error.message)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

// ─── SUPPRIMER UN COMMENTAIRE ────────────────────────────
const deleteComment = async (req, res) => {
  try {
    const { id: commentId } = req.params

    // Vérifier que le commentaire existe et appartient à l'utilisateur
    const [comments] = await db.query(
      'SELECT * FROM commentaires WHERE id = ? AND utilisateur_id = ?',
      [commentId, req.user.id]
    )

    if (comments.length === 0) {
      return res.status(404).json({ message: 'Commentaire introuvable ou non autorisé' })
    }

    await db.query('DELETE FROM commentaires WHERE id = ?', [commentId])

    res.status(200).json({ message: 'Commentaire supprimé avec succès' })

  } catch (error) {
    console.error('deleteComment error:', error.message)
    res.status(500).json({ message: 'Erreur serveur', error: error.message })
  }
}

module.exports = { addComment, deleteComment }