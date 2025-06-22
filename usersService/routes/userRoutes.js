const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', userController.createUser);
router.put('/', userController.updateUser);
router.post('/users', authenticate, userController.getUsers);
router.post('/user', authenticate, userController.getUser);
router.delete('/', userController.deleteUser);
router.post('/login', userController.login);
router.post(
  '/import-contacts',
  authenticate,
  upload.single('file'),
  userController.importContacts,
);

module.exports = router;
