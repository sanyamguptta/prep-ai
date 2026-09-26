import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useInterview } from '../hooks/useInterview';
import '../styles/Interview.css';


// Helper badge for skill-gap severity
const SeverityBadge = ({ severity }) => {
  const norm = severity?.toLowerCase();
  const label = norm ? norm.charAt(0).toUpperCase() + norm.slice(1) : 'Low';
  const severityClass =
    norm === 'high' ? 'severity-high' :
    norm === 'medium' ? 'severity-medium' : 'severity-low';

  return (
    <span className={`severity-badge ${severityClass}`}>
      {label}
    </span>
  );
};


// Main Report Page
const InterviewReport = () => {
  const navigate = useNavigate();
  const { report, loading, getReportById, getResumePdf } = useInterview();
  const { interviewId } = useParams();

  const [activeSection, setActiveSection] = useState('technical');
  const [expandedQuestions, setExpandedQuestions] = useState({ 0: true });

  // hydrating state after refresh
  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  // checking loading state
  if (loading) {
    return (
      <div className="interview-loading-page">
        <div className="interview-loading-spinner" />
        <h1 className="interview-loading-title">Loading Report…</h1>
        <p className="interview-loading-subtitle">Fetching your interview report details</p>
      </div>
    );
  }

  // Guard — if user navigates here directly without a report
  if (!report) {
    return (
      <div className="interview-empty-page">
        <div className="interview-empty-card">
          <span className="interview-empty-icon">🔍</span>
          <h2 className="interview-empty-title">No Report Found</h2>
          <p className="interview-empty-subtitle">
            Please complete the interview setup form first.
          </p>
          <button className="interview-back-btn" onClick={() => navigate('/interview')}>
            ← Go to Setup
          </button>
        </div>
      </div>
    );
  }

  const {
    matchScore = 0,
    title = 'Interview Report',
    selfDescription,
    jobDescription,
    technicalQuestions = [],
    behavioralQuestions = [],
    skillGaps = [],
    preparationPlan = [],
  } = report;

  /* Match score ring colour */
  const scoreColor =
    matchScore >= 75 ? '#16a34a' :
    matchScore >= 50 ? '#d97706' : '#dc2626';

  const scoreMessage =
    matchScore >= 75 ? 'Strong match for this role' :
    matchScore >= 50 ? 'Moderate match for this role' : 'Needs preparation for this role';

  const toggleQuestion = (index) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <div className="interview-page">
      {/* Top Header */}
      <header className="interview-header">
        <div className="interview-logo-area" onClick={() => navigate('/interview')}>
          <div className="interview-logo-icon">✦</div>
          <span className="interview-logo-text">InterviewAI</span>
        </div>
        <div className="interview-header-right">
          <button className="interview-new-report-btn" onClick={() => navigate('/interview')}>
            + New Interview
          </button>
        </div>
      </header>

      {/* Main 3-Column Layout Container */}
      <div className="interview-layout-container">

        {/* ── LEFT SIDEBAR: SECTIONS MENU ── */}
        <aside className="interview-left-sidebar">
          <p className="sidebar-section-label">SECTIONS</p>
          <nav className="sidebar-nav">
            <button
              className={`nav-item-btn ${activeSection === 'technical' ? 'nav-item-btn-active' : ''}`}
              onClick={() => {
                setActiveSection('technical');
                setExpandedQuestions({ 0: true });
              }}
            >
              <span className="nav-item-icon">&lt; &gt;</span>
              <span className="nav-item-text">Technical Questions</span>
              {technicalQuestions.length > 0 && (
                <span className="nav-item-badge">{technicalQuestions.length}</span>
              )}
            </button>

            <button
              className={`nav-item-btn ${activeSection === 'behavioral' ? 'nav-item-btn-active' : ''}`}
              onClick={() => {
                setActiveSection('behavioral');
                setExpandedQuestions({ 0: true });
              }}
            >
              <span className="nav-item-icon">💬</span>
              <span className="nav-item-text">Behavioral Questions</span>
              {behavioralQuestions.length > 0 && (
                <span className="nav-item-badge">{behavioralQuestions.length}</span>
              )}
            </button>

            <button
              className={`nav-item-btn ${activeSection === 'roadmap' ? 'nav-item-btn-active' : ''}`}
              onClick={() => setActiveSection('roadmap')}
            >
              <span className="nav-item-icon">🚀</span>
              <span className="nav-item-text">Road Map</span>
              {preparationPlan.length > 0 && (
                <span className="nav-item-badge">{preparationPlan.length}d</span>
              )}
            </button>

            <button
              className={`nav-item-btn ${activeSection === 'details' ? 'nav-item-btn-active' : ''}`}
              onClick={() => setActiveSection('details')}
            >
              <span className="nav-item-icon">📋</span>
              <span className="nav-item-text">Profile & Job</span>
            </button>
          </nav>

          {/* Download Button */}
          <div className="sidebar-action-wrapper">
            <button 
            onClick={() => {
              getResumePdf(interviewId);
            }}
            className="download-pdf-btn">
              <span className="download-btn-icon">✦</span>
              Download Resume
            </button>
          </div>
        </aside>

        {/* ── CENTER CONTENT AREA ── */}
        <main className="interview-center-content">

          {/* Section 1: Technical Questions */}
          {activeSection === 'technical' && (
            <div>
              <div className="section-header">
                <h1 className="section-heading">Technical Questions</h1>
                <span className="section-count-pill">{technicalQuestions.length} questions</span>
              </div>

              {technicalQuestions.length === 0 ? (
                <div className="interview-empty-card">No technical questions generated.</div>
              ) : (
                <div className="accordion-list">
                  {technicalQuestions.map((q, idx) => {
                    const isExpanded = !!expandedQuestions[idx];
                    return (
                      <div key={idx} className="accordion-card">
                        <div
                          className="accordion-header"
                          onClick={() => toggleQuestion(idx)}
                        >
                          <div className="q-badge">Q{idx + 1}</div>
                          <p className="accordion-question-text">{q.question}</p>
                          <span className="accordion-chevron">{isExpanded ? '▲' : '▼'}</span>
                        </div>

                        {isExpanded && (
                          <div className="accordion-body">
                            {/* Intention */}
                            <div className="intention-box">
                              <span className="intention-tag">INTENTION</span>
                              <p className="intention-text">{q.intention}</p>
                            </div>

                            {/* Suggested / Model Answer */}
                            <div className="answer-box">
                              <span className="answer-tag">MODEL ANSWER</span>
                              <p className="answer-text">{q.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Section 2: Behavioral Questions */}
          {activeSection === 'behavioral' && (
            <div>
              <div className="section-header">
                <h1 className="section-heading">Behavioral Questions</h1>
                <span className="section-count-pill">{behavioralQuestions.length} questions</span>
              </div>

              {behavioralQuestions.length === 0 ? (
                <div className="interview-empty-card">No behavioral questions generated.</div>
              ) : (
                <div className="accordion-list">
                  {behavioralQuestions.map((q, idx) => {
                    const isExpanded = !!expandedQuestions[idx];
                    return (
                      <div key={idx} className="accordion-card">
                        <div
                          className="accordion-header"
                          onClick={() => toggleQuestion(idx)}
                        >
                          <div className="q-badge">Q{idx + 1}</div>
                          <p className="accordion-question-text">{q.question}</p>
                          <span className="accordion-chevron">{isExpanded ? '▲' : '▼'}</span>
                        </div>

                        {isExpanded && (
                          <div className="accordion-body">
                            {/* Intention */}
                            <div className="intention-box">
                              <span className="intention-tag">INTENTION</span>
                              <p className="intention-text">{q.intention}</p>
                            </div>

                            {/* Suggested / Model Answer */}
                            <div className="answer-box">
                              <span className="answer-tag">MODEL ANSWER</span>
                              <p className="answer-text">{q.answer}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Section 3: Road Map / Preparation Plan */}
          {activeSection === 'roadmap' && (
            <div>
              <div className="section-header">
                <h1 className="section-heading">Road Map</h1>
                <span className="section-count-pill">{preparationPlan.length} days plan</span>
              </div>

              {preparationPlan.length === 0 ? (
                <div className="interview-empty-card">No preparation plan generated.</div>
              ) : (
                <div className="plan-list">
                  {preparationPlan.map((p, idx) => (
                    <div key={idx} className="plan-card">
                      <div className="plan-day-badge">Day {p.day}</div>
                      <div className="plan-content">
                        <h3 className="plan-focus-title">{p.focus}</h3>
                        <ul className="plan-taskList">
                          {(p.tasks || []).map((t, j) => (
                            <li key={j} className="plan-taskItem">{t}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Section 4: Submitted Profile & Job Details */}
          {activeSection === 'details' && (
            <div>
              <div className="section-header">
                <h1 className="section-heading">Submitted Details</h1>
              </div>

              <div className="details-grid">
                <div className="detail-card">
                  <p className="detail-card-label">Target Role / Job Title</p>
                  <p className="detail-card-value">{title || '—'}</p>
                </div>
                <div className="detail-card">
                  <p className="detail-card-label">Self Description</p>
                  <p className="detail-card-value">{selfDescription || '—'}</p>
                </div>
                <div className="detail-card">
                  <p className="detail-card-label">Job Description</p>
                  <p className="detail-card-value">{jobDescription || '—'}</p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ── RIGHT SIDEBAR: MATCH SCORE & SKILL GAPS ── */}
        <aside className="interview-right-sidebar">

          {/* 1. Match Score Card */}
          <div className="side-card">
            <p className="side-card-label">MATCH SCORE</p>
            <div className="score-circle-container">
              <div className="score-circle" style={{ borderColor: scoreColor }}>
                <span className="score-number" style={{ color: scoreColor }}>{matchScore}</span>
                <span className="score-percent" style={{ color: scoreColor }}>%</span>
              </div>
            </div>
            <p className="score-message-text" style={{ color: scoreColor }}>
              {scoreMessage}
            </p>
          </div>

          {/* 2. Skill Gaps Card */}
          <div className="side-card">
            <p className="side-card-label">SKILL GAPS</p>
            {skillGaps.length === 0 ? (
              <p className="no-skills-text">No critical skill gaps identified!</p>
            ) : (
              <div className="skill-list">
                {skillGaps.map((sg, idx) => {
                  const map = {
                    high:   { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' },
                    medium: { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
                    low:    { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' },
                  };
                  const s = map[sg.severity?.toLowerCase()] || map.low;
                  return (
                    <div
                      key={idx}
                      className="skill-item-card"
                      style={{
                        backgroundColor: s.bg,
                        borderColor: s.border,
                      }}
                    >
                      <span className="skill-name-text" style={{ color: s.color }}>
                        {sg.skill}
                      </span>
                      <SeverityBadge severity={sg.severity} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
};

export default InterviewReport;
