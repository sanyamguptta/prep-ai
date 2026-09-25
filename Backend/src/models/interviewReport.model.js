const mongoose = require('mongoose');

const technicalQuestionSchema = new mongoose.Schema({

    question: {
        type: String,
        required: [true, 'Technical question is required'],
    },
    intention: {
        type: String,
        required: [true, 'Intention is required'],
    },
    answer: {
        type: String,
        required: [true, 'Answer is required'],
    }
}, {
    // id is not required, bcz we are storing this detail in interviewReportSchema only.
    _id: false,
})

const behavioralQuestionSchema = new mongoose.Schema({

    question: {
        type: String,
        required: [true, 'Behaviour question is required'],
    },
    intention: {
        type: String,
        required: [true, 'Intention is required'],
    },
    answer: {
        type: String,
        required: [true, 'Answer is required'],
    }
}, {
    // id is not required, bcz we are storing this detail in interviewReportSchema only.
    _id: false,
})

const skillGapSchema = new mongoose.Schema({

    skill: {
        type: String,
        required: [true, 'Skill is required'],
    },
    severity: {
        type: String, 
        enum: ["low", "medium", "high"],
        required: [true, 'severity is required'],
    }
}, {
    // id is not required, bcz we are storing this detail in interviewReportSchema only.
    id: false,
})

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: [true, 'Day is required'],
    },
    focus: {
        type: String,
        required: [true, 'Focus is required'],
    },
    tasks: [
        // task -> array of string
        {
            type: String,
            required: [true, 'Task is required'],
        }
    ]
})

const interviewReportSchema = new mongoose.Schema({

    // job description is mandatory fro generating report
    jobDescription: {
        type: String,
        required: [true, 'Job Description is required'],
    },
    // Any one from resume text or self description can work
    resume: {
        type: String, 
    },
    selfDescription: {
        type: String,
    },
    matchScore: {
        type: Number,
        min: 0,
        max: 100,
    },

    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    }
}, {
    timestamps: true,
})



const interviewReportModel = mongoose.model('interviewReport', interviewReportSchema);

module.exports = interviewReportModel;