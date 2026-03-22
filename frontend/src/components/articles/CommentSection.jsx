import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import * as api from '../../lib/api'

export default function CommentSection({ articleId, comments, setComments }) {
  const { user }  = useAuth()
  const [contenu, setContenu] = useState('')
  const [erreur,  setErreur]  = useState('')

  const handleAdd = async (e) => {
    e.preventDefault()
    setErreur('')
    try {
      const res = await api.addComment(articleId, contenu)
      setComments([...comments, res.comment])
      setContenu('')
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur ajout commentaire')
    }
  }

  const handleDelete = async (commentId) => {
    try {
      await api.deleteComment(commentId)
      setComments(comments.filter(c => c.id !== commentId))
    } catch (err) {
      alert('Erreur suppression commentaire')
    }
  }

  return (
    <div className="mt-4">
      <h5>💬 Commentaires ({comments.length})</h5>
      <hr />

      {comments.length === 0 && (
        <p className="text-muted">Aucun commentaire pour l'instant.</p>
      )}

      {comments.map(comment => (
        <div key={comment.id} className="card mb-2">
          <div className="card-body py-2">
            <div className="d-flex justify-content-between align-items-center">
              <strong>{comment.nom_complet}</strong>
              <small className="text-muted">
                {new Date(comment.created_at).toLocaleDateString()}
              </small>
            </div>
            <p className="mb-1 mt-1">{comment.contenu}</p>
            {user?.id === comment.user_id && (
              <button
                onClick={() => handleDelete(comment.id)}
                className="btn btn-outline-danger btn-sm">
                🗑️ Supprimer
              </button>
            )}
          </div>
        </div>
      ))}

      {erreur && <div className="alert alert-danger mt-2">{erreur}</div>}

      <form onSubmit={handleAdd} className="mt-3">
        <div className="mb-2">
          <textarea
            className="form-control"
            rows={3}
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            placeholder="Écrire un commentaire..."
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-sm">
          💬 Publier le commentaire
        </button>
      </form>
    </div>
  )
}