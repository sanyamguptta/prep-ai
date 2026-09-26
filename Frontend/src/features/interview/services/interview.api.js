// file for interacting with the interview backend api
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
});


/**
 * @description service function to generate interview eport based on the 3 input fields from the user side
 */
export const generateInterviewReport = async ({ selfDescription, jobDescription, resumeFile }) => {

    // multipart/form-data is required because we are uploading a file
    const formData = new FormData();
    formData.append('selfDescription', selfDescription);
    formData.append('jobDescription', jobDescription);
    formData.append('resume', resumeFile);

    const response = await api.post('/api/interview', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
}

/**
 * @description service function to get interview report by interviewId
 */
export const getInterviewReportById = async ( interviewId ) => {

    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
}

/**
 * @description service function to get all interview reports of a logged in user
 */
export const getAllInterviewReports = async () => {

    const response = await api.get('/api/interview');
    return response.data;
}