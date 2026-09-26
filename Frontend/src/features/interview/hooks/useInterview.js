import { generateInterviewReport, getInterviewReportById, getAllInterviewReports } from "../services/interview.api";
import { useContext } from "react";
import { InterviewContext } from "../interview.context";

export const useInterview = () => {

    const context = useContext(InterviewContext);
    if(!context) {
        throw new Error("useInterview must be within the InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context;

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {

        setLoading(true);
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            setReport(response.interviewReport);
            return response.interviewReport;
        }
        catch(err) {
            console.log(err);
        } 
        finally {
            setLoading(false);
        }
    }

    const getReportById = async (interviewId) => {

        setLoading(true);
        try {
            const response = await getInterviewReportById(interviewId);
            setReport(response.interviewReport);
        }
        catch(err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    }

    const getAllReports = async () => {

        try {
            const response = await getAllInterviewReports();
            setReports(response.interviewReports || response.getAllInterviewReports || []);
            return response.interviewReports || response.getAllInterviewReports || [];
        }
        catch(err) {
            console.log(err);
        }
    }


    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getAllReports,
    }

}