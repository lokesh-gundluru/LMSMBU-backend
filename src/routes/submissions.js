// src/routes/submissions.js
const express = require('express');
const router = express.Router();
const submissionController = require('../controllers/submissionController');
const authMiddleware = require('../middleware/authMiddleware');
const { upload } = require('../utils/storage');

router.post('/:assignmentId/submit', authMiddleware, upload.single('file'), submissionController.submitAssignment);
router.get('/:assignmentId', authMiddleware, submissionController.listSubmissionsForAssignment);
router.post('/grade/:submissionId', authMiddleware, submissionController.gradeSubmission);

module.exports = router;
