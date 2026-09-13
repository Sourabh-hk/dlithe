require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const User = require('./models/User');
const Skill = require('./models/Skill');
const Booking = require('./models/Booking');
const Review = require('./models/Review');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Review.deleteMany({});
    await Booking.deleteMany({});
    await Skill.deleteMany({});
    await User.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        name: 'Ananya Sharma',
        email: 'ananya@example.com',
        password: 'password123',
        bio: 'Frontend developer with 4 years of experience building React applications. I enjoy breaking down complex concepts into simple, practical lessons.',
        location: 'Bengaluru, India',
        learningInterests: ['Python', 'Machine Learning'],
        skillsOffered: ['React Development', 'JavaScript'],
        avatar: '',
      },
      {
        name: 'Ravi Patel',
        email: 'ravi@example.com',
        password: 'password123',
        bio: 'Full-stack developer who has worked with startups and enterprise teams. I focus on teaching Node.js and system design through real-world projects.',
        location: 'Mumbai, India',
        learningInterests: ['React', 'DevOps'],
        skillsOffered: ['Node.js', 'MongoDB'],
        avatar: '',
      },
      {
        name: 'Priya Menon',
        email: 'priya@example.com',
        password: 'password123',
        bio: 'UI/UX designer at a product company. I teach design thinking, Figma workflows, and how to build design systems that actually scale.',
        location: 'Chennai, India',
        learningInterests: ['Frontend Development', 'Animation'],
        skillsOffered: ['UI/UX Design', 'Figma'],
        avatar: '',
      },
      {
        name: 'Arjun Reddy',
        email: 'arjun@example.com',
        password: 'password123',
        bio: 'Data scientist working in healthcare analytics. I teach Python, pandas, and introductory machine learning with a focus on practical applications.',
        location: 'Hyderabad, India',
        learningInterests: ['Cloud Computing', 'Web Development'],
        skillsOffered: ['Python', 'Data Science'],
        avatar: '',
      },
      {
        name: 'Meera Krishnan',
        email: 'meera@example.com',
        password: 'password123',
        bio: 'Freelance photographer and visual storyteller. I teach camera fundamentals, composition, and post-processing for people who want to take better photos.',
        location: 'Kochi, India',
        learningInterests: ['Video Editing', 'Marketing'],
        skillsOffered: ['Photography', 'Lightroom'],
        avatar: '',
      },
      {
        name: 'Karthik Nair',
        email: 'karthik@example.com',
        password: 'password123',
        bio: 'Guitar teacher with 8 years of playing experience. I cover acoustic and electric guitar for beginners through intermediate players, focusing on songs you actually want to play.',
        location: 'Pune, India',
        learningInterests: ['Music Production', 'Piano'],
        skillsOffered: ['Guitar', 'Music Theory'],
        avatar: '',
      },
      {
        name: 'Sneha Gupta',
        email: 'sneha@example.com',
        password: 'password123',
        bio: 'Digital marketing specialist running campaigns for D2C brands. I teach SEO, content strategy, and social media marketing with real case studies.',
        location: 'Delhi, India',
        learningInterests: ['Data Analytics', 'Copywriting'],
        skillsOffered: ['Digital Marketing', 'SEO'],
        avatar: '',
      },
      {
        name: 'Vikram Singh',
        email: 'vikram@example.com',
        password: 'password123',
        bio: 'Management consultant turned career coach. I help people with interview prep, resume building, and figuring out their next career move.',
        location: 'Gurgaon, India',
        learningInterests: ['Public Speaking', 'Writing'],
        skillsOffered: ['Career Coaching', 'Interview Prep'],
        avatar: '',
      },
      {
        name: 'Deepa Iyer',
        email: 'deepa@example.com',
        password: 'password123',
        bio: 'Excel power user and financial analyst. I teach everything from pivot tables to VBA macros, with a focus on making your actual work faster.',
        location: 'Bengaluru, India',
        learningInterests: ['SQL', 'Tableau'],
        skillsOffered: ['Excel', 'Financial Modeling'],
        avatar: '',
      },
      {
        name: 'Rahul Joshi',
        email: 'rahul@example.com',
        password: 'password123',
        bio: 'Software engineer and competitive programmer. I teach data structures, algorithms, and how to approach coding interviews methodically.',
        location: 'Noida, India',
        learningInterests: ['System Design', 'Go'],
        skillsOffered: ['DSA', 'JavaScript'],
        avatar: '',
      },
    ]);

    console.log(`Created ${users.length} users`);

    // Create skills
    const skills = await Skill.create([
      {
        mentor: users[0]._id,
        name: 'React Development',
        description: 'Learn React from the ground up — components, hooks, state management, routing, and how to structure a real project. We will build something together, not just watch slides.',
        category: 'Web Development',
        experienceLevel: 'Intermediate',
        hourlyRate: 800,
        availability: 'Weekday evenings, Saturday mornings',
      },
      {
        mentor: users[0]._id,
        name: 'JavaScript Fundamentals',
        description: 'Covers closures, prototypes, async/await, ES6+ features, and the DOM. Good for anyone who copies code from Stack Overflow but wants to actually understand what it does.',
        category: 'Programming',
        experienceLevel: 'Beginner',
        hourlyRate: 600,
        availability: 'Weekdays after 6 PM',
      },
      {
        mentor: users[1]._id,
        name: 'Node.js Backend Development',
        description: 'Build REST APIs with Express, connect to MongoDB, handle authentication, and deploy. I teach the patterns I use at work every day.',
        category: 'Web Development',
        experienceLevel: 'Intermediate',
        hourlyRate: 900,
        availability: 'Weekends, Tue/Thu evenings',
      },
      {
        mentor: users[2]._id,
        name: 'UI/UX Design with Figma',
        description: 'Learn how to design interfaces that people actually enjoy using. Covers research, wireframing, prototyping, and building a design system in Figma.',
        category: 'Design',
        experienceLevel: 'Beginner',
        hourlyRate: 700,
        availability: 'Mon/Wed/Fri mornings',
      },
      {
        mentor: users[3]._id,
        name: 'Python for Data Science',
        description: 'Start with Python basics, then move into pandas, numpy, and matplotlib. By the end, you will be able to clean, analyze, and visualize real datasets.',
        category: 'Data Science',
        experienceLevel: 'Beginner',
        hourlyRate: 750,
        availability: 'Weekday evenings',
      },
      {
        mentor: users[3]._id,
        name: 'Machine Learning Basics',
        description: 'An introduction to ML concepts — regression, classification, clustering — using scikit-learn. No PhD required, just curiosity and some Python experience.',
        category: 'Data Science',
        experienceLevel: 'Advanced',
        hourlyRate: 1200,
        availability: 'Saturday afternoons',
      },
      {
        mentor: users[4]._id,
        name: 'Photography Fundamentals',
        description: 'Understand exposure, composition, and lighting. Bring your camera or phone — we will shoot and review together. Great for beginners who want to stop using auto mode.',
        category: 'Photography',
        experienceLevel: 'Beginner',
        hourlyRate: 500,
        availability: 'Weekends',
      },
      {
        mentor: users[5]._id,
        name: 'Acoustic Guitar for Beginners',
        description: 'Learn chords, strumming patterns, and your first few songs. I will pick songs you like and build lessons around them so practice actually feels fun.',
        category: 'Music',
        experienceLevel: 'Beginner',
        hourlyRate: 600,
        availability: 'Evenings and weekends',
      },
      {
        mentor: users[6]._id,
        name: 'SEO and Content Strategy',
        description: 'Learn how search engines work, how to do keyword research, and how to create content that ranks. I will walk through real campaigns I have managed.',
        category: 'Marketing',
        experienceLevel: 'Intermediate',
        hourlyRate: 850,
        availability: 'Tue/Thu/Sat',
      },
      {
        mentor: users[6]._id,
        name: 'Social Media Marketing',
        description: 'Platform-specific strategies for Instagram, LinkedIn, and Twitter. Covers content planning, engagement tactics, and analytics. Aimed at small businesses and freelancers.',
        category: 'Marketing',
        experienceLevel: 'Beginner',
        hourlyRate: 650,
        availability: 'Weekday mornings',
      },
      {
        mentor: users[7]._id,
        name: 'Interview Preparation',
        description: 'Structured mock interviews, resume review, and practical advice for tech and non-tech roles. I have sat on both sides of the table and know what hiring managers look for.',
        category: 'Career',
        experienceLevel: 'Intermediate',
        hourlyRate: 1000,
        availability: 'Flexible',
      },
      {
        mentor: users[7]._id,
        name: 'Public Speaking',
        description: 'Get comfortable speaking in meetings, presentations, and on stage. Covers structure, delivery, handling nerves, and thinking on your feet.',
        category: 'Career',
        experienceLevel: 'Beginner',
        hourlyRate: 900,
        availability: 'Weekends',
      },
      {
        mentor: users[8]._id,
        name: 'Excel for Professionals',
        description: 'Go beyond basic formulas. Learn pivot tables, VLOOKUP/XLOOKUP, conditional formatting, dashboards, and intro to VBA. Focused on saving you hours of manual work.',
        category: 'Business',
        experienceLevel: 'Intermediate',
        hourlyRate: 700,
        availability: 'Mon-Fri evenings',
      },
      {
        mentor: users[9]._id,
        name: 'Data Structures and Algorithms',
        description: 'Systematic approach to DSA — arrays, trees, graphs, dynamic programming. Each topic includes problems graded by difficulty. Good preparation for coding interviews.',
        category: 'Programming',
        experienceLevel: 'Advanced',
        hourlyRate: 1100,
        availability: 'Weekday evenings, Sunday mornings',
      },
      {
        mentor: users[1]._id,
        name: 'MongoDB and Database Design',
        description: 'Learn MongoDB from schema design to aggregation pipelines. I cover both the fundamentals and the patterns that matter when your data grows.',
        category: 'Web Development',
        experienceLevel: 'Intermediate',
        hourlyRate: 800,
        availability: 'Weekends',
      },
    ]);

    console.log(`Created ${skills.length} skills`);

    // Create some bookings with various statuses
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const bookings = await Booking.create([
      {
        learner: users[1]._id,
        mentor: users[0]._id,
        skill: skills[0]._id,
        date: lastWeek,
        startTime: '10:00',
        endTime: '11:00',
        duration: 1,
        hourlyRate: 800,
        totalAmount: 800,
        status: 'completed',
      },
      {
        learner: users[2]._id,
        mentor: users[0]._id,
        skill: skills[0]._id,
        date: twoWeeksAgo,
        startTime: '14:00',
        endTime: '15:00',
        duration: 1,
        hourlyRate: 800,
        totalAmount: 800,
        status: 'completed',
      },
      {
        learner: users[3]._id,
        mentor: users[1]._id,
        skill: skills[2]._id,
        date: lastWeek,
        startTime: '11:00',
        endTime: '12:00',
        duration: 1,
        hourlyRate: 900,
        totalAmount: 900,
        status: 'completed',
      },
      {
        learner: users[0]._id,
        mentor: users[2]._id,
        skill: skills[3]._id,
        date: twoWeeksAgo,
        startTime: '09:00',
        endTime: '10:00',
        duration: 1,
        hourlyRate: 700,
        totalAmount: 700,
        status: 'completed',
      },
      {
        learner: users[4]._id,
        mentor: users[3]._id,
        skill: skills[4]._id,
        date: lastWeek,
        startTime: '18:00',
        endTime: '19:00',
        duration: 1,
        hourlyRate: 750,
        totalAmount: 750,
        status: 'completed',
      },
      {
        learner: users[5]._id,
        mentor: users[0]._id,
        skill: skills[1]._id,
        date: nextWeek,
        startTime: '18:00',
        endTime: '19:00',
        duration: 1,
        hourlyRate: 600,
        totalAmount: 600,
        status: 'accepted',
      },
      {
        learner: users[6]._id,
        mentor: users[1]._id,
        skill: skills[2]._id,
        date: tomorrow,
        startTime: '15:00',
        endTime: '16:00',
        duration: 1,
        hourlyRate: 900,
        totalAmount: 900,
        status: 'pending',
      },
      {
        learner: users[7]._id,
        mentor: users[4]._id,
        skill: skills[6]._id,
        date: nextWeek,
        startTime: '10:00',
        endTime: '11:00',
        duration: 1,
        hourlyRate: 500,
        totalAmount: 500,
        status: 'accepted',
      },
      {
        learner: users[8]._id,
        mentor: users[5]._id,
        skill: skills[7]._id,
        date: tomorrow,
        startTime: '19:00',
        endTime: '20:00',
        duration: 1,
        hourlyRate: 600,
        totalAmount: 600,
        status: 'pending',
      },
      {
        learner: users[9]._id,
        mentor: users[6]._id,
        skill: skills[8]._id,
        date: lastWeek,
        startTime: '11:00',
        endTime: '12:00',
        duration: 1,
        hourlyRate: 850,
        totalAmount: 850,
        status: 'rejected',
      },
    ]);

    console.log(`Created ${bookings.length} bookings`);

    // Create reviews for completed bookings
    const reviews = [];

    const review1 = await Review.create({
      booking: bookings[0]._id,
      mentor: users[0]._id,
      learner: users[1]._id,
      rating: 5,
      comment: 'Ananya explained React hooks really well. She used practical examples instead of abstract theory, which made everything click. Would book again.',
    });
    reviews.push(review1);

    const review2 = await Review.create({
      booking: bookings[1]._id,
      mentor: users[0]._id,
      learner: users[2]._id,
      rating: 4,
      comment: 'Good session on component architecture. She helped me refactor a messy component tree into something much cleaner. Only wish we had more time.',
    });
    reviews.push(review2);

    const review3 = await Review.create({
      booking: bookings[2]._id,
      mentor: users[1]._id,
      learner: users[3]._id,
      rating: 5,
      comment: 'Ravi walked me through building a REST API step by step. His explanations of middleware and error handling were especially helpful. Excellent teacher.',
    });
    reviews.push(review3);

    const review4 = await Review.create({
      booking: bookings[3]._id,
      mentor: users[2]._id,
      learner: users[0]._id,
      rating: 4,
      comment: 'Priya has a great eye for design. She pointed out UX issues in my project that I had completely missed. The Figma tips were a nice bonus.',
    });
    reviews.push(review4);

    const review5 = await Review.create({
      booking: bookings[4]._id,
      mentor: users[3]._id,
      learner: users[4]._id,
      rating: 5,
      comment: 'Arjun made pandas feel approachable. He used a real dataset from his work to demonstrate concepts, which made it way more interesting than a textbook.',
    });
    reviews.push(review5);

    console.log(`Created ${reviews.length} reviews`);
    console.log('\nSeed completed successfully!');
    console.log('\nTest accounts (all use password: password123):');
    users.forEach((u) => {
      console.log(`  ${u.name}: ${u.email}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
