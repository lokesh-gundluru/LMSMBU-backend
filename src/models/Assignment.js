// src/models/Assignment.js
const mongoose = require('mongoose');

const MCQSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answerIndex: Number
}, { _id: false });

const AssignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: String,
  description: String,
  dueDate: Date,
  type: { type: String, enum: ['file','text','mcq'], default: 'file' },
  mcqQuestions: [MCQSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
