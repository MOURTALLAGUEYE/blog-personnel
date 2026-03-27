import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login as apiLogin } from '../lib/api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [erreur,   setErreur]   = useState('')
  const [loading,  setLoading]  = useState(false)
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setLoading(true)
    try {
      const res = await apiLogin({ username, password })
      login(res.user, res.token)
      navigate('/dashboard')
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-bg">
      <div className="auth-card">
        <div className="auth-logo">✍️</div>
        <h1 className="auth-title">Bon retour !</h1>
        <p className="auth-subtitle">Connectez-vous à votre blog personnel</p>

        {erreur && <div className="alert-glass mb-4">⚠️ {erreur}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="glass-label">Nom d'utilisateur</label>
            <input
              type="text"
              className="glass-input form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Votre username"
              required
            />
          </div>
          <div className="mb-4">
            <label className="glass-label">Mot de passe</label>
            <input
              type="password"
              className="glass-input form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-gradient w-100 py-3 mb-4"
            disabled={loading}>
            {loading ? '⏳ Connexion...' : '🚀 Se connecter'}
          </button>
        </form>

        <div className="glass-divider"/>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
          Pas encore de compte ?{' '}
          <Link to="/register"
            style={{ color: 'var(--primary-light)', fontWeight: 600, textDecoration: 'none' }}>
            Créer un compte →
          </Link>
        </p>
      </div>
    </div>
  )
}