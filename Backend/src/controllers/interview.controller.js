const mongoose = require('mongoose');
const pdfParse = require('pdf-parse');
const { generateInterviewReport } = require('../services/ai.service.js');
const interviewReportModel = require('../models/interviewReport.model.js');


const generateInterviewReportController = async (req, res) => {

    // fecthing all 3 fields from frontend
    const { jobDescription, selfDescription } = req.body;
    // for reading content inside the pdf, we use PDFParse class 
    // Uint8Array.from -> for converting pdf buffer into Uint8Array 
    // ie; converts pdf into a text form for providing it to the ai model for generating report
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();

    // try {
    //     // generating report using Gemini Model (calling ai service function)
    //     const interviewReportByAi = await generateInterviewReport({

    //         resume: resumeContent.text, //for accessing all content of pdf in text form(from multiple pages)
    //         selfDescription,
    //         jobDescription,
    //     })

    //     // saving interview report in DB
    //     const interviewReport = await interviewReportModel.create({
    //         user: req.user.id,
    //         resume: resumeContent.text, //for accessing all content of pdf in text form(from multiple pages)
    //         selfDescription,
    //         jobDescription,
    //         // technical questions, behavioral questions & all by destructuring interviewReportAi
    //         ...interviewReportByAi,
    //     })

    //     return res.status(201).json({
    //         message: 'Interview Report generated successfully!',
    //         status: true,
    //         interviewReport,
    //     })
    // }
    // catch(err) {
    //     return res.status(500).json({
    //         message: 'Server Error',
    //         status: false,
    //     })
    // }

    // generating report using Gemini Model (calling ai service function)
    const interviewReportByAi = await generateInterviewReport({

        resume: resumeContent.text, //for accessing all content of pdf in text form(from multiple pages)
        selfDescription,
        jobDescription,
    })

    // saving interview report in DB
    const interviewReport = await interviewReportModel.create({
        user: req.user.id,
        resume: resumeContent.text, //for accessing all content of pdf in text form(from multiple pages)
        selfDescription,
        jobDescription,
        // technical questions, behavioral questions & all by destructuring interviewReportAi
        ...interviewReportByAi,
    })

    return res.status(201).json({
        message: 'Interview Report generated successfully!',
        status: true,
        interviewReport,
    })

}

module.exports = {
    generateInterviewReportController,
}