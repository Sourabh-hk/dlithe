const express = require('express');
const { body } = require('express-validator');
const {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
} = require('../controllers/skillController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

router.get('/', getSkills);
router.get('/:id', getSkillById);

router.post(
  '/',
  protect,
  [
    body('name').trim().notEmpty().withMessage('Skill name is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('experienceLevel')
      .notEmpty()
      .withMessage('Experience level is required'),
    body('hourlyRate')
      .isNumeric()
      .withMessage('Hourly rate must be a number'),
  ],
  validate,
  createSkill
);

router.put('/:id', protect, updateSkill);
router.delete('/:id', protect, deleteSkill);

module.exports = router;
