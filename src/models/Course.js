// src/models/Course.js
const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  durationWeeks: Number,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  materials: [{ filename: String, url: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema);
