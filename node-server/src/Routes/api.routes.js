const express = require('express');
const checkAuth = require('../Middleware/checkAuth.middleware');
const apiControllers = require('../Controllers/api.controllers');
const router = express.Router();

router.get('/questions', checkAuth, apiControllers.getQuestions);
router.get('/question/:questionId', checkAuth, apiControllers.getQuestion);
router.post('/question/add', checkAuth, apiControllers.addQuestion);
router.put('/question/:questionId/update', checkAuth, apiControllers.updateQuestion);
router.delete('/question/:questionId/delete', checkAuth, apiControllers.deleteQuestion);
router.patch('/question/:questionId/visibility', checkAuth, apiControllers.publishQuestion);

module.exports = router