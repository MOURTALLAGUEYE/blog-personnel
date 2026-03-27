export default function FriendCard({ friend, onDelete, onBlock }) {
  return (
    <div className="friend-card">
      <div className="friend-avatar">
        {friend.nom_complet?.charAt(0).toUpperCase()}
      </div>
      <h6 style={{ color: 'white', fontWeight: 700, marginBottom: 4 }}>
        {friend.nom_complet}
      </h6>
      <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 16 }}>
        @{friend.username}
      </p>
      <div style={{
        width: 40, height: 3,
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
        borderRadius: 2, margin: '0 auto 16px'
      }}/>
      <div className="d-flex gap-2">
        <button className="btn btn-sm flex-fill"
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.25)',
            color: '#f87171', borderRadius: 10, fontSize: 13, fontWeight: 600
          }}
          onClick={onDelete}>
          🗑️ Supprimer
        </button>
        <button className="btn btn-sm flex-fill"
          style={{
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.25)',
            color: '#fbbf24', borderRadius: 10, fontSize: 13, fontWeight: 600
          }}
          onClick={onBlock}>
          🚫 Bloquer
        </button>
      </div>
    </div>
  )
}