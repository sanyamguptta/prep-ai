const express = require('express');
const { generateInterviewReportController } = require('../controllers/interview.controller.js');
const { authenticateUser } = require('../middlewares/auth.middleware.js');
const upload = require('../middlewares/file.middleware');

const router = express.Router();

/**
 * @route /api/interview
 * @description  generate new interview report on the basis of user self description,resume pdf and job description.
 * @access Private
 */
router.post('/', authenticateUser, upload.single("resume"), generateInterviewReportController);




module.exports = router;