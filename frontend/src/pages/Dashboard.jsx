import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getArticles } from '../lib/api'
import ArticleCard from '../components/articles/ArticleCard'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user } = useAuth()
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Charger les articles au montage du composant
  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const data = await getArticles()
      setArticles(data)
    } catch (err) {
      setError('Impossible de charger les articles. Veuillez réessayer.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Séparer mes articles des articles des amis
  const mesArticles = articles.filter(a => a.user_id === user?.id)
  const articlesAmis = articles.filter(a => a.user_id !== user?.id)

  // Callback après suppression d'un article
  const handleDelete = (deletedId) => {
    setArticles(prev => prev.filter(a => a.id !== deletedId))
  }

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      {/* En-tête */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Mon Dashboard</h1>
        <Link to="/articles/new" className="btn btn-primary">
          + Nouvel Article
        </Link>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* Section : Mes Articles */}
      <section className="mb-5">
        <h2 className="h5 border-bottom pb-2 mb-3">
          Mes Articles
          <span className="badge bg-secondary ms-2">{mesArticles.length}</span>
        </h2>

        {mesArticles.length === 0 ? (
          <div className="text-muted fst-italic">
            Vous n'avez pas encore d'articles.{' '}
            <Link to="/articles/new">Créer votre premier article</Link>
          </div>
        ) : (
          <div className="row g-3">
            {mesArticles.map(article => (
              <div className="col-md-6 col-lg-4" key={article.id}>
                <ArticleCard
                  article={article}
                  onDelete={handleDelete}
                  showActions={true}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Section : Articles des Amis */}
      <section>
        <h2 className="h5 border-bottom pb-2 mb-3">
          Articles de mes Amis
          <span className="badge bg-info ms-2">{articlesAmis.length}</span>
        </h2>

        {articlesAmis.length === 0 ? (
          <div className="text-muted fst-italic">
            Aucun article d'ami pour l'instant.{' '}
            <Link to="/amis">Ajouter des amis</Link> pour voir leurs articles publics.
          </div>
        ) : (
          <div className="row g-3">
            {articlesAmis.map(article => (
              <div className="col-md-6 col-lg-4" key={article.id}>
                <ArticleCard
                  article={article}
                  onDelete={handleDelete}
                  showActions={false}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard
