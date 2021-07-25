const express = require('express');
const checkAuth = require('../Middleware/checkAuth.middleware');
const cmsControllers = require('../Controllers/cms.controllers');
const router = express.Router();

router.get('/', cmsControllers.dashboardPage);
router.get('/login', cmsControllers.loginPage);

module.exports = router