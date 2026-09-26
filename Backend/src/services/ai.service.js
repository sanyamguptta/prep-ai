// file for creating function for developing ai feature of generating report after taking user's details
const { GoogleGenAI } = require('@google/genai');
// for generating structured output using Gemini Model
const { z, json } = require('zod');

const puppeteer = require('puppeteer');


// setting up Gemini Model for report degeneration
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,

})

/**
 * @description schema for generating structural output
 */
const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job description."),

    title: z.string().describe("The title of the job for which the interview report is generated."),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("The Technical question can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking the question"),
        answer: z.string().describe("How to answer this question, what points o cover, what approach to take etc.")
    })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them."),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The Technical question can be asked in the interview"),
        intention: z.string().describe("The intention of the interviewer behind asking the question"),
        answer: z.string().describe("How to answer this question, what points o cover, what approach to take etc.")
    })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them."),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill which the candidate is lacking"),
        severity: z.enum([ "low", "medium", "high" ]).describe("The severity of this skill gap")
    })).describe("List of skill gaps in the candidate's profile along with their severity"),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the prepararion plan, starting from 1"),
        focus: z.string().describe("The main focus of this day in the preparation plan. ie; data structures, system design, mock interviews."),
        tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
    }))
})

/**
 * @description function for generating report using 3 input fields provided by the user
 */
async function generateInterviewReport({ jobDescription, resume, selfDescription }) {

    const prompt = `Generate a interview report for a candidate with the following details: Resume: ${resume} Self Description: ${selfDescription} Job Description: ${jobDescription} `

   // invoking model for generating response in json format based on the schema provided in (zodToJsonSchema)
    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        // config -> used when we want structural output (using gemini)
        config: {
            responseMimeType: "application/json",
            responseSchema: z.toJSONSchema(interviewReportSchema),
        }
    })

    return JSON.parse(response.text);
}

/**
 * @description: function for generating pdf from the html content received as input
 */
async function generatePdfFromHtml(htmlContent) {

    // launching browser
    const browser = await puppeteer.launch({
        executablePath: await puppeteer.executablePath(),
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    // new page
    const page = await browser.newPage();
    // setting page content as htmlContent
    await page.setContent(htmlContent, {
        waitUntil: "networkidle0",
    })

    // creating pdf from the data
    const pdfBuffer = await page.pdf({ format: "A4", margin: {
        top: "10mm",
        right: "10mm",
        bottom: "10mm",
        left: "10mm",
    }, });

    await browser.close();
    return pdfBuffer;
}

/**
 * @description function for generating the html content using gemini model to further convert it into pdf form using puppeteer library.
 */
async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    
    // generating html version from the ai model
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to the pdf using puppeteer library."),
    })

    const prompt = `Generate a pdf for the candidate with the following details: 
                        Resume: ${resume}
                        Self Description: ${selfDescription} 
                        Job Description: ${jobDescription} 

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                `;

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: z.toJSONSchema(resumePdfSchema),
        }
    })

    const jsonContent = JSON.parse(response.text);

    // using puppeteer library for generating pdf using html content which is generated using ai model
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
    return pdfBuffer;
}




module.exports = {
    generateInterviewReport,
    generateResumePdf,
}