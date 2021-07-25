const express = require('express');
const checkAuth = require('../Middleware/checkAuth.middleware');
const homeControllers = require('../Controllers/home.controllers');
const router = express.Router();

router.get('/', homeControllers.homePage);
router.get('/questions', homeControllers.questionsPage);
router.get('/question/:questionId', homeControllers.editorPage);
router.post('/question/:questionId/unit-test', homeControllers.unitTest);

module.exports = router