import { useState } from 'react'
import { searchUsers, sendFriendRequest } from '../../lib/api'

const SearchUser = ({ onRequestSent }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sentRequests, setSentRequests] = useState(new Set()) // IDs où demande déjà envoyée

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    try {
      setLoading(true)
      setError('')
      const data = await searchUsers(query.trim())
      setResults(data)
      if (data.length === 0) {
        setError('Aucun utilisateur trouvé pour ce username.')
      }
    } catch (err) {
      setError('Erreur lors de la recherche.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendRequest = async (userId) => {
    try {
      await sendFriendRequest(userId)
      setSentRequests(prev => new Set([...prev, userId]))
      if (onRequestSent) onRequestSent()
    } catch (err) {
      const msg = err.response?.data?.message || 'Erreur lors de l\'envoi de la demande.'
      setError(msg)
    }
  }

  return (
    <div>
      {/* Formulaire de recherche */}
      <form onSubmit={handleSearch} className="d-flex gap-2 mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher par username..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading || !query.trim()}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" />
          ) : (
            'Rechercher'
          )}
        </button>
      </form>

      {/* Message d'erreur / info */}
      {error && (
        <div className="alert alert-warning py-2">{error}</div>
      )}

      {/* Résultats */}
      {results.length > 0 && (
        <div className="row g-3">
          {results.map(user => (
            <div className="col-md-6 col-lg-4" key={user.id}>
              <div className="card shadow-sm">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <strong>{user.nom_complet}</strong>
                    <div className="text-muted small">@{user.username}</div>
                  </div>
                  {sentRequests.has(user.id) ? (
                    <span className="badge bg-success">Demande envoyée</span>
                  ) : (
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleSendRequest(user.id)}
                    >
                      Ajouter
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchUser
