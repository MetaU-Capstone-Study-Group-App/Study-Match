const express = require('express')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const router = express.Router()
const prisma = new PrismaClient();
const multer = require('multer');
const multerStorage = multer.memoryStorage();
const upload = multer({multerStorage})

router.put('/upload/:userId', upload.single('profile_picture'), async (req, res) => {
    const buffer = req.file.buffer;
    const userId = parseInt(req.params.userId);
    const updatedProfile = await prisma.user.update({
        where: { id: userId },
        data: {
            profile_picture: buffer
        },
    })
    res.json({message: "Uploaded profile picture successfully."});
})

router.get('/profilePicture/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const currentUser = await prisma.user.findUnique({
        where: { id: userId },
    })
    res.set('Content-Type', 'image/*');
    res.send(currentUser.profile_picture)
})

router.get('/', async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
})

router.get('/preferredTimes/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId)
    const currentUser = await prisma.user.findUnique({
        where: {id: parseInt(userId)},
    });
    res.json({preferred_start_time: currentUser.preferred_start_time, preferred_end_time: currentUser.preferred_end_time});
})

router.get('/address/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId)
    const currentUser = await prisma.user.findUnique({
        where: {id: parseInt(userId)},
    });
    res.json({latitude: currentUser.address_latitude, longitude: currentUser.address_longitude});
})

router.get('/schoolInfo/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId)
    const currentUser = await prisma.user.findUnique({
        where: {id: parseInt(userId)},
    });
    res.json({class_standing: currentUser.class_standing, school: currentUser.school});
})

router.get('/goals', async (req, res) => {
    const goals = await prisma.goalOption.findMany();
    res.json(goals);
})

router.post('/goals', async (req, res) => {
    const {user_id, goal_id} = req.body
    const newUserGoal = await prisma.userGoal.create({
        data: {
            user_id,
            goal_id
        }
    })
    res.json(newUserGoal);
})

router.get('/userGoals/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId)
    const currentUser = await prisma.userGoal.findMany({
        where: {user_id: parseInt(userId)},
    });
    res.json(currentUser);
})

router.get('/info/:name', async (req, res) => {
    const name = req.params.name
    const currentUser = await prisma.user.findFirst({
        where: {name: name},
    });
    res.json(currentUser);
})

module.exports = router