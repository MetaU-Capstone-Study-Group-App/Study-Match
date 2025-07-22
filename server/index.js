const express = require('express')
const app = express()
const cors = require('cors')
const PORT = 3000
const authRoutes = require('./routes/auth.js')
const userRoutes = require('./routes/UserRoutes.js')
const quizRoutes = require('./routes/QuizRoutes.js')
const availabilityRoutes = require('./routes/AvailabilityRoutes.js')
const groupRoutes = require('./routes/GroupRoutes.js')
const session = require('express-session')

const origins = [
    'http://localhost:5173',
    'https://study-match-mm3y.onrender.com'
];

app.use(cors({
    origin: origins, 
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
app.use('/user', userRoutes)
app.use('/quiz', quizRoutes)
app.use('/availability', availabilityRoutes)
app.use('/group', groupRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})