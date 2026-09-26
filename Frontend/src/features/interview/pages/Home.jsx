import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useInterview } from '../hooks/useInterview';

const Home = () => {

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
      <div style={styles.loadingPage}>
        <div style={styles.loadingSpinner} />
        <h1 style={styles.loadingTitle}>Creating your Interview Plan…</h1>
        <p style={styles.loadingSubtitle}>Analysing your resume and job description</p>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>✦</div>
          <span style={styles.logoText}>InterviewAI</span>
        </div>
      </header>

      <main style={styles.main}>
        {/* Hero */}
        <div style={styles.hero}>
          <h1 style={styles.heroTitle}>Generate Your Interview Report</h1>
          <p style={styles.heroSubtitle}>
            Provide a few details and let AI craft a personalized interview preparation plan for you.
          </p>
        </div>

        {/* Steps indicator */}
        <div style={styles.stepsRow}>
          <div style={styles.stepActive}>
            <span style={styles.stepNumber}>1</span>
            <span style={styles.stepLabel}>Your Details</span>
          </div>
          <div style={styles.stepConnector} />
          <div style={styles.stepInactive}>
            <span style={styles.stepNumberInactive}>2</span>
            <span style={styles.stepLabelInactive}>Report</span>
          </div>
        </div>

        

        {/* Form Card */}
        <div style={styles.card}>
          {error && <div style={styles.errorBanner}>{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Self Description */}
            <div style={styles.fieldGroup}>
              <label htmlFor="selfDescription" style={styles.label}>
                Self Description
                <span style={styles.required}>*</span>
              </label>
              <p style={styles.hint}>
                Tell us about yourself — your background, current role, and career goals.
              </p>
              <textarea
                id="selfDescription"
                name="selfDescription"
                rows={5}
                placeholder="e.g. I'm a final-year Computer Science student with experience in React and Node.js. I'm passionate about building scalable web applications..."
                style={styles.textarea}
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
              />
            </div>

            {/* Job Description */}
            <div style={styles.fieldGroup}>
              <label htmlFor="jobDescription" style={styles.label}>
                Job Description
                <span style={styles.required}>*</span>
              </label>
              <p style={styles.hint}>
                Paste the full job description of the role you are targeting.
              </p>
              <textarea
                id="jobDescription"
                name="jobDescription"
                rows={6}
                placeholder="e.g. We are looking for a Software Engineer with 2+ years of experience in React, REST APIs, and cloud infrastructure..."
                style={styles.textarea}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
            </div>

            {/* Resume Upload */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                Resume (PDF)
                <span style={styles.required}>*</span>
              </label>
              <p style={styles.hint}>Upload your resume in PDF format.</p>

              <div
                style={{
                  ...styles.dropzone,
                  ...(resume ? styles.dropzoneSuccess : {}),
                }}
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
                  <div style={styles.fileSelected}>
                    <span style={styles.fileIcon}>📄</span>
                    <div>
                      <p style={styles.fileName}>{resumeFileName}</p>
                      <p style={styles.fileHint}>Click to replace</p>
                    </div>
                  </div>
                ) : (
                  <div style={styles.dropzoneContent}>
                    <span style={styles.uploadIcon}>⬆</span>
                    <p style={styles.dropzoneText}>
                      <strong>Click to upload</strong> or drag and drop
                    </p>
                    <p style={styles.dropzoneSubText}>PDF only (max 10 MB)</p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              style={{ ...styles.submitBtn, ...(loading ? styles.submitBtnDisabled : {}) }}
              disabled={loading}
            >
              {loading ? (
                <span style={styles.spinnerRow}>
                  <span style={styles.spinner} />
                  Generating Report…
                </span>
              ) : (
                'Generate Interview Report →'
              )}
            </button>
          </form>
        </div>

        {/* ── All Reports Section ── */}
        <section style={styles.reportsSection}>
          <div style={styles.reportsHeader}>
            <div style={styles.reportsHeaderLeft}>
              <h2 style={styles.reportsTitle}>Your Reports</h2>
              {reports && reports.length > 0 && (
                <span style={styles.reportsCountBadge}>{reports.length}</span>
              )}
            </div>
          </div>

          {reports && reports.length > 0 ? (
            <div style={styles.reportsList}>
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
                    style={styles.reportItemCard}
                    onClick={() => navigate(`/interview/report/${item._id}`)}
                  >
                    <div style={styles.reportItemMain}>
                      <div style={styles.reportItemTitleRow}>
                        <h3 style={styles.reportItemTitle}>{item.title || 'Interview Preparation Report'}</h3>
                        {item.matchScore !== undefined && item.matchScore !== null && (
                          <span
                            style={{
                              ...styles.reportScoreBadge,
                              color: scoreColor,
                              backgroundColor: scoreBg,
                              borderColor: scoreColor + '40',
                            }}
                          >
                            {item.matchScore}% Match
                          </span>
                        )}
                      </div>
                      {item.createdAt && (
                        <p style={styles.reportItemDate}>
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
                      style={styles.viewReportBtn}
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
            <div style={styles.noReportsCard}>
              <p style={styles.noReportsText}>No previous interview reports found.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fb',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '0 32px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoIcon: {
    fontSize: '18px',
    color: '#4f46e5',
    fontWeight: '700',
  },
  logoText: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#111827',
    letterSpacing: '-0.3px',
  },
  main: {
    maxWidth: '680px',
    margin: '0 auto',
    padding: '48px 24px 80px',
  },
  hero: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  heroTitle: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 10px',
    letterSpacing: '-0.5px',
  },
  heroSubtitle: {
    fontSize: '15px',
    color: '#6b7280',
    margin: 0,
    lineHeight: '1.6',
  },
  stepsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '32px',
    gap: '8px',
  },
  stepActive: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stepNumber: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#4f46e5',
  },
  stepConnector: {
    height: '1px',
    width: '48px',
    backgroundColor: '#d1d5db',
  },
  stepInactive: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stepNumberInactive: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#e5e7eb',
    color: '#9ca3af',
    fontSize: '13px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabelInactive: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#9ca3af',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '36px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    border: '1px solid #e5e7eb',
  },
  errorBanner: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#dc2626',
    marginBottom: '24px',
  },
  fieldGroup: {
    marginBottom: '28px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '4px',
  },
  required: {
    color: '#ef4444',
    marginLeft: '3px',
  },
  hint: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '0 0 10px',
    lineHeight: '1.5',
  },
  textarea: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    boxSizing: 'border-box',
    outline: 'none',
    resize: 'vertical',
    lineHeight: '1.6',
    color: '#111827',
    backgroundColor: '#ffffff',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  },
  dropzone: {
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    padding: '28px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.2s, background-color 0.2s',
    backgroundColor: '#fafafa',
  },
  dropzoneSuccess: {
    border: '2px dashed #4f46e5',
    backgroundColor: '#f5f3ff',
  },
  dropzoneContent: {},
  uploadIcon: {
    fontSize: '24px',
    display: 'block',
    marginBottom: '8px',
    color: '#6b7280',
  },
  dropzoneText: {
    fontSize: '14px',
    color: '#374151',
    margin: '0 0 4px',
  },
  dropzoneSubText: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
  },
  fileSelected: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    justifyContent: 'center',
  },
  fileIcon: {
    fontSize: '28px',
  },
  fileName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
    margin: '0 0 2px',
    textAlign: 'left',
  },
  fileHint: {
    fontSize: '12px',
    color: '#6b7280',
    margin: 0,
    textAlign: 'left',
  },
  submitBtn: {
    width: '100%',
    padding: '13px 20px',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    letterSpacing: '-0.2px',
    transition: 'background-color 0.2s',
  },
  submitBtnDisabled: {
    backgroundColor: '#a5b4fc',
    cursor: 'not-allowed',
  },
  spinnerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.4)',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'spin 0.7s linear infinite',
  },

  /* ── Full-page loading screen ── */
  loadingPage: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    backgroundColor: '#f8f9fb',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  loadingSpinner: {
    width: '44px',
    height: '44px',
    borderRadius: '50%',
    border: '3px solid #e5e7eb',
    borderTop: '3px solid #4f46e5',
    animation: 'spin 0.75s linear infinite',
  },
  loadingTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
    letterSpacing: '-0.3px',
  },
  loadingSubtitle: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: 0,
  },

  /* ── All Reports Section ── */
  reportsSection: {
    marginTop: '44px',
  },
  reportsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  reportsHeaderLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  reportsTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#111827',
    margin: 0,
    letterSpacing: '-0.3px',
  },
  reportsCountBadge: {
    backgroundColor: '#ede9fe',
    color: '#4f46e5',
    fontSize: '12px',
    fontWeight: '700',
    padding: '2px 9px',
    borderRadius: '12px',
  },
  reportsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  reportItemCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    cursor: 'pointer',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  reportItemMain: {
    flex: 1,
    minWidth: 0,
  },
  reportItemTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '4px',
  },
  reportItemTitle: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '420px',
  },
  reportScoreBadge: {
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '12px',
    border: '1px solid',
    whiteSpace: 'nowrap',
  },
  reportItemDate: {
    fontSize: '12px',
    color: '#9ca3af',
    margin: 0,
  },
  viewReportBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    padding: '7px 14px',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    flexShrink: 0,
    transition: 'background-color 0.15s, border-color 0.15s',
  },
  noReportsCard: {
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: '1px dashed #d1d5db',
    padding: '28px 20px',
    textAlign: 'center',
  },
  noReportsText: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: 0,
  },
};

export default Home;
