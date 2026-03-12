import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import * as api from '../lib/api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [erreur, setErreur]     = useState('')
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    try {
      const res = await api.login({ username, password })
      login(res.data.user, res.data.token)
      navigate('/dashboard')
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur de connexion')
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Connexion</h2>

              {erreur && (
                <div className="alert alert-danger">{erreur}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nom d'utilisateur</label>
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Entrez votre username"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Connect
                </button>
              </form>

              <p className="text-center mt-3">
                Pas encore de compte ?{' '}
                <Link to="/register">S'inscrire</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}