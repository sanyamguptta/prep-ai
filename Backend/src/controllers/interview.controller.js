const pdfParse = require('pdf-parse');
const { generateInterviewReport, generateResumePdf } = require('../services/ai.service.js');
const interviewReportModel = require('../models/interviewReport.model.js');

/**
 * @description controller to generate interview report based on the 3 input fields provided by the user
 */
const generateInterviewReportController = async (req, res) => {

    try {

        // fecthing all 3 fields from frontend
        const { jobDescription, selfDescription } = req.body;
        // for reading content inside the pdf, we use PDFParse class 
        // Uint8Array.from -> for converting pdf buffer into Uint8Array 
        // ie; converts pdf into a text form for providing it to the ai model for generating report
        const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();

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
    catch (error) {
        console.error(error);
     
        return res.status(500).json({
           success: false,
           message: "Something went wrong"
        });
    }
}

/**
 * @description controller to get interview report by interviewId
 */
const getInterviewReportById = async (req, res) => {

    const { interviewId } = req.params;
    
    try {
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewId,
            user: req.user.id,
        })
    
        if(!interviewReport) {
            return res.status(404).json({
                message: 'Interview report not found',
                status: false,
            })
        }
    
        return res.status(200).json({
            message: 'Interview report fetched successfully!',
            status: true,
            interviewReport,
        })
    }
    catch (error) {
        console.error(error);
     
        return res.status(500).json({
           success: false,
           message: "Something went wrong"
        });
    }
}


/**
 * @description controller to fetch all interview report of the logged in user
 */
const getAllInterviewReports = async (req, res) => {

    try {
        const interviewReports = await interviewReportModel.find({
            user: req.user.id,
        })
        .sort({ createdAt: -1})
        .select("-resume -selfDescription -jobDescription -v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");
    
        return res.status(200).json({
            message: 'All interview reports are fetched successfully',
            status: true,
            interviewReports,
        })
    }
    catch (error) {
        console.error(error);
     
        return res.status(500).json({
           success: false,
           message: "Something went wrong"
        });
    }
}

/**
 * @description controller to generate resume PDF based on user seld description, resume and job description
 */
const generatePdf = async (req, res) => {

    
    const { interviewReportId } = req.params;

    try {
        // Find the interview report
        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id,
        });
        if(!interviewReport) {
            return res.status(404).json({
                message: 'Interview report not found.',
                status: false,
            })
        }


        const { resume, selfDescription, jobDescription } = interviewReport;

        // Generate PDF using data stored in the interview report
        const pdfBuffer = await generateResumePdf({ resume, selfDescription, jobDescription });

        // Send PDF to frontend
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`,
        })

        return res.send(pdfBuffer);
    }
    catch (error) {
        console.error(error);
        console.error("PDF GENERATION ERROR:", error);
     
        return res.status(500).json({
           success: false,
           message: "Something went wrong"
        });
    }
}


module.exports = {
    generateInterviewReportController,
    getInterviewReportById,
    getAllInterviewReports,
    generatePdf,
}