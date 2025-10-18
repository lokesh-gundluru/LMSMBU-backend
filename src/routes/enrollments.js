// src/routes/enrollments.js
const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/:courseId/enroll', authMiddleware, enrollmentController.enroll);
router.get('/me', authMiddleware, enrollmentController.myEnrollments);

module.exports = router;
