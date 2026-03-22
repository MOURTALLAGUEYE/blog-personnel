const db = require('../config/db')

const getDashboardArticles = async (req, res) => {
  console.log('User dashboard :', req.user)
  const userId = req.user.id
  try {
    const [mesArticles] = await db.query(
      `SELECT a.*, u.nom_complet, u.nom_utilisateur AS username
       FROM articles a
       JOIN utilisateurs u ON a.utilisateur_id = u.id
       WHERE a.utilisateur_id = ?
       ORDER BY a.cree_a DESC`,
      [userId]
    )
    const [articlesAmis] = await db.query(
      `SELECT a.*, u.nom_complet, u.nom_utilisateur AS username
       FROM articles a
       JOIN utilisateurs u ON a.utilisateur_id = u.id
       JOIN amis f ON (
         (f.demandeur_id = ? AND f.receveur_id = a.utilisateur_id) OR
         (f.receveur_id = ? AND f.demandeur_id = a.utilisateur_id)
       )
       WHERE a.utilisateur_id != ?
         AND a.est_public = 1
         AND f.statut = 'accepter'
       ORDER BY a.cree_a DESC`,
      [userId, userId, userId]
    )
    res.status(200).json([...mesArticles, ...articlesAmis])
  } catch (err) {
    console.log('Erreur getDashboard :', err.message)
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

const getArticleById = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  try {
    const [articles] = await db.query(
      `SELECT a.*, u.nom_complet, u.nom_utilisateur AS username
       FROM articles a
       JOIN utilisateurs u ON a.utilisateur_id = u.id
       WHERE a.id = ?`,
      [id]
    )
    if (articles.length === 0) {
      return res.status(404).json({ message: 'Article non trouvé' })
    }
    const article = articles[0]
    if (!article.est_public && article.utilisateur_id !== userId) {
      return res.status(403).json({ message: 'Accès refusé' })
    }
    let comments = []
    if (article.commentaires_actifs) {
      const [rows] = await db.query(
        `SELECT c.*, u.nom_complet, u.nom_utilisateur AS username
         FROM commentaires c
         JOIN utilisateurs u ON c.utilisateur_id = u.id
         WHERE c.article_id = ?
         ORDER BY c.cree_a ASC`,
        [id]
      )
      comments = rows
    }
    res.status(200).json({ article, comments })
  } catch (err) {
    console.log('Erreur getArticleById :', err.message)
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

const createArticle = async (req, res) => {
  console.log('Créer article body :', req.body)
  console.log('User ID :', req.user)
  const { titre, contenu, est_public, commentaires_actifs } = req.body
  const userId = req.user.id
  if (!titre || !contenu) {
    return res.status(400).json({ message: 'Titre et contenu obligatoires' })
  }
  try {
    const [result] = await db.query(
      `INSERT INTO articles (utilisateur_id, titre, contenu, est_public, commentaires_actifs)
       VALUES (?, ?, ?, ?, ?)`,
      [
        userId, titre, contenu,
        est_public !== undefined ? est_public : 1,
        commentaires_actifs !== undefined ? commentaires_actifs : 1
      ]
    )
    res.status(201).json({
      message: 'Article créé avec succès',
      articleId: result.insertId
    })
  } catch (err) {
    console.log('Erreur createArticle :', err.message)
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

const updateArticle = async (req, res) => {
  const { id } = req.params
  const { titre, contenu, est_public, commentaires_actifs } = req.body
  const userId = req.user.id
  try {
    const [articles] = await db.query(
      'SELECT * FROM articles WHERE id = ?', [id]
    )
    if (articles.length === 0) {
      return res.status(404).json({ message: 'Article non trouvé' })
    }
    if (articles[0].utilisateur_id !== userId) {
      return res.status(403).json({ message: 'Non autorisé' })
    }
    await db.query(
      `UPDATE articles
       SET titre = ?, contenu = ?, est_public = ?, commentaires_actifs = ?
       WHERE id = ?`,
      [titre, contenu, est_public, commentaires_actifs, id]
    )
    res.status(200).json({ message: 'Article modifié avec succès' })
  } catch (err) {
    console.log('Erreur updateArticle :', err.message)
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

const deleteArticle = async (req, res) => {
  const { id } = req.params
  const userId = req.user.id
  try {
    const [articles] = await db.query(
      'SELECT * FROM articles WHERE id = ?', [id]
    )
    if (articles.length === 0) {
      return res.status(404).json({ message: 'Article non trouvé' })
    }
    if (articles[0].utilisateur_id !== userId) {
      return res.status(403).json({ message: 'Non autorisé' })
    }
    await db.query('DELETE FROM articles WHERE id = ?', [id])
    res.status(200).json({ message: 'Article supprimé avec succès' })
  } catch (err) {
    console.log('Erreur deleteArticle :', err.message)
    res.status(500).json({ message: 'Erreur serveur', error: err.message })
  }
}

module.exports = {
  getDashboardArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getAll : getDashboardArticles,
  getOne : getArticleById,
  create : createArticle,
  update : updateArticle,
  remove : deleteArticle,
}