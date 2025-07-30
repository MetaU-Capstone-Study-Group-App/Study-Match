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

router.get('/weights/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId)
    const currentUser = await prisma.user.findUnique({
        where: {id: parseInt(userId)},
    });
    res.json({
        personality_weight: currentUser.personality_weight, 
        location_weight: currentUser.location_weight, 
        goals_weight: currentUser.goals_weight, 
        school_weight: currentUser.school_weight, 
        class_standing_weight: currentUser.class_standing_weight
    });
})

router.post('/favorite', async (req, res) => {
    const {logged_in_user, favorite_user} = req.body
    const newUserFavorite = await prisma.userFavorite.create({
        data: {
            logged_in_user,
            favorite_user
        }
    })
    res.json(newUserFavorite);
})

router.get('/favorite/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId)
    const favoriteUsers = await prisma.userFavorite.findMany({
        where: {logged_in_user: parseInt(userId)},
    });
    res.json(favoriteUsers);
})

router.delete('/favorite/:favoriteId', async (req, res) => {
    const {favoriteId} = req.params
    const deletedUserFavorite = await prisma.userFavorite.delete({
        where: { 
            id: parseInt(favoriteId)
        }
    })
    res.json(deletedUserFavorite)
})

router.put('/editProfile/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);
    const {username, email, phone_number, school, class_standing, preferred_start_time, preferred_end_time} = req.body;
    const profileInfoToChange = [];

    const profileInfo = [{
        username: username,
        email: email,
        phone_number: phone_number,
        school: school,
        class_standing: class_standing,
        preferred_start_time: preferred_start_time,
        preferred_end_time: preferred_end_time
    }]

    for (const parameter of profileInfo){
        if (parameter){
            profileInfoToChange.push(parameter);
        }
    }

    const updatedProfile = await prisma.user.update({
        where: {id: userId},
        data: {
            ...profileInfoToChange[0]
        },
    })
    res.json(updatedProfile);
})

module.exports = router