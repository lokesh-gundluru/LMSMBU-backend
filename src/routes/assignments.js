// src/routes/assignments.js
const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/:courseId', authMiddleware, roleMiddleware('teacher'), assignmentController.createAssignment);
router.get('/:courseId', authMiddleware, assignmentController.listCourseAssignments);

module.exports = router;
