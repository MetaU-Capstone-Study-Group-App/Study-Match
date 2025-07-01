const express = require('express')
const bcrypt = require('bcrypt')
const { PrismaClient } = require('@prisma/client')
const router = express.Router()
const prisma = new PrismaClient();

router.post('/', async (req, res) => {
    const { id } = req.body
    const newQuizData = await prisma.quiz.create({
        data: {
            id,
        }
    })
    res.json(newQuizData);
})

router.post('/responses', async (req, res) => {
    if (!req.body.response) {
        return res.status(400).send('Response is required.')
    }
    const { id, user_id, question_id, question, question_trait, response } = req.body
    const newResponseData = await prisma.quizResponse.create({
        data: {
        id,
        user_id,
        question_id,
        question,
        question_trait,
        response
        }
    })
    res.json(newResponseData);
})

module.exports = router