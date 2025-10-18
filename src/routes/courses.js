// src/routes/courses.js
const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', courseController.listCourses);
router.get('/:id', courseController.getCourse);
router.post('/', authMiddleware, roleMiddleware('teacher'), courseController.createCourse);
router.put('/:id', authMiddleware, courseController.updateCourse);
router.delete('/:id', authMiddleware, courseController.deleteCourse);
router.get('/:id/students', authMiddleware, roleMiddleware('teacher'), courseController.listStudents);

module.exports = router;
