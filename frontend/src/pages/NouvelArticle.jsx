
import { useNavigate } from 'react-router-dom'
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
          <h2 className="mb-4">Nouvel Article</h2>
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