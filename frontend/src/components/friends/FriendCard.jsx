const FriendCard = ({ friend, onDelete, onBlock }) => {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <h5 className="card-title">{friend.nom_complet}</h5>
        <p className="text-muted mb-3">@{friend.username}</p>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-danger btn-sm flex-fill"
            onClick={onDelete}
          >
            Supprimer
          </button>
          <button
            className="btn btn-outline-warning btn-sm flex-fill"
            onClick={onBlock}
          >
            Bloquer
          </button>
        </div>
      </div>
    </div>
  )
}

export default FriendCard