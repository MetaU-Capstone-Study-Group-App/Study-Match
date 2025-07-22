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
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client')

const origins = [
    'http://localhost:5173',
    'https://study-match-mm3y.onrender.com'
];

app.use(cors({
    origin: origins, 
    credentials: true
}))

app.use(express.json())

app.use(
    session({
        cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000
        },
        secret: 'study-match',
        resave: true,
        saveUninitialized: true,
        store: new PrismaSessionStore(
        new PrismaClient(),
        {
            checkPeriod: 2 * 60 * 1000, 
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }
        )
    })
);

app.use('/auth', authRoutes)
app.use('/user', userRoutes)
app.use('/quiz', quizRoutes)
app.use('/availability', availabilityRoutes)
app.use('/group', groupRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})