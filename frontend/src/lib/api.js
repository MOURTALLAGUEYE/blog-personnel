import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

// Ajouter le token automatiquement à chaque requête
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── AUTH ─────────────────────────────────────────────
export const register = (data) => API.post('/auth/register', data)
export const login    = (data) => API.post('/auth/login', data)

// ── ARTICLES ─────────────────────────────────────────
export const getDashboard   = ()       => API.get('/articles')
export const getArticle     = (id)     => API.get(`/articles/${id}`)
export const createArticle  = (data)   => API.post('/articles', data)
export const updateArticle  = (id, data) => API.put(`/articles/${id}`, data)
export const deleteArticle  = (id)     => API.delete(`/articles/${id}`)

// ── COMMENTAIRES ─────────────────────────────────────
export const addComment    = (articleId, data) => API.post(`/articles/${articleId}/comments`, data)
export const deleteComment = (id)              => API.delete(`/comments/${id}`)

// ── AMIS ─────────────────────────────────────────────
export const searchUsers    = (username) => API.get(`/users/search?username=${username}`)
export const getFriends     = ()         => API.get('/friends')
export const getRequests    = ()         => API.get('/friends/requests')
export const sendRequest    = (data)     => API.post('/friends/request', data)
export const confirmRequest = (id)       => API.put(`/friends/confirm/${id}`)
export const deleteFriend   = (id)       => API.delete(`/friends/${id}`)
export const blockUser      = (id)       => API.put(`/friends/block/${id}`)