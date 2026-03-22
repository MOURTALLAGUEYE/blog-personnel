import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ArticleForm from '../components/articles/ArticleForm'
import * as api from '../lib/api'

export default function ModifierArticle() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const [initialData, setInitialData] = useState(null)

  useEffect(() => {
    const charger = async () => {
      try {
        const res = await api.getArticle(id)
        const a   = res.article
        setInitialData({
          titre              : a.titre,
          contenu            : a.contenu,
          est_public         : a.est_public,
          commentaires_actifs: a.commentaires_actifs,
        })
      } catch (err) {
        alert('Erreur chargement article')
      }
    }
    charger()
  }, [id])

  const handleSubmit = async (form) => {
    try {
      await api.updateArticle(id, form)
      navigate('/dashboard')
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur modification')
    }
  }

  if (!initialData) return (
    <div className="container mt-4">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status"/>
        <p className="mt-2">Chargement...</p>
      </div>
    </div>
  )

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="d-flex align-items-center mb-4 gap-3">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => navigate('/dashboard')}>
              ← Retour
            </button>
            <h2 className="mb-0">Modifier l'Article</h2>
          </div>
          <div className="card shadow">
            <div className="card-body p-4">
              <ArticleForm onSubmit={handleSubmit} initialData={initialData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}