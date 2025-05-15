const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');

const { registerUser } = require('../controllers/registerUserController');
const { loginUser } = require('../controllers/loginController');
const { getAllUsers } = require('../controllers/getAllUsersController');
const { deleteUser } = require('../controllers/deleteUserController');
const { getCurrentUser } = require('../controllers/getCurrentUserController');
const { updateUserName } = require('../controllers/updateUserNameController');
const { updateUserPassword } = require('../controllers/updateUserPasswordController');
const { updateUserStatus } = require('../controllers/updateUserStatusController');
const { getUserById } = require('../controllers/getUserByIdController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/admin/users', authenticate, getAllUsers);
router.delete('/admin/users/:id', authenticate, deleteUser);
router.get('/me', authenticate, getCurrentUser);
router.put('/update-name', authenticate, updateUserName);
router.put('/update-password', authenticate, updateUserPassword);
router.put('/admin/users/:id/status', authenticate, updateUserStatus);
router.get('/:id', authenticate, getUserById);


router.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'You accessed a protected route!', user: req.user });
});

module.exports = router;