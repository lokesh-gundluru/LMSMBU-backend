// src/utils/seedDemoData.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { connectDB } = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Assignment = require('../models/Assignment');
const Enrollment = require('../models/Enrollment');

async function seed() {
  await connectDB();
  // clear
  await User.deleteMany({});
  await Course.deleteMany({});
  await Assignment.deleteMany({});
  await Enrollment.deleteMany({});

  const teacherPass = await bcrypt.hash('teacher123', 10);
  const studentPass = await bcrypt.hash('student123', 10);

  const teacher = await User.create({ name: 'Demo Teacher', email: 'teacher@demo.com', passwordHash: teacherPass, role: 'teacher' });
  const student = await User.create({ name: 'Demo Student', email: 'student@demo.com', passwordHash: studentPass, role: 'student' });

  const course = await Course.create({ title: 'Intro to Demo', description: 'A demo course', durationWeeks: 4, teacher: teacher._id });

  await Assignment.create({ course: course._id, title: 'MCQ 1', description: 'MCQ assignment', type: 'mcq', mcqQuestions: [{ question: '2+2?', options: ['1','2','4','5'], answerIndex: 2 }] });
  await Assignment.create({ course: course._id, title: 'Essay 1', description: 'Write something', type: 'text' });

  await Enrollment.create({ student: student._id, course: course._id });

  console.log('Seeded demo data. Users: teacher@demo.com / teacher123  and student@demo.com / student123');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
