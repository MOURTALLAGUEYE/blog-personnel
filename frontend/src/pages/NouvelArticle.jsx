import { useNavigate, Link } from 'react-router-dom'
import ArticleForm from '../components/articles/ArticleForm'
import * as api from '../lib/api'

export default function NouvelArticle() {
  const navigate = useNavigate()

  const handleSubmit = async (form) => {
    try {
      await api.createArticle(form)
      navigate('/dashboard')
    } catch (err) {
      alert(err.response?.data?.message || 'Erreur création article')
    }
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="d-flex align-items-center mb-4 gap-3">
            <Link to="/dashboard" className="btn btn-outline-secondary btn-sm">
              ← Retour
            </Link>
            <h2 className="mb-0">Nouvel Article</h2>
          </div>
          <div className="card shadow">
            <div className="card-body p-4">
              <ArticleForm onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}