import { useState, useEffect } from 'react'
import FriendCard from '../components/friends/FriendCard'
import SearchUser from '../components/friends/SearchUser'
import {
  getFriends,
  getFriendRequests,
  confirmFriendRequest,
  deleteFriend,
  blockFriend
} from '../lib/api'

const Amis = () => {
  const [activeTab, setActiveTab] = useState('amis') // 'amis' | 'demandes' | 'recherche'
  const [friends, setFriends] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ text: '', type: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [friendsData, requestsData] = await Promise.all([
        getFriends(),
        getFriendRequests()
      ])
      setFriends(friendsData)
      setRequests(requestsData)
    } catch (err) {
      showMessage('Erreur lors du chargement des données', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 3000)
  }

  // Confirmer une demande d'ami
  const handleConfirm = async (friendshipId) => {
    try {
      await confirmFriendRequest(friendshipId)
      showMessage('Demande acceptée !')
      fetchData() // Rafraîchir les deux listes
    } catch (err) {
      showMessage('Erreur lors de la confirmation', 'danger')
    }
  }

  // Refuser une demande (supprimer la relation en attente)
  const handleRefuse = async (friendshipId) => {
    try {
      await deleteFriend(friendshipId)
      setRequests(prev => prev.filter(r => r.friendship_id !== friendshipId))
      showMessage('Demande refusée')
    } catch (err) {
      showMessage('Erreur lors du refus', 'danger')
    }
  }

  // Supprimer un ami
  const handleDelete = async (friendshipId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet ami ?')) return
    try {
      await deleteFriend(friendshipId)
      setFriends(prev => prev.filter(f => f.friendship_id !== friendshipId))
      showMessage('Ami supprimé')
    } catch (err) {
      showMessage('Erreur lors de la suppression', 'danger')
    }
  }

  // Bloquer un ami
  const handleBlock = async (friendshipId) => {
    if (!window.confirm('Voulez-vous vraiment bloquer cet utilisateur ? Ses articles disparaîtront de votre dashboard.')) return
    try {
      await blockFriend(friendshipId)
      setFriends(prev => prev.filter(f => f.friendship_id !== friendshipId))
      showMessage('Utilisateur bloqué. Ses articles ne s\'afficheront plus.')
    } catch (err) {
      showMessage('Erreur lors du blocage', 'danger')
    }
  }

  return (
    <div className="container mt-4">
      <h1 className="h3 mb-4">Gestion des Amis</h1>

      {/* Message de feedback */}
      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible`}>
          {message.text}
        </div>
      )}

      {/* Onglets */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'amis' ? 'active' : ''}`}
            onClick={() => setActiveTab('amis')}
          >
            Mes Amis
            {friends.length > 0 && (
              <span className="badge bg-secondary ms-2">{friends.length}</span>
            )}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'demandes' ? 'active' : ''}`}
            onClick={() => setActiveTab('demandes')}
          >
            Demandes Reçues
            {requests.length > 0 && (
              <span className="badge bg-danger ms-2">{requests.length}</span>
            )}
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'recherche' ? 'active' : ''}`}
            onClick={() => setActiveTab('recherche')}
          >
            Rechercher
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Onglet : Mes Amis */}
          {activeTab === 'amis' && (
            <div>
              {friends.length === 0 ? (
                <p className="text-muted fst-italic">Vous n'avez pas encore d'amis.</p>
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

          {/* Onglet : Demandes Reçues */}
          {activeTab === 'demandes' && (
            <div>
              {requests.length === 0 ? (
                <p className="text-muted fst-italic">Aucune demande en attente.</p>
              ) : (
                <div className="row g-3">
                  {requests.map(req => (
                    <div className="col-md-6 col-lg-4" key={req.friendship_id}>
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <h5 className="card-title">{req.nom_complet}</h5>
                          <p className="text-muted mb-3">@{req.username}</p>
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success btn-sm flex-fill"
                              onClick={() => handleConfirm(req.friendship_id)}
                            >
                              Accepter
                            </button>
                            <button
                              className="btn btn-outline-danger btn-sm flex-fill"
                              onClick={() => handleRefuse(req.friendship_id)}
                            >
                              Refuser
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

          {/* Onglet : Rechercher */}
          {activeTab === 'recherche' && (
            <SearchUser onRequestSent={() => showMessage('Demande d\'ami envoyée !')} />
          )}
        </>
      )}
    </div>
  )
}

export default Amis
