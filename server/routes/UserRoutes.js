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

module.exports = router