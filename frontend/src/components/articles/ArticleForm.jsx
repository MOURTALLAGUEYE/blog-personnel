import { useState, useEffect } from 'react'

export default function ArticleForm({ onSubmit, initialData }) {
  const [form, setForm] = useState({
    titre              : '',
    contenu            : '',
    est_public         : true,
    commentaires_actifs: true,
  })

  useEffect(() => {
    if (initialData) setForm(initialData)
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label fw-bold">Titre</label>
        <input
          type="text"
          name="titre"
          className="form-control"
          value={form.titre}
          onChange={handleChange}
          placeholder="Titre de l'article"
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label fw-bold">Contenu</label>
        <textarea
          name="contenu"
          className="form-control"
          rows={6}
          value={form.contenu}
          onChange={handleChange}
          placeholder="Écrivez votre article ici..."
          required
        />
      </div>

      <div className="mb-3 form-check">
        <input
          type="checkbox"
          name="est_public"
          className="form-check-input"
          id="estPublic"
          checked={form.est_public}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="estPublic">
          🌍 Article public (visible par vos amis)
        </label>
      </div>

      <div className="mb-4 form-check">
        <input
          type="checkbox"
          name="commentaires_actifs"
          className="form-check-input"
          id="commActifs"
          checked={form.commentaires_actifs}
          onChange={handleChange}
        />
        <label className="form-check-label" htmlFor="commActifs">
          💬 Autoriser les commentaires
        </label>
      </div>

      <button type="submit" className="btn btn-primary w-100">
        💾 Enregistrer l'article
      </button>
    </form>
  )
}