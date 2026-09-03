require('dotenv').config();
const mongoose = require('mongoose');
const Skill = require('./models/Skill');
const connectDB = require('./config/db');

connectDB();

const sampleSkills = [
  {
    skillName: 'React.js Development',
    category: 'Web Development',
    description: 'I can teach you the fundamentals and advanced concepts of React.js, including hooks, context API, and routing. Let\'s build some cool projects together.',
    experienceLevel: 'Advanced',
    availability: 'Weekends'
  },
  {
    skillName: 'Adobe Photoshop',
    category: 'Graphic Design',
    description: 'Learn how to edit photos, create composite images, and design stunning graphics using Adobe Photoshop. Perfect for beginners and intermediate learners.',
    experienceLevel: 'Intermediate',
    availability: 'Evening'
  },
  {
    skillName: 'Python Programming',
    category: 'Data Science',
    description: 'From basic syntax to object-oriented programming, I will guide you through Python. We can also touch on libraries like Pandas and NumPy if you are interested in data science.',
    experienceLevel: 'Expert',
    availability: 'Flexible'
  },
  {
    skillName: 'Spanish Language',
    category: 'Languages',
    description: 'Hola! I am a native Spanish speaker and I can help you improve your conversational skills, grammar, and vocabulary in a fun and interactive way.',
    experienceLevel: 'Advanced',
    availability: 'Weekdays'
  },
  {
    skillName: 'Digital Photography',
    category: 'Photography',
    description: 'Master your DSLR or mirrorless camera. I will teach you about exposure, composition, lighting, and post-processing techniques to capture amazing photos.',
    experienceLevel: 'Intermediate',
    availability: 'Weekends'
  }
];

const importData = async () => {
  try {
    await Skill.deleteMany(); // Clear existing data
    await Skill.insertMany(sampleSkills);
    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
