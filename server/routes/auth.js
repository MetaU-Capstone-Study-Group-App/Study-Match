const express = require('express')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const router = express.Router()
const prisma = new PrismaClient();

// Create an account
router.post('/signup', async (req, res) => {
    const {name, username, password, preferred_start_time, preferred_end_time, school, latitude, longitude, class_standing, email, phone_number, personality_weight, location_weight, goals_weight, school_weight, class_standing_weight} = req.body
    try {
        if (!username || !password || !name || !preferred_start_time || !preferred_end_time || !email || !phone_number) {
            return res.status(400).json({error: "All marked input fields are required."})
        }
        
        if (password.length < 8) {
            return res.status(400).json({error: "Password must be at least 8 characters long."})
        }

        const existingUser = await prisma.user.findUnique({
            where: { 
                username 
            },
        })

        if (existingUser) {
            return res.status(400).json({error: 'Username already exists.'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const weights = {
            personality_weight: parseFloat(personality_weight) || 0.2,
            school_weight: parseFloat(school_weight) || 0.1,
            class_standing_weight: parseFloat(class_standing_weight) || 0.1,
            goals_weight: parseFloat(goals_weight) || 0.2,
            location_weight: parseFloat(location_weight) || 0.4
        }

        const sumOfWeights = Object.values(weights).reduce((a,b) => a + b, 0);
        if (sumOfWeights !== 1.0){
            for (const i in weights){
                weights[i] = weights[i] / sumOfWeights;
            }
        }

        const newUser = await prisma.user.create({
            data: {
                name,
                username,
                password: hashedPassword,
                preferred_start_time,
                preferred_end_time,
                school,
                address_latitude: latitude,
                address_longitude: longitude,
                class_standing,
                email,
                phone_number,
                ...weights
            }
        })

        req.session.userId = newUser.id
        req.session.username = newUser.username
        req.session.name = newUser.name

        res.json({id: req.session.userId, username: newUser.username, name: newUser.name})
    } catch (error) {
        res.status(500).json({error: "Not able to create an account."})
    }
})

// Login to account
router.post('/login', async (req, res) => {
    const {username, password} = req.body
    try {
        if (!username || !password) {
            return res.status(400).json({error: "Username and password are required"})
        }

        const user = await prisma.user.findUnique({
            where: {username}
        })

        if (!user) {
            return res.status(401).json({error: "Invalid username or password"})
        }

        const isValidPassword = await bcrypt.compare(password, user.password)

        if (!isValidPassword) {
            return res.status(401).json({error: "Invalid username or password"})
        }

        req.session.userId = user.id
        req.session.username = user.username
        req.session.name = user.name

        res.json({id: req.session.userId, username: user.username, name: user.name})
    } catch (error) {
        res.status(500).json({error: "Not able to login."})
    }
})

// Verifies if user is logged in 
router.get('/me', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({message: "Not logged in"})
    }

    try {
        const user = await prisma.user.findUnique({
            where: {id: req.session.userId},
            select: {username: true, name: true}
        })

        res.json({id: req.session.userId, username: user.username, name: user.name})
    } catch (error) {
        res.status(500).json({error: "Error fetching user session data"})
    }
})

// Logout user
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({error: 'Failed to log out'});
        }
        res.clearCookie('connect.sid'); 
        res.json({message: 'Logged out successfully'});
    });
});

module.exports = router