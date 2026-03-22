import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import CommentSection from '../components/articles/CommentSection'
import * as api from '../lib/api'

export default function DetailArticle() {
  const { id }      = useParams()
  const { user }    = useAuth()
  const navigate    = useNavigate()
  const [article,  setArticle]  = useState(null)
  const [comments, setComments] = useState([])
  const [erreur,   setErreur]   = useState('')

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await api.getArticle(id)
        setArticle(res.article)
        setComments(res.comments || [])
      } catch (err) {
        setErreur('Article introuvable ou accès refusé')
      }
    }
    charger()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Supprimer cet article ?')) return
    try {
      await api.deleteArticle(id)
      navigate('/dashboard')
    } catch (err) {
      alert('Erreur suppression')
    }
  }

  if (erreur)   return (
    <div className="container mt-4">
      <div className="alert alert-danger">{erreur}</div>
      <Link to="/dashboard" className="btn btn-outline-secondary">
        ← Retour au Dashboard
      </Link>
    </div>
  )

  if (!article) return (
    <div className="container mt-4 text-center">
      <div className="spinner-border text-primary" role="status"/>
      <p className="mt-2">Chargement...</p>
    </div>
  )

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">

          {/* Badges */}
          <div className="mb-2">
            <span className={`badge me-2 ${article.est_public ? 'bg-success' : 'bg-secondary'}`}>
              {article.est_public ? '🌍 Public' : '🔒 Privé'}
            </span>
            <span className={`badge ${article.commentaires_actifs ? 'bg-primary' : 'bg-warning text-dark'}`}>
              {article.commentaires_actifs ? '💬 Commentaires ON' : '🔇 Commentaires OFF'}
            </span>
          </div>

          <h2>{article.titre}</h2>
          <p className="text-muted">
            Par <strong>{article.nom_complet}</strong> —{' '}
            {new Date(article.created_at).toLocaleDateString()}
          </p>
          <hr />
          <p style={{ whiteSpace: 'pre-wrap' }}>{article.contenu}</p>

          {/* Boutons auteur */}
          {user?.id === article.user_id && (
            <div className="d-flex gap-2 mt-3">
              <Link
                to={`/articles/edit/${article.id}`}
                className="btn btn-warning btn-sm">
                ✏️ Modifier
              </Link>
              <button
                onClick={handleDelete}
                className="btn btn-danger btn-sm">
                🗑️ Supprimer
              </button>
            </div>
          )}

          {/* Commentaires */}
          {article.commentaires_actifs ? (
            <CommentSection
              articleId={article.id}
              comments={comments}
              setComments={setComments}
            />
          ) : (
            <div className="alert alert-warning mt-4">
              Les commentaires sont désactivés pour cet article.
            </div>
          )}

          <Link to="/dashboard" className="btn btn-outline-secondary mt-3">
            ← Retour au Dashboard
          </Link>

        </div>
      </div>
    </div>
  )
}