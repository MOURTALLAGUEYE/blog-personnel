import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import FriendCard from '../components/friends/FriendCard'
import SearchUser from '../components/friends/SearchUser'
import {
  getFriends,
  getFriendRequests,
  confirmFriendRequest,
  deleteFriend,
  blockFriend,
  getBlockedUsers
} from '../lib/api'

export default function Amis() {
  const [activeTab, setActiveTab] = useState('amis')
  const [friends,   setFriends]   = useState([])
  const [requests,  setRequests]  = useState([])
  const [blocked,   setBlocked]   = useState([])
  const [loading,   setLoading]   = useState(true)
  const [message,   setMessage]   = useState({ text: '', type: '' })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [friendsData, requestsData, blockedData] = await Promise.all([
        getFriends(),
        getFriendRequests(),
        getBlockedUsers()
      ])
      setFriends(friendsData   || [])
      setRequests(requestsData || [])
      setBlocked(blockedData   || [])
    } catch (err) {
      showMessage('Erreur lors du chargement', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  const handleConfirm = async (friendshipId) => {
    try {
      await confirmFriendRequest(friendshipId)
      showMessage('✅ Demande acceptée !')
      fetchData()
    } catch (err) {
      showMessage('Erreur confirmation', 'danger')
    }
  }

  const handleRefuse = async (friendshipId) => {
    try {
      await deleteFriend(friendshipId)
      setRequests(prev => prev.filter(r => r.friendship_id !== friendshipId))
      showMessage('Demande refusée')
    } catch (err) {
      showMessage('Erreur refus', 'danger')
    }
  }

  const handleDelete = async (friendshipId) => {
    if (!window.confirm('Supprimer cet ami ?')) return
    try {
      await deleteFriend(friendshipId)
      setFriends(prev => prev.filter(f => f.friendship_id !== friendshipId))
      showMessage('Ami supprimé')
    } catch (err) {
      showMessage('Erreur suppression', 'danger')
    }
  }

  const handleBlock = async (friendshipId) => {
    if (!window.confirm('Bloquer cet utilisateur ?')) return
    try {
      await blockFriend(friendshipId)
      fetchData()
      showMessage('Utilisateur bloqué 🚫')
    } catch (err) {
      showMessage('Erreur blocage', 'danger')
    }
  }

  const handleUnblock = async (friendshipId) => {
    if (!window.confirm('Débloquer cet utilisateur ?')) return
    try {
      await deleteFriend(friendshipId)
      setBlocked(prev => prev.filter(b => b.friendship_id !== friendshipId))
      showMessage('Utilisateur débloqué ✅')
    } catch (err) {
      showMessage('Erreur déblocage', 'danger')
    }
  }

  return (
    <div>
      <nav className="navbar navbar-dark bg-dark px-4 mb-4">
        <span className="navbar-brand fw-bold">📝 Blog Personnel</span>
        <div className="d-flex gap-2">
          <Link to="/dashboard" className="btn btn-sm btn-outline-light">🏠 Dashboard</Link>
          <Link to="/articles/new" className="btn btn-sm btn-primary">✍️ Nouvel Article</Link>
        </div>
      </nav>

      <div className="container">
        <h3 className="fw-bold mb-4">👥 Gestion des Amis</h3>

        {message.text && (
          <div className={`alert alert-${message.type}`}>{message.text}</div>
        )}

        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'amis' ? 'active' : ''}`}
              onClick={() => setActiveTab('amis')}>
              👥 Mes Amis
              {friends.length > 0 && <span className="badge bg-secondary ms-2">{friends.length}</span>}
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'demandes' ? 'active' : ''}`}
              onClick={() => setActiveTab('demandes')}>
              📩 Demandes
              {requests.length > 0 && <span className="badge bg-danger ms-2">{requests.length}</span>}
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'recherche' ? 'active' : ''}`}
              onClick={() => setActiveTab('recherche')}>
              🔍 Rechercher
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === 'bloques' ? 'active' : ''}`}
              onClick={() => setActiveTab('bloques')}>
              🚫 Bloqués
              {blocked.length > 0 && <span className="badge bg-dark ms-2">{blocked.length}</span>}
            </button>
          </li>
        </ul>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status"/>
            <p className="mt-2">Chargement...</p>
          </div>
        ) : (
          <>
            {activeTab === 'amis' && (
              <div>
                {friends.length === 0 ? (
                  <div className="alert alert-info">
                    Pas encore d'amis.{' '}
                    <button className="btn btn-link p-0" onClick={() => setActiveTab('recherche')}>
                      Recherchez des utilisateurs !
                    </button>
                  </div>
                ) : (
                  <div className="row g-3">
                    {friends.map(friend => (
                      <div className="col-md-6 col-lg-4" key={friend.friendship_id}>
                        <FriendCard
                          friend={friend}
                          onDelete={() => handleDelete(friend.friendship_id)}
                          onBlock={() => handleBlock(friend.friendship_id)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'demandes' && (
              <div>
                {requests.length === 0 ? (
                  <div className="alert alert-info">Aucune demande en attente.</div>
                ) : (
                  <div className="row g-3">
                    {requests.map(req => (
                      <div className="col-md-6 col-lg-4" key={req.friendship_id}>
                        <div className="card shadow-sm">
                          <div className="card-body">
                            <h5 className="card-title">{req.nom_complet}</h5>
                            <p className="text-muted mb-3">@{req.username}</p>
                            <div className="d-flex gap-2">
                              <button className="btn btn-success btn-sm flex-fill"
                                onClick={() => handleConfirm(req.friendship_id)}>
                                ✅ Accepter
                              </button>
                              <button className="btn btn-outline-danger btn-sm flex-fill"
                                onClick={() => handleRefuse(req.friendship_id)}>
                                ❌ Refuser
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'recherche' && (
              <SearchUser onRequestSent={() => showMessage("✅ Demande d'ami envoyée !")} />
            )}

            {activeTab === 'bloques' && (
              <div>
                {blocked.length === 0 ? (
                  <div className="alert alert-info">Aucun utilisateur bloqué.</div>
                ) : (
                  <div className="row g-3">
                    {blocked.map(b => (
                      <div className="col-md-6 col-lg-4" key={b.friendship_id}>
                        <div className="card shadow-sm border-danger border-2">
                          <div className="card-body">
                            <div className="d-flex align-items-center mb-3">
                              <div className="rounded-circle bg-danger text-white d-flex
                                             align-items-center justify-content-center me-3"
                                   style={{ width: 45, height: 45, fontSize: 18 }}>
                                🚫
                              </div>
                              <div>
                                <h6 className="mb-0 fw-bold">{b.nom_complet}</h6>
                                <small className="text-muted">@{b.username}</small>
                              </div>
                            </div>
                            <button className="btn btn-outline-success btn-sm w-100"
                              onClick={() => handleUnblock(b.friendship_id)}>
                              ✅ Débloquer
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}