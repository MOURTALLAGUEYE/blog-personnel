const express = require('express')
const router  = express.Router()
const authMiddleware = require('../middlewares/auth')

const authController    = require('../controllers/authController')
const articleController = require('../controllers/articleController')
const friendController  = require('../controllers/friendController')
const commentController = require('../controllers/commentController')

// ─── AUTH ────────────────────────────────────────────
router.post('/auth/register', authController.register)
router.post('/auth/login',    authController.login)

// ─── ARTICLES ────────────────────────────────────────
router.get   ('/articles',     authMiddleware, articleController.getAll)
router.get   ('/articles/:id', authMiddleware, articleController.getOne)
router.post  ('/articles',     authMiddleware, articleController.create)
router.put   ('/articles/:id', authMiddleware, articleController.update)
router.delete('/articles/:id', authMiddleware, articleController.remove)

// ─── COMMENTAIRES ────────────────────────────────────
router.post  ('/articles/:id/comments', authMiddleware, commentController.addComment)
router.delete('/comments/:id',          authMiddleware, commentController.deleteComment)

// ─── UTILISATEURS ────────────────────────────────────
router.get('/users/search', authMiddleware, friendController.searchUsers)

// ─── AMIS ────────────────────────────────────────────
router.get   ('/friends',              authMiddleware, friendController.getFriends)
router.get   ('/friends/requests',     authMiddleware, friendController.getRequests)
router.get   ('/friends/blocked',      authMiddleware, friendController.getBlocked)
router.post  ('/friends/request',      authMiddleware, friendController.sendRequest)
router.put   ('/friends/confirm/:id',  authMiddleware, friendController.confirmRequest)
router.delete('/friends/:id',          authMiddleware, friendController.deleteFriend)
router.put   ('/friends/block/:id',    authMiddleware, friendController.blockFriend)

module.exports = router