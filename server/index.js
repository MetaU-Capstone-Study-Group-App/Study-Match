const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require("./generated/prisma");
const cors = require('cors');
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");

app.set("trust proxy", 1);

app.use(express.json());

app.use(cors({
    origin: ["https://study-match-mm3y.onrender.com", "http://localhost:5173"], 
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
}));

app.use(
    helmet({
        crossOriginResourcePolicy: {policy: "cross-origin"},
    }),
);

app.use("/images", express.static(path.join(__dirname, "images")));

const prisma = new PrismaClient();

const isProduction = process.env.NODE_ENVIRONMENT === "production";

app.use(
    session({
        cookie: {
            secure: isProduction,
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 60, // 1 hour
            sameSite: isProduction ? "none" : "lax",
        },
        secret: 'study-match',
        resave: false,
        saveUninitialized: false,
        store: new PrismaSessionStore(
            prisma,
        {
            checkPeriod: 2 * 60 * 1000,  
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        })
    })
);

const authRoutes = require('./routes/auth.js');
app.use('/auth', authRoutes)

const userRoutes = require('./routes/UserRoutes.js');
app.use('/user', userRoutes)

const quizRoutes = require('./routes/QuizRoutes.js');
app.use('/quiz', quizRoutes)

const availabilityRoutes = require('./routes/AvailabilityRoutes.js');
app.use('/availability', availabilityRoutes)

const groupRoutes = require('./routes/GroupRoutes.js');
app.use('/group', groupRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})