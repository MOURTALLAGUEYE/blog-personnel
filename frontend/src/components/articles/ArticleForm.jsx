import { useState, useEffect } from 'react'

export default function ArticleForm({ onSubmit, initialData }) {
  const [form, setForm] = useState({
    titre: '', contenu: '', est_public: true, commentaires_actifs: true,
  })

  useEffect(() => { if (initialData) setForm(initialData) }, [initialData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form) }}>
      <div className="mb-4">
        <label className="glass-label">Titre de l'article</label>
        <input
          type="text" name="titre"
          className="glass-input form-control"
          value={form.titre}
          onChange={handleChange}
          placeholder="Un titre accrocheur..."
          required
        />
      </div>

      <div className="mb-4">
        <label className="glass-label">Contenu</label>
        <textarea
          name="contenu"
          className="glass-input form-control"
          rows={7}
          value={form.contenu}
          onChange={handleChange}
          placeholder="Écrivez votre article ici..."
          required
        />
      </div>

      <label className="glass-check">
        <input
          type="checkbox" name="est_public"
          checked={form.est_public}
          onChange={handleChange}
        />
        <div>
          <div className="glass-check-label">🌍 Article public</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            Visible par vos amis confirmés
          </div>
        </div>
      </label>

      <label className="glass-check">
        <input
          type="checkbox" name="commentaires_actifs"
          checked={form.commentaires_actifs}
          onChange={handleChange}
        />
        <div>
          <div className="glass-check-label">💬 Autoriser les commentaires</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            Les lecteurs pourront commenter
          </div>
        </div>
      </label>

      <div className="mt-4">
        <button type="submit" className="btn btn-gradient w-100 py-3">
          💾 Enregistrer l'article
        </button>
      </div>
    </form>
  )
}