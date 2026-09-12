const express = require('express');
const router = express.Router();
const { getResources, getResource, getAvailability } = require('../controllers/resourceController');

router.get('/', getResources);
router.get('/:id', getResource);
router.get('/:id/availability', getAvailability);

module.exports = router;
