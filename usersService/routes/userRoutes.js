const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');

router.post('/', userController.createUser);
router.put('/', userController.updateUser);
router.post('/users', authenticate, userController.getUsers);
router.post('/user', authenticate, userController.getUser);
router.delete('/', userController.deleteUser);
router.post('/login', userController.login);

module.exports = router;
