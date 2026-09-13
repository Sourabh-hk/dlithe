const Skill = require('../models/Skill');

// @desc    Get all skills with search, filter, sort, pagination
// @route   GET /api/skills
const getSkills = async (req, res, next) => {
  try {
    const {
      search,
      category,
      experienceLevel,
      minRate,
      maxRate,
      sort,
      mentor,
      page = 1,
      limit = 12,
    } = req.query;

    const query = {};
    if (mentor) {
      query.mentor = mentor;
    } else {
      query.isActive = true;
    }

    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by experience level
    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    // Filter by price range
    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) query.hourlyRate.$gte = Number(minRate);
      if (maxRate) query.hourlyRate.$lte = Number(maxRate);
    }

    // Sort options
    let sortOption = { createdAt: -1 };
    switch (sort) {
      case 'rating':
        sortOption = { averageRating: -1 };
        break;
      case 'price_low':
        sortOption = { hourlyRate: 1 };
        break;
      case 'price_high':
        sortOption = { hourlyRate: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { averageRating: -1, createdAt: -1 };
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Skill.countDocuments(query);
    const skills = await Skill.find(query)
      .populate('mentor', 'name avatar averageRating location')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      skills,
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single skill by ID
// @route   GET /api/skills/:id
const getSkillById = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id).populate(
      'mentor',
      'name avatar bio location averageRating totalReviews createdAt'
    );

    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }

    res.json(skill);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a skill
// @route   POST /api/skills
const createSkill = async (req, res, next) => {
  try {
    const { name, description, category, experienceLevel, hourlyRate, availability } =
      req.body;

    const skill = await Skill.create({
      mentor: req.user._id,
      name,
      description,
      category,
      experienceLevel,
      hourlyRate,
      availability,
    });

    const populated = await skill.populate(
      'mentor',
      'name avatar averageRating location'
    );

    // Update user's skillsOffered & ensure role is mentor
    if (!req.user.skillsOffered.includes(name)) {
      req.user.skillsOffered.push(name);
    }
    if (req.user.role !== 'mentor') {
      req.user.role = 'mentor';
    }
    await req.user.save();

    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
const updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }

    // Authorization check
    if (skill.mentor.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this skill');
    }

    const { name, description, category, experienceLevel, hourlyRate, availability, isActive } =
      req.body;

    if (name) skill.name = name;
    if (description) skill.description = description;
    if (category) skill.category = category;
    if (experienceLevel) skill.experienceLevel = experienceLevel;
    if (hourlyRate !== undefined) skill.hourlyRate = hourlyRate;
    if (availability) skill.availability = availability;
    if (isActive !== undefined) skill.isActive = isActive;

    const updatedSkill = await skill.save();
    await updatedSkill.populate('mentor', 'name avatar averageRating location');

    res.json(updatedSkill);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
const deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      res.status(404);
      throw new Error('Skill not found');
    }

    // Authorization check
    if (skill.mentor.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to delete this skill');
    }

    await Skill.findByIdAndDelete(req.params.id);

    res.json({ message: 'Skill removed' });
  } catch (error) {
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
