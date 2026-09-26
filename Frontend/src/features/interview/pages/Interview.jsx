import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview';
import '../styles/Interview.css';

const Interview = () => {
  const { loading, generateReport, reports, getAllReports } = useInterview();
  const navigate = useNavigate();

  useEffect(() => {
    getAllReports();
  }, []);

  const [selfDescription, setSelfDescription] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState(null);
  const [resumeFileName, setResumeFileName] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      setResumeFileName(file.name);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setResume(file);
      setResumeFileName(file.name);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!selfDescription.trim() || !jobDescription.trim() || !resume) {
      setError('Please fill in all fields and upload your resume.');
      return;
    }
    const interviewReport = await generateReport({ selfDescription, jobDescription, resumeFile: resume });
    // report is now set in context via the hook; navigate and pass it via state
    navigate(`/interview/report/${interviewReport._id}`);
  };

  // for showing loading ui after submitting all 3 fields for generating report
  if (loading) {
    return (
      <div className="home-loading-page">
        <div className="home-loading-spinner" />
        <h1 className="home-loading-title">Creating your Interview Plan…</h1>
        <p className="home-loading-subtitle">Analysing your resume and job description</p>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="home-logo-area">
          <div className="home-logo-icon">✦</div>
          <span className="home-logo-text">InterviewAI</span>
        </div>
      </header>

      <main className="home-main">
        {/* Hero */}
        <div className="home-hero">
          <h1 className="home-hero-title">Generate Your Interview Report</h1>
          <p className="home-hero-subtitle">
            Provide a few details and let AI craft a personalized interview preparation plan for you.
          </p>
        </div>

        {/* Steps indicator */}
        <div className="home-steps-row">
          <div className="home-step-active">
            <span className="home-step-number">1</span>
            <span className="home-step-label">Your Details</span>
          </div>
          <div className="home-step-connector" />
          <div className="home-step-inactive">
            <span className="home-step-number-inactive">2</span>
            <span className="home-step-label-inactive">Report</span>
          </div>
        </div>

        {/* Form Card */}
        <div className="home-card">
          {error && <div className="home-error-banner">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Self Description */}
            <div className="home-field-group">
              <label htmlFor="selfDescription" className="home-label">
                Self Description
                <span className="home-required">*</span>
              </label>
              <p className="home-hint">
                Tell us about yourself — your background, current role, and career goals.
              </p>
              <textarea
                id="selfDescription"
                name="selfDescription"
                rows={3}
                placeholder="e.g. I'm a final-year Computer Science student with experience in React and Node.js. I'm passionate about building scalable web applications..."
                className="home-textarea"
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
              />
            </div>

            {/* Job Description */}
            <div className="home-field-group">
              <label htmlFor="jobDescription" className="home-label">
                Job Description
                <span className="home-required">*</span>
              </label>
              <p className="home-hint">
                Paste the full job description of the role you are targeting.
              </p>
              <textarea
                id="jobDescription"
                name="jobDescription"
                rows={4}
                placeholder="e.g. We are looking for a Software Engineer with 2+ years of experience in React, REST APIs, and cloud infrastructure..."
                className="home-textarea"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {/* Resume Upload */}
            <div className="home-field-group">
              <label className="home-label">
                Resume (PDF)
                <span className="home-required">*</span>
              </label>
              <p className="home-hint">Upload your resume in PDF format.</p>

              <div
                className={`home-dropzone ${resume ? 'home-dropzone-success' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,application/pdf"
                  style={{ display: 'none' }}
                  onChange={handleResumeChange}
                />
                {resume ? (
                  <div className="home-file-selected">
                    <span className="home-file-icon">📄</span>
                    <div>
                      <p className="home-file-name">{resumeFileName}</p>
                      <p className="home-file-hint">Click to replace</p>
                    </div>
                  </div>
                ) : (
                  <div className="home-dropzone-content">
                    <span className="home-upload-icon">⬆</span>
                    <p className="home-dropzone-text">
                      <strong>Click to upload</strong> or drag and drop
                    </p>
                    <p className="home-dropzone-subtext">PDF only (max 10 MB)</p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className={`home-submit-btn ${loading ? 'home-submit-btn-disabled' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="home-spinner-row">
                  <span className="home-spinner" />
                  Generating Report…
                </span>
              ) : (
                'Generate Interview Report →'
              )}
            </button>
          </form>
        </div>

        {/* ── All Reports Section ── */}
        <section className="home-reports-section">
          <div className="home-reports-header">
            <div className="home-reports-header-left">
              <h2 className="home-reports-title">Your Reports</h2>
              {reports && reports.length > 0 && (
                <span className="home-reports-count-badge">{reports.length}</span>
              )}
            </div>
          </div>

          {reports && reports.length > 0 ? (
            <div className="home-reports-list">
              {reports.map((item) => {
                const scoreColor =
                  item.matchScore >= 75 ? '#16a34a' :
                  item.matchScore >= 50 ? '#d97706' : '#dc2626';
                const scoreBg =
                  item.matchScore >= 75 ? '#f0fdf4' :
                  item.matchScore >= 50 ? '#fffbeb' : '#fef2f2';

                return (
                  <div
                    key={item._id}
                    className="home-report-item-card"
                    onClick={() => navigate(`/interview/report/${item._id}`)}
                  >
                    <div className="home-report-item-main">
                      <div className="home-report-item-title-row">
                        <h3 className="home-report-item-title">{item.title || 'Interview Preparation Report'}</h3>
                        {item.matchScore !== undefined && item.matchScore !== null && (
                          <span
                            className="home-report-score-badge"
                            style={{
                              color: scoreColor,
                              backgroundColor: scoreBg,
                              borderColor: `${scoreColor}40`,
                            }}
                          >
                            {item.matchScore}% Match
                          </span>
                        )}
                      </div>
                      {item.createdAt && (
                        <p className="home-report-item-date">
                          {new Date(item.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="home-view-report-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/interview/report/${item._id}`);
                      }}
                    >
                      View Report →
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="home-no-reports-card">
              <p className="home-no-reports-text">No previous interview reports found.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Interview;
