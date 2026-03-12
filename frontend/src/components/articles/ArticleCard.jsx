import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import * as api from '../../lib/api'

export default function ArticleCard({ article, onDelete }) {
  const { user } = useAuth()
  const isAuteur = user?.id === article.user_id

  const handleDelete = async () => {
    if (window.confirm('Supprimer cet article ?')) {
      try {
        await api.deleteArticle(article.id)
        onDelete(article.id)
      } catch (err) {
        alert('Erreur lors de la suppression')
      }
    }
  }

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">

        {/* Badges */}
        <div className="mb-2">
          <span className={`badge me-2 ${article.est_public ? 'bg-success' : 'bg-secondary'}`}>
            {article.est_public ? 'Public' : 'Privé'}
          </span>
          <span className={`badge ${article.commentaires_actifs ? 'bg-primary' : 'bg-warning text-dark'}`}>
            {article.commentaires_actifs ? 'Commentaires activés' : 'Commentaires désactivés'}
          </span>
        </div>

        {/* Titre */}
        <h5 className="card-title">{article.titre}</h5>

        {/* Auteur */}
        <p className="text-muted small">
          Par <strong>{article.nom_complet}</strong> (@{article.username})
        </p>

        {/* Extrait du contenu */}
        <p className="card-text">
          {article.contenu.substring(0, 100)}
          {article.contenu.length > 100 ? '...' : ''}
        </p>

        {/* Boutons */}
        <div className="d-flex gap-2">
          <Link to={`/articles/${article.id}`} className="btn btn-outline-primary btn-sm">
            Lire
          </Link>

          {isAuteur && (
            <>
              <Link to={`/articles/edit/${article.id}`} className="btn btn-outline-warning btn-sm">
                Modifier
              </Link>
              <button onClick={handleDelete} className="btn btn-outline-danger btn-sm">
                Supprimer
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}