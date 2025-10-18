// src/controllers/enrollmentController.js
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

exports.enroll = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const enrollment = await Enrollment.findOneAndUpdate(
      { student: req.user._id, course: courseId },
      { student: req.user._id, course: courseId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(enrollment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Unenroll from a course
exports.unenroll = async (req, res) => {
  try {
    const courseId = req.params.courseId;

    // Remove the enrollment
    const enrollment = await Enrollment.findOneAndDelete({
      student: req.user._id,
      course: courseId,
    });

    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    res.json({ message: 'Successfully unenrolled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.myEnrollments = async (req, res) => {
  try {
    const enrolls = await Enrollment.find({ student: req.user._id }).populate('course');
    res.json(enrolls);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
