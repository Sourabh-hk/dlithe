const express = require('express');
const { getUserById, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/:id', getUserById);
router.put('/profile', protect, updateProfile);

module.exports = router;
