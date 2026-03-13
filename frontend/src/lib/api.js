import axios from 'axios'

// ─── INSTANCE AXIOS ──────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

// Intercepteur JWT automatique — injecté sur chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Intercepteur réponse — gestion centralisée des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Token expiré ou invalide → rediriger vers login
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const register = async (nom_complet, username, password) => {
  const res = await api.post('/auth/register', { nom_complet, username, password })
  return res.data
}

export const login = async (username, password) => {
  const res = await api.post('/auth/login', { username, password })
  return res.data // { token, user }
}

// ─── ARTICLES ────────────────────────────────────────────────────────────────
export const getArticles = async () => {
  const res = await api.get('/articles')
  return res.data
}

export const getArticle = async (id) => {
  const res = await api.get(`/articles/${id}`)
  return res.data
}

export const createArticle = async (articleData) => {
  const res = await api.post('/articles', articleData)
  return res.data
}

export const updateArticle = async (id, articleData) => {
  const res = await api.put(`/articles/${id}`, articleData)
  return res.data
}

export const deleteArticle = async (id) => {
  const res = await api.delete(`/articles/${id}`)
  return res.data
}

// ─── COMMENTAIRES ────────────────────────────────────────────────────────────
export const addComment = async (articleId, contenu) => {
  const res = await api.post(`/articles/${articleId}/comments`, { contenu })
  return res.data
}

export const deleteComment = async (commentId) => {
  const res = await api.delete(`/comments/${commentId}`)
  return res.data
}

// ─── UTILISATEURS / AMIS ─────────────────────────────────────────────────────
export const searchUsers = async (username) => {
  // encodeURIComponent : évite les bugs avec espaces, accents, caractères spéciaux
  const res = await api.get(`/users/search?username=${encodeURIComponent(username)}`)
  return res.data
}

export const getFriends = async () => {
  const res = await api.get('/friends')
  return res.data
}

export const getFriendRequests = async () => {
  const res = await api.get('/friends/requests')
  return res.data
}

export const sendFriendRequest = async (receveur_id) => {
  const res = await api.post('/friends/request', { receveur_id })
  return res.data
}

export const confirmFriendRequest = async (friendshipId) => {
  const res = await api.put(`/friends/confirm/${friendshipId}`)
  return res.data
}

export const deleteFriend = async (friendshipId) => {
  const res = await api.delete(`/friends/${friendshipId}`)
  return res.data
}

export const blockFriend = async (friendshipId) => {
  const res = await api.put(`/friends/block/${friendshipId}`)
  return res.data
}

export default api