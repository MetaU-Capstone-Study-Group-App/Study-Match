const express = require('express')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const router = express.Router()
const prisma = new PrismaClient();

router.post('/busyTime', async (req, res) => {
    const {id, user_id, day_of_week, start_time, end_time, class_name} = req.body
    const newBusyTimeData = await prisma.busyTime.create({
        data: {
            id,
            user_id,
            day_of_week,
            start_time,
            end_time,
            class_name,
        }
    })
    res.json(newBusyTimeData);
})

router.put('/busyTime/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const {user_id, day_of_week, start_time, end_time, class_name} = req.body
    const newBusyTimeData = await prisma.busyTime.update({
        where: {id: parseInt(id)},
        data: {
            id,
            user_id,
            day_of_week,
            start_time,
            end_time,
            class_name,
        }
    })
    res.json(newBusyTimeData);
})

router.get('/busyTime/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId)
    const busyTimes = await prisma.busyTime.findMany({
        where: {user_id: parseInt(userId)},
    });
    res.json(busyTimes);
})

router.get('/classes', async (req, res) => {
    const classes = await prisma.class.findMany();
    res.json(classes);
})

router.post('/classes', async (req, res) => {
    const {name} = req.body
    const newClass = await prisma.class.create({
        data: {
            name,
        }
    })
    res.json(newClass);
})

router.post('/userClasses', async (req, res) => {
    const {user_id, class_id} = req.body
    const newUserClass = await prisma.userClass.create({
        data: {
            user_id,
            class_id
        }
    })
    res.json(newUserClass);
})

router.get('/userClasses', async (req, res) => {
    const userClasses = await prisma.userClass.findMany();
    res.json(userClasses);
})

module.exports = router