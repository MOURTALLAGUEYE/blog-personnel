
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Serveur Mourtalla OK !' })
})

app.listen(process.env.PORT || 5000, () => {
  console.log('Serveur démarré sur http://localhost:5000')
})