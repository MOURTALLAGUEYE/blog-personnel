import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getArticles, deleteArticle } from '../lib/api'

export default function Dashboard() {
  const { user, logout }         = useAuth()
  const navigate                 = useNavigate()
  const [mesArticles,  setMes]   = useState([])
  const [articlesAmis, setAmis]  = useState([])
  const [loading,  setLoading]   = useState(true)
  const [erreur,   setErreur]    = useState('')

  useEffect(() => { charger() }, [])

  const charger = async () => {
    try {
      const data = await getArticles()
      setMes(data.mesArticles   || [])
      setAmis(data.articlesAmis || [])
    } catch {
      setErreur('Erreur chargement des articles')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet article ?')) return
    try {
      await deleteArticle(id)
      setMes(prev => prev.filter(a => a.id !== id))
    } catch {
      alert('Erreur suppression')
    }
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* NAVBAR */}
      <nav className="navbar-glass d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-3">
          <div style={{
            width: 40, height: 40,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: 12, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 18
          }}>✍️</div>
          <span style={{ fontWeight: 800, fontSize: 18, color: 'white' }}>
            Blog Personnel
          </span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div style={{
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 20, padding: '6px 14px',
            color: '#818cf8', fontSize: 14, fontWeight: 600
          }}>
            👤 {user?.username}
          </div>
          <Link to="/articles/new" className="btn btn-gradient btn-sm px-4">
            ✍️ Nouvel Article
          </Link>
          <Link to="/amis" className="btn btn-glass btn-sm px-4">
            👥 Amis
          </Link>
          <button className="btn btn-glass btn-sm px-4"
            style={{ color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
            onClick={() => { logout(); navigate('/') }}>
            🚪 Quitter
          </button>
        </div>
      </nav>

      <div className="container py-5">
        {/* WELCOME */}
        <div className="mb-5" style={{ animation: 'fadeInUp 0.5s ease' }}>
          <h1 style={{
            fontSize: 32, fontWeight: 800,
            background: 'linear-gradient(135deg, #fff 0%, #818cf8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            Bonjour, {user?.nom_complet?.split(' ')[0]} ! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6 }}>
            Bienvenue sur votre tableau de bord personnel
          </p>
        </div>

        {/* STATS */}
        <div className="row g-3 mb-5">
          {[
            { icon: '📝', num: mesArticles.length,  label: 'Mes Articles' },
            { icon: '👥', num: articlesAmis.length, label: 'Articles Amis' },
            { icon: '🌍', num: mesArticles.filter(a => a.est_public).length,  label: 'Publics' },
            { icon: '🔒', num: mesArticles.filter(a => !a.est_public).length, label: 'Privés' },
          ].map((s, i) => (
            <div className="col-6 col-md-3" key={i}>
              <div className="stat-card" style={{ animationDelay: `${i*0.1}s` }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div className="stat-number">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {erreur && <div className="alert-glass mb-4">{erreur}</div>}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-gradient mb-3"/>
            <p style={{ color: 'var(--text-muted)' }}>Chargement...</p>
          </div>
        ) : (
          <>
            {/* MES ARTICLES */}
            <div className="mb-5">
              <div className="section-title">📋 Mes Articles ({mesArticles.length})</div>

              {mesArticles.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📝</div>
                  <p className="empty-state-text">Aucun article pour l'instant</p>
                  <Link to="/articles/new" className="btn btn-gradient mt-3 px-4">
                    ✍️ Créer mon premier article
                  </Link>
                </div>
              ) : (
                <div className="row g-4">
                  {mesArticles.map((a, i) => (
                    <div key={a.id} className="col-md-6 col-lg-4"
                         style={{ animation: `fadeInUp 0.5s ease ${i*0.1}s both` }}>
                      <div className="article-card">
                        <div className="article-card-header">
                          <div className="d-flex gap-2 mb-2">
                            <span className={a.est_public ? 'badge-public' : 'badge-prive'}>
                              {a.est_public ? '🌍 Public' : '🔒 Privé'}
                            </span>
                            <span className={a.commentaires_actifs ? 'badge-comment-on' : 'badge-comment-off'}>
                              {a.commentaires_actifs ? '💬 ON' : '🔇 OFF'}
                            </span>
                          </div>
                          <h6 style={{ color: 'white', fontWeight: 700, margin: 0 }}>
                            {a.titre}
                          </h6>
                        </div>
                        <div className="article-card-body">
                          <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
                            {a.contenu?.substring(0, 90)}...
                          </p>
                        </div>
                        <div className="article-card-footer">
                          <Link to={`/articles/${a.id}`}
                            className="btn btn-glass btn-sm flex-fill" style={{ fontSize: 13 }}>
                            👁️ Voir
                          </Link>
                          <Link to={`/articles/edit/${a.id}`}
                            className="btn btn-glass btn-sm flex-fill" style={{ fontSize: 13 }}>
                            ✏️ Modifier
                          </Link>
                          <button
                            className="btn btn-sm flex-fill"
                            style={{
                              background: 'rgba(239,68,68,0.1)',
                              border: '1px solid rgba(239,68,68,0.3)',
                              color: '#f87171', borderRadius: 10, fontSize: 13
                            }}
                            onClick={() => handleDelete(a.id)}>
                            🗑️
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
              <div className="section-title">👥 Articles de mes Amis ({articlesAmis.length})</div>

              {articlesAmis.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">👥</div>
                  <p className="empty-state-text">Aucun article d'amis pour l'instant</p>
                  <Link to="/amis" className="btn btn-gradient mt-3 px-4">
                    👥 Gérer mes amis
                  </Link>
                </div>
              ) : (
                <div className="row g-4">
                  {articlesAmis.map((a, i) => (
                    <div key={a.id} className="col-md-6 col-lg-4"
                         style={{ animation: `fadeInUp 0.5s ease ${i*0.1}s both` }}>
                      <div className="article-card"
                           style={{ borderColor: 'rgba(99,102,241,0.2)' }}>
                        <div className="article-card-header"
                             style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(99,102,241,0.15))' }}>
                          <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'rgba(99,102,241,0.2)',
                            borderRadius: 20, padding: '4px 12px',
                            color: '#818cf8', fontSize: 13, fontWeight: 600, marginBottom: 8
                          }}>
                            👤 @{a.username}
                          </div>
                          <h6 style={{ color: 'white', fontWeight: 700, margin: 0 }}>
                            {a.titre}
                          </h6>
                        </div>
                        <div className="article-card-body">
                          <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>
                            {a.contenu?.substring(0, 90)}...
                          </p>
                        </div>
                        <div className="article-card-footer">
                          <Link to={`/articles/${a.id}`}
                            className="btn btn-gradient btn-sm w-100" style={{ fontSize: 13 }}>
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