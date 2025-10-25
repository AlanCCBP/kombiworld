const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middlewares/authMiddleware');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', userController.createUser);
router.put('/:userId', authenticate, userController.updateUser);
router.delete('/:userId', authenticate, userController.deleteUser);
router.get('/:userId', authenticate, userController.getUser);
router.get('/', authenticate, userController.getUsers);
router.post('/login', userController.login);

router.post(
  '/import-contacts',
  authenticate,
  upload.single('file'),
  userController.importContacts,
);

module.exports = router;
