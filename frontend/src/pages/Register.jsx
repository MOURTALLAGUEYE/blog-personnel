import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as api from '../lib/api'

export default function Register() {
  const [form, setForm]     = useState({ nom_complet: '', username: '', password: '' })
  const [erreur, setErreur] = useState('')
  const [succes, setSucces] = useState('')
  const navigate            = useNavigate()

  const handleChange = (e) => {
    setForm({ 
      ...form,
       [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErreur('')
    setSucces('')
    try {
      await api.register(form)
      setSucces('Inscription réussie ! Connectez-vous.')
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setErreur(err.response?.data?.message || 'Erreur inscription')
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Inscription</h2>

              {erreur && <div className="alert alert-danger">{erreur}</div>}
              {succes && <div className="alert alert-success">{succes}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nom complet</label>
                  <input
                    type="text"
                    name="nom_complet"
                    className="form-control"
                    value={form.nom_complet}
                    onChange={handleChange}
                    placeholder="Votre nom complet"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Nom d'utilisateur</label>
                  <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Choisissez un username"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Mot de passe</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Choisissez un mot de passe"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-success w-100">
                  S'inscrire
                </button>
              </form>

              <p className="text-center mt-3">
                Déjà un compte ?{' '}
                <Link to="/">Connect</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}