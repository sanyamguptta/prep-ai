// file for creating function for developing ai feature of generating report after taking user's details
const { GoogleGenAI } = require('@google/genai');
// for generating structured output using Gemini Model
const { z } = require('zod');

// setting up Gemini Model for report degeneration
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,

})

// schema for generating structural output
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

// function for generating report
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

module.exports = {
    generateInterviewReport,
}