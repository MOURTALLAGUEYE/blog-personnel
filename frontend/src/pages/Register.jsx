import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register as apiRegister } from '../lib/api'

export default function Register() {
  const [form,    setForm]    = useState({ nom_complet: '', username: '', password: '' })
  const [erreur,  setErreur]  = useState('')
  const [succes,  setSucces]  = useState('')
  const [loading, setLoading] = useState(false)
  const navigate              = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setSucces('')
    setLoading(true)
    try {
      await apiRegister(form)
      setSucces('Inscription réussie ! Redirection...')
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur inscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">🌟</div>
        <h1 className="auth-title">Créer un compte</h1>
        <p className="auth-subtitle">Rejoignez la communauté Blog Personnel</p>

        {erreur  && <div className="alert-glass mb-4">⚠️ {erreur}</div>}
        {succes  && <div className="alert-glass-success mb-4">✅ {succes}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="glass-label">Nom complet</label>
            <input
              type="text"
              name="nom_complet"
              className="glass-input form-control"
              value={form.nom_complet}
              onChange={handleChange}
              placeholder="Votre nom complet"
              required
            />
          </div>
          <div className="mb-4">
            <label className="glass-label">Nom d'utilisateur</label>
            <input
              type="text"
              name="username"
              className="glass-input form-control"
              value={form.username}
              onChange={handleChange}
              placeholder="Choisissez un username unique"
              required
            />
          </div>
          <div className="mb-4">
            <label className="glass-label">Mot de passe</label>
            <input
              type="password"
              name="password"
              className="glass-input form-control"
              value={form.password}
              onChange={handleChange}
              placeholder="Choisissez un mot de passe"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-gradient w-100 py-3 mb-4"
            disabled={loading}>
            {loading ? '⏳ Création...' : '✨ Créer mon compte'}
          </button>
        </form>

        <div className="glass-divider"/>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
          Déjà un compte ?{' '}
          <Link to="/"
            style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none' }}>
            Connect →
          </Link>
        </p>
      </div>
    </div>
  )
}