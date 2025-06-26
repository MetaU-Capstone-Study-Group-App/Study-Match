const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 3000
const authRoutes = require('./routes/auth.js')
const userRoutes = require('./routes/UserRoutes.js')
const session = require('express-session')

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}))

app.use(express.json())

app.use(session({
    secret: 'study-match', 
    resave: false,
    saveUninitialized: false,
    cookie: {secure: false, httpOnly: true, maxAge: 1000 * 60 * 60} 
}))

app.use('/auth', authRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})