import { useState } from 'react'
import { searchUsers, sendFriendRequest } from '../../lib/api'

export default function SearchUser({ onRequestSent }) {
  const [query,   setQuery]   = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [erreur,  setErreur]  = useState('')
  const [sent,    setSent]    = useState([])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return
    setErreur(''); setLoading(true)
    try {
      const data = await searchUsers(query.trim())
      setResults(data || [])
      if (!data?.length) setErreur('Aucun utilisateur trouvé')
    } catch { setErreur('Erreur de recherche') }
    finally { setLoading(false) }
  }

  const handleSend = async (userId) => {
    try {
      await sendFriendRequest(userId)
      setSent(prev => [...prev, userId])
      if (onRequestSent) onRequestSent()
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur envoi')
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="d-flex gap-3 mb-4">
        <input
          type="text"
          className="glass-input form-control"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Rechercher par username..."
          required
        />
        <button type="submit" className="btn btn-gradient px-4" disabled={loading}>
          {loading ? '⏳' : '🔍 Chercher'}
        </button>
      </form>

      {erreur && <div className="alert-glass mb-3">{erreur}</div>}

      {results.length > 0 && (
        <div className="row g-3">
          {results.map(u => (
            <div key={u.id} className="col-md-6 col-lg-4">
              <div className="friend-card">
                <div className="friend-avatar">
                  {u.nom_complet?.charAt(0).toUpperCase()}
                </div>
                <h6 style={{ color: 'white', fontWeight: 700, marginBottom: 4 }}>
                  {u.nom_complet}
                </h6>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>
                  @{u.username}
                </p>
                {sent.includes(u.id) ? (
                  <div style={{
                    background: 'rgba(16,185,129,0.15)',
                    border: '1px solid rgba(16,185,129,0.3)',
                    borderRadius: 10, padding: '8px',
                    color: '#6ee7b7', fontSize: 13, fontWeight: 600, textAlign: 'center'
                  }}>
                    ✅ Demande envoyée
                  </div>
                ) : (
                  <button className="btn btn-gradient btn-sm w-100"
                    onClick={() => handleSend(u.id)}>
                    ➕ Ajouter
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}