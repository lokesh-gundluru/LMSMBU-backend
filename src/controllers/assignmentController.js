// src/controllers/assignmentController.js
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');

exports.createAssignment = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (!course.teacher.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    const data = { ...req.body, course: courseId };
    const assignment = await Assignment.create(data);
    res.json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listCourseAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({ course: req.params.courseId });
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.listAllAssignments = async (req, res) => {
  try {
    let assignments;

    if (req.user.role === 'teacher') {
      // Fetch only assignments for courses taught by this teacher
      const teacherCourses = await Course.find({ teacher: req.user._id }).select('_id');
      assignments = await Assignment.find({ course: { $in: teacherCourses.map(c => c._id) } });
    } else if (req.user.role === 'student') {
      // Fetch assignments for courses the student is enrolled in
      const studentCourses = await Course.find({ students: req.user._id }).select('_id');
      assignments = await Assignment.find({ course: { $in: studentCourses.map(c => c._id) } });
    } else {
      // Admin can see all assignments
      assignments = await Assignment.find();
    }

    res.json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
