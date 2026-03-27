export default function FriendCard({ friend, onDelete, onBlock }) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-center mb-3">
          <div className="rounded-circle bg-primary text-white d-flex align-items-center
                          justify-content-center me-3"
               style={{ width: 45, height: 45, fontSize: 18 }}>
            {friend.nom_complet?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h6 className="mb-0 fw-bold">{friend.nom_complet}</h6>
            <small className="text-muted">@{friend.username}</small>
          </div>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-danger btn-sm flex-fill"
            onClick={onDelete}>
            🗑️ Supprimer
          </button>
          <button
            className="btn btn-outline-warning btn-sm flex-fill"
            onClick={onBlock}>
            🚫 Bloquer
          </button>
        </div>
      </div>
    </div>
  )
}