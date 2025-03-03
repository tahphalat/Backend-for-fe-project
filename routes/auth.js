const express = require('express');
const
    { register, login, getMe, logout,updateUser } = require('../controllers/auth');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/logout',protect, logout);
<<<<<<< HEAD
router.put('/:id',protect, updateUser);
=======
>>>>>>> b01f283d206f35f219566387f209bf88d056148e

module.exports = router;