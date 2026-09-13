const User = require('../models/User');
const Skill = require('../models/Skill');
const Booking = require('../models/Booking');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    // Get user's skills
    const skills = await Skill.find({ mentor: user._id, isActive: true });

    // Get session stats
    const completedSessions = await Booking.countDocuments({
      $or: [
        { mentor: user._id, status: 'completed' },
        { learner: user._id, status: 'completed' },
      ],
    });

    const teachingSessions = await Booking.countDocuments({
      mentor: user._id,
      status: 'completed',
    });

    res.json({
      ...user.toJSON(),
      skills,
      completedSessions,
      teachingSessions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, location, learningInterests, skillsWanted, skillsOffered, avatar, title, role, website } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (avatar !== undefined) user.avatar = avatar;
    if (title !== undefined) user.title = title;
    if (website !== undefined) user.website = website;
    if (role && ['learner', 'mentor'].includes(role)) user.role = role;
    if (learningInterests || skillsWanted) user.learningInterests = learningInterests || skillsWanted;
    if (skillsOffered) user.skillsOffered = skillsOffered;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserById, updateProfile };
