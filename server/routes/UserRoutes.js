const express = require('express')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const router = express.Router()
const prisma = new PrismaClient();
const multer = require('multer');
const upload = multer({dest: 'client/src/images/'})

router.put('/upload/:userId', upload.single('profile_picture'), async (req, res) => {
    const buffer = Buffer.from(req.file.buffer);
    const pictureBytesArray = Uint8Array.from(buffer);
    console.log(pictureBytesArray)
    const userId = parseInt(req.params.userId);
    const updatedProfile = await prisma.user.update({
        where: { id: userId },
        data: {
            profile_picture: pictureBytesArray
        },
    })
    res.json({message: "successful"});
})

module.exports = router