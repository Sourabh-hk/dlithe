const Skill = require('../models/Skill');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res, next) => {
  try {
    const { search, category, experienceLevel, availability } = req.query;

    let query = {};

    if (search) {
      query.$or = [
        { skillName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) query.category = category;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (availability) query.availability = availability;

    const skills = await Skill.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Skills fetched successfully',
      data: skills,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single skill
// @route   GET /api/skills/:id
// @access  Public
const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }

    res.status(200).json({
      success: true,
      message: 'Skill fetched successfully',
      data: skill,
    });
  } catch (error) {
    // If it's not a valid ObjectId, mongoose will throw a CastError
    if (error.name === 'CastError') {
      res.status(404);
      error.message = 'Skill not found';
    }
    next(error);
  }
};

// @desc    Create a skill
// @route   POST /api/skills
// @access  Public
const createSkill = async (req, res, next) => {
  try {
    const { skillName, category, description, experienceLevel, availability } = req.body;

    if (!skillName || !category || !description || !experienceLevel || !availability) {
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    const skill = await Skill.create({
      skillName,
      category,
      description,
      experienceLevel,
      availability,
    });

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Public
const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: updatedSkill,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404);
      error.message = 'Skill not found';
    }
    next(error);
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Public
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }

    await skill.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
      data: {},
    });
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404);
      error.message = 'Skill not found';
    }
    next(error);
  }
};

module.exports = {
  getSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};
