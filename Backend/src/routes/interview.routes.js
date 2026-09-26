const express = require('express');
const { generateInterviewReportController, getInterviewReportById, getAllInterviewReports, generatePdf } = require('../controllers/interview.controller.js');
const { authenticateUser } = require('../middlewares/auth.middleware.js');
const upload = require('../middlewares/file.middleware');

const router = express.Router();

/**
 * @route /api/interview
 * @description  generate new interview report on the basis of user self description,resume pdf and job description.
 * @access Private
 */
router.post('/', authenticateUser, upload.single("resume"), generateInterviewReportController);


/**
 * @route /api/interview/:interviewId
 * @description  get a interview report of a logged in user
 * @access Private
 */
router.get('/report/:interviewId', authenticateUser, getInterviewReportById);

/**
 * @route /api/interview
 * @description get all interview reports of logged in user
 * @access Private
 */
router.get('/', authenticateUser, getAllInterviewReports);

/**
 * @route /api/interview/resume/pdf
 * @description generate resume pdf on the basis of user self description, resume content and job description
 * @access Private
 */
router.post('/resume/pdf/:interviewReportId', authenticateUser, generatePdf);

module.exports = router;