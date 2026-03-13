
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import ArticleForm from '../components/articles/ArticleForm'
import * as api from '../lib/api'

export default function ModifierArticle() {
  const { id }                  = useParams()
  const navigate                = useNavigate()
  const [initialData, setInitialData] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.getArticle(id)
        const a   = res.data.article
        setInitialData({
          titre             : a.titre,
          contenu           : a.contenu,
          est_public        : a.est_public,
          commentaires_actifs: a.commentaires_actifs,
        })
      } catch (err) {
        alert('Erreur chargement article')
      }
    }
    fetch()
  }, [id])

  const handleSubmit = async (form) => {
    try {
      await api.updateArticle(id, form)
      navigate(`/articles/${id}`)
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur modification')
    }
  }

  if (!initialData) return <div className="container mt-4"><p>Chargement...</p></div>

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <h2 className="mb-4">Modifier l'Article</h2>
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