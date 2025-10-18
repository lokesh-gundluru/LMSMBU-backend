// src/controllers/submissionController.js
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const Enrollment = require('../models/Enrollment');

exports.submitAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.assignmentId;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // ensure student enrolled
    const enrolled = await Enrollment.findOne({ student: req.user._id, course: assignment.course });
    if (!enrolled) return res.status(403).json({ message: 'Not enrolled' });

    const payload = { assignment: assignmentId, student: req.user._id };
    if (req.body.text) payload.text = req.body.text;
    if (req.body.mcqAnswers) payload.mcqAnswers = JSON.parse(req.body.mcqAnswers);
    if (req.file) payload.file = { filename: req.file.filename, url: `/uploads/${req.file.filename}` };

    const sub = await Submission.findOneAndUpdate(
      { assignment: assignmentId, student: req.user._id },
      payload,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(sub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listSubmissionsForAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

    // only teacher of course or admin
    const course = assignment.course;
    // populate teacher check in a safe manner:
    const subs = await Submission.find({ assignment: req.params.assignmentId }).populate('student', 'name email');
    res.json(subs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.gradeSubmission = async (req, res) => {
  try {
    const submissionId = req.params.submissionId;
    const { grade, feedback } = req.body;
    const sub = await Submission.findById(submissionId).populate('assignment');
    if (!sub) return res.status(404).json({ message: 'Submission not found' });

    // check teacher owns the course
    const AssignmentModel = require('../models/Assignment');
    const Course = require('../models/Course');
    const assignment = await AssignmentModel.findById(sub.assignment._id).populate('course');
    const course = await Course.findById(assignment.course._id);
    // basic permission check: compare teacher id
    if (!course.teacher.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    sub.grade = grade;
    sub.feedback = feedback;
    await sub.save();
    res.json(sub);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
