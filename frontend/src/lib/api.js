import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ─── AUTH ─────────────────────────────────────────────
export const register = async (form) => {
  const res = await api.post('/auth/register', form)
  return res.data
}

export const login = async (form) => {
  const res = await api.post('/auth/login', form)
  return res.data
}

// ─── ARTICLES ─────────────────────────────────────────
export const getArticles = async () => {
  const res = await api.get('/articles')
  return res.data
}

export const getArticle = async (id) => {
  const res = await api.get(`/articles/${id}`)
  return res.data
}

export const createArticle = async (data) => {
  const res = await api.post('/articles', data)
  return res.data
}

export const updateArticle = async (id, data) => {
  const res = await api.put(`/articles/${id}`, data)
  return res.data
}

export const deleteArticle = async (id) => {
  const res = await api.delete(`/articles/${id}`)
  return res.data
}

// ─── COMMENTAIRES ─────────────────────────────────────
export const addComment = async (articleId, contenu) => {
  const res = await api.post(`/articles/${articleId}/comments`, { contenu })
  return res.data
}

export const deleteComment = async (commentId) => {
  const res = await api.delete(`/comments/${commentId}`)
  return res.data
}

// ─── UTILISATEURS ─────────────────────────────────────
export const searchUsers = async (username) => {
  const res = await api.get(`/users/search?username=${encodeURIComponent(username)}`)
  return res.data
}

// ─── AMIS ─────────────────────────────────────────────
export const getFriends = async () => {
  const res = await api.get('/friends')
  return res.data
}

export const getFriendRequests = async () => {
  const res = await api.get('/friends/requests')
  return res.data
}

export const getBlockedUsers = async () => {
  const res = await api.get('/friends/blocked')
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