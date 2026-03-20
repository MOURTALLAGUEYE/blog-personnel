import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getArticles, deleteArticle } from '../lib/api'

export default function Dashboard() {
  const { user, logout }   = useAuth()
  const navigate           = useNavigate()
  const [mesArticles,    setMesArticles]    = useState([])
  const [articlesAmis,   setArticlesAmis]   = useState([])
  const [erreur,         setErreur]         = useState('')
  const [chargement,     setChargement]     = useState(true)

  useEffect(() => { chargerArticles() }, [])

  const chargerArticles = async () => {
    try {
      const data = await getArticles()
      setMesArticles(data.mesArticles   || [])
      setArticlesAmis(data.articlesAmis || [])
    } catch (err) {
      setErreur('Erreur lors du chargement des articles')
    } finally {
      setChargement(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet article ?')) return
    try {
      await deleteArticle(id)
      setMesArticles(mesArticles.filter(a => a.id !== id))
    } catch (err) {
      setErreur('Erreur lors de la suppression')
    }
  }

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark px-4">
        <span className="navbar-brand fw-bold">📝 Blog Personnel</span>
        <div className="d-flex gap-2 align-items-center">
          <span className="text-white me-2">👤 {user?.username}</span>
          <Link to="/articles/new" className="btn btn-sm btn-primary">
            ✍️ Nouvel Article
          </Link>
          <Link to="/amis" className="btn btn-sm btn-outline-light">
            👥 Amis
          </Link>
          <button className="btn btn-sm btn-danger" onClick={handleLogout}>
            🚪 Déconnexion
          </button>
        </div>
      </nav>

      <div className="container mt-4">
        {erreur && <div className="alert alert-danger">{erreur}</div>}

        {chargement ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status"/>
            <p className="mt-2">Chargement...</p>
          </div>
        ) : (
          <>
            {/* MES ARTICLES */}
            <div className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold">📋 Mes Articles ({mesArticles.length})</h4>
                <Link to="/articles/new" className="btn btn-primary btn-sm">
                  + Nouvel Article
                </Link>
              </div>

              {mesArticles.length === 0 ? (
                <div className="alert alert-info">
                  Vous n'avez pas encore d'articles.{' '}
                  <Link to="/articles/new">Créez votre premier article !</Link>
                </div>
              ) : (
                <div className="row g-3">
                  {mesArticles.map(article => (
                    <div key={article.id} className="col-md-6 col-lg-4">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex gap-1 mb-2">
                            <span className={`badge ${article.est_public ? 'bg-success' : 'bg-secondary'}`}>
                              {article.est_public ? '🌍 Public' : '🔒 Privé'}
                            </span>
                            <span className={`badge ${article.commentaires_actifs ? 'bg-primary' : 'bg-warning text-dark'}`}>
                              {article.commentaires_actifs ? '💬 ON' : '🔇 OFF'}
                            </span>
                          </div>
                          <h6 className="card-title">{article.titre}</h6>
                          <p className="card-text text-muted small">
                            {article.contenu?.substring(0, 80)}...
                          </p>
                        </div>
                        <div className="card-footer d-flex gap-2">
                          <Link to={`/articles/${article.id}`}
                            className="btn btn-sm btn-outline-primary flex-fill">
                            👁️ Voir
                          </Link>
                          <Link to={`/articles/edit/${article.id}`}
                            className="btn btn-sm btn-outline-secondary flex-fill">
                            ✏️ Modifier
                          </Link>
                          <button
                            className="btn btn-sm btn-outline-danger flex-fill"
                            onClick={() => handleDelete(article.id)}>
                            🗑️ Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ARTICLES AMIS */}
            <div>
              <h4 className="fw-bold mb-3">👥 Articles de mes Amis ({articlesAmis.length})</h4>

              {articlesAmis.length === 0 ? (
                <div className="alert alert-light border">
                  Aucun article d'amis pour l'instant.{' '}
                  <Link to="/amis">Ajoutez des amis !</Link>
                </div>
              ) : (
                <div className="row g-3">
                  {articlesAmis.map(article => (
                    <div key={article.id} className="col-md-6 col-lg-4">
                      <div className="card h-100 shadow-sm border-start border-primary border-3">
                        <div className="card-body">
                          <p className="text-muted small mb-1">
                            👤 @{article.username}
                          </p>
                          <h6 className="card-title">{article.titre}</h6>
                          <p className="card-text text-muted small">
                            {article.contenu?.substring(0, 80)}...
                          </p>
                        </div>
                        <div className="card-footer">
                          <Link to={`/articles/${article.id}`}
                            className="btn btn-sm btn-outline-primary w-100">
                            👁️ Voir l'article
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}