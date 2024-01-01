const express = require('express');
const userController = require('../controllers/UserController');
const auth = require('../middleware/auth/UserAuth');
const reportController = require('../controllers/ReportController');

const router = express.Router();

router.get('/verifyuser', auth, userController.getUserType);
router.post('/login', userController.login);
router.post('/signup', userController.signup);

router.get('/messages/:id', userController.getMessages);
router.post('/messages', userController.sendMessage);

router.get('/report/:id', reportController.getReport);
router.get('/report/appointment/:id', reportController.getSpecificReport);

module.exports = router;