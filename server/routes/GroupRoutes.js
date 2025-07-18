const express = require('express')
const { PrismaClient } = require('@prisma/client')
const router = express.Router()
const prisma = new PrismaClient();

router.post('/existingGroup', async (req, res) => {
    const {id, class_id, day_of_week, start_time, end_time} = req.body
    const newExistingGroupData = await prisma.existingGroup.create({
        data: {
            id,
            class_id,
            day_of_week,
            start_time,
            end_time
        }
    })
    res.json(newExistingGroupData);
})

router.post('/userExistingGroup', async (req, res) => {
    const {id, user_id, existing_group_id} = req.body
    const newUserExistingGroupData = await prisma.userExistingGroup.create({
        data: {
            id,
            user_id,
            existing_group_id
        }
    })
    res.json(newUserExistingGroupData);
})

router.get('/userExistingGroup/recommend/:groupId', async (req, res) => {
    const groupId = parseInt(req.params.groupId)
    const isRecommended = await prisma.userExistingGroup.findUnique({
        where: {id: parseInt(groupId)},
    });
    res.json(isRecommended.recommended);
})

router.get('/userExistingGroup/:userId/:groupId', async (req, res) => {
    const userId = parseInt(req.params.userId)
    const groupId = parseInt(req.params.groupId)
    const userExistingGroup = await prisma.userExistingGroup.findFirst({
        where: {
            user_id: parseInt(userId),
            existing_group_id: parseInt(groupId),
        },
    });
    res.json(userExistingGroup);
})

router.get('/existingGroup', async (req, res) => {
    const existingGroups = await prisma.existingGroup.findMany();
    res.json(existingGroups);
})

router.get('/userExistingGroup', async (req, res) => {
    const userExistingGroups = await prisma.userExistingGroup.findMany();
    res.json(userExistingGroups);
})

router.put('/userExistingGroup/recommend/:groupId', async (req, res) => {
    const groupId = parseInt(req.params.groupId);
    const updatedGroupData = await prisma.userExistingGroup.update({
        where: {id: parseInt(groupId)},
        data: {
            recommended: true
        }
    })
    res.json(updatedGroupData);
})

router.put('/userExistingGroup/:groupId', async (req, res) => {
    const groupId = parseInt(req.params.groupId);
    const {status} = req.body;
    const updatedGroupData = await prisma.userExistingGroup.update({
        where: {id: parseInt(groupId)},
        data: {
            status
        }
    })
    res.json(updatedGroupData);
})

module.exports = router