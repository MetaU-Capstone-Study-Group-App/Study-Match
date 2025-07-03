const express = require('express')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const router = express.Router()
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    const { id } = req.body
    const newBusyTimeData = await prisma.busyTimes.create({
        data: {
            id,
        }
    })
    res.json(newBusyTimeData);
})

router.post('/busyTime', async (req, res) => {
    const { id, user_id, day_of_week, start_time, end_time } = req.body
    const newBusyTimeData = await prisma.busyTime.create({
        data: {
            id,
            user_id,
            day_of_week,
            start_time,
            end_time,
        }
    })
    res.json(newBusyTimeData);
})

module.exports = router