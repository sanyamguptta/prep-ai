import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useInterview } from '../hooks/useInterview';

/* ─────────────────────────────────────────────
   Helper badge for skill-gap severity
───────────────────────────────────────────── */
const SeverityBadge = ({ severity }) => {
  const map = {
    high:   { bg: '#fef2f2', color: '#dc2626', border: '#fecaca', label: 'High' },
    medium: { bg: '#fffbeb', color: '#d97706', border: '#fde68a', label: 'Medium' },
    low:    { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', label: 'Low' },
  };
  const s = map[severity?.toLowerCase()] || map.low;
  return (
    <span style={{
      backgroundColor: s.bg,
      color: s.color,
      border: `1px solid ${s.border}`,
      borderRadius: '20px',
      padding: '2px 10px',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'capitalize',
    }}>
      {s.label}
    </span>
  );
};

/* ─────────────────────────────────────────────
   Section wrapper
───────────────────────────────────────────── */
const Section = ({ title, icon, children }) => (
  <div style={styles.section}>
    <h2 style={styles.sectionTitle}>
      <span style={styles.sectionIcon}>{icon}</span>
      {title}
    </h2>
    {children}
  </div>
);

/* ─────────────────────────────────────────────
   Main Report Page
───────────────────────────────────────────── */
const InterviewReport = () => {
  const navigate = useNavigate();
  const { report, loading, getReportById } = useInterview();
  const { interviewId } = useParams(); 

  // hydrating state after the refresh
  useEffect(() => {
    if(interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId])

  // checking loading state
  if(loading) {
    return (
      <h1>
        Loading Report...
      </h1>
    )
  }

  // Guard — if user navigates here directly without a report
  if (!report) {
    return (
      <div style={styles.emptyPage}>
        <div style={styles.emptyCard}>
          <span style={{ fontSize: '40px' }}>🔍</span>
          <h2 style={{ margin: '16px 0 8px', color: '#111827' }}>No Report Found</h2>
          <p style={{ color: '#6b7280', margin: '0 0 24px' }}>
            Please complete the interview setup form first.
          </p>
          <button style={styles.backBtn} onClick={() => navigate('/interview')}>
            ← Go to Setup
          </button>
        </div>
      </div>
    );
  }

  const {
    matchScore,
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

  return (
    <div style={styles.page}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logoArea}>
          <div style={styles.logoIcon}>✦</div>
          <span style={styles.logoText}>InterviewAI</span>
        </div>
        <button style={styles.newReportBtn} onClick={() => navigate('/interview')}>
          ← New Report
        </button>
      </header>

      <main style={styles.main}>
        {/* ── Hero Score Card ── */}
        <div style={styles.scoreCard}>
          <div style={styles.scoreLeft}>
            <h1 style={styles.scoreCardTitle}>Your Interview Report</h1>
            <p style={styles.scoreCardSub}>
              Based on your resume, self description, and the job description.
            </p>
          </div>
          <div style={styles.scoreCircle(scoreColor)}>
            <span style={styles.scoreNumber(scoreColor)}>{matchScore ?? '—'}</span>
            <span style={styles.scorePercent(scoreColor)}>/ 100</span>
            <span style={styles.scoreLabel}>Match Score</span>
          </div>
        </div>

        {/* Step indicator — step 2 active */}
        <div style={styles.stepsRow}>
          <div style={styles.stepDone}>
            <span style={styles.stepNumberDone}>✓</span>
            <span style={styles.stepLabelDone}>Your Details</span>
          </div>
          <div style={styles.stepConnector} />
          <div style={styles.stepActive}>
            <span style={styles.stepNumber}>2</span>
            <span style={styles.stepLabel}>Report</span>
          </div>
        </div>

        {/* ── Input Summary ── */}
        <Section title="Submitted Details" icon="📋">
          <div style={styles.twoCol}>
            <div>
              <p style={styles.detailLabel}>Self Description</p>
              <p style={styles.detailValue}>{selfDescription || '—'}</p>
            </div>
            <div>
              <p style={styles.detailLabel}>Job Description</p>
              <p style={styles.detailValue}>{jobDescription || '—'}</p>
            </div>
          </div>
        </Section>

        {/* ── Technical Questions ── */}
        {technicalQuestions.length > 0 && (
          <Section title="Technical Questions" icon="💻">
            <div style={styles.questionsGrid}>
              {technicalQuestions.map((q, i) => (
                <div key={i} style={styles.questionCard}>
                  <div style={styles.qIndex}>{i + 1}</div>
                  <div>
                    <p style={styles.question}>{q.question}</p>
                    <p style={styles.intention}>
                      <strong>Why asked: </strong>{q.intention}
                    </p>
                    <div style={styles.answerBox}>
                      <p style={styles.answerLabel}>Suggested Answer</p>
                      <p style={styles.answerText}>{q.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Behavioral Questions ── */}
        {behavioralQuestions.length > 0 && (
          <Section title="Behavioral Questions" icon="🤝">
            <div style={styles.questionsGrid}>
              {behavioralQuestions.map((q, i) => (
                <div key={i} style={styles.questionCard}>
                  <div style={styles.qIndex}>{i + 1}</div>
                  <div>
                    <p style={styles.question}>{q.question}</p>
                    <p style={styles.intention}>
                      <strong>Why asked: </strong>{q.intention}
                    </p>
                    <div style={styles.answerBox}>
                      <p style={styles.answerLabel}>Suggested Answer</p>
                      <p style={styles.answerText}>{q.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Skill Gaps ── */}
        {skillGaps.length > 0 && (
          <Section title="Skill Gaps" icon="⚠️">
            <div style={styles.skillGapsGrid}>
              {skillGaps.map((sg, i) => (
                <div key={i} style={styles.skillChip}>
                  <span style={styles.skillName}>{sg.skill}</span>
                  <SeverityBadge severity={sg.severity} />
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* ── Preparation Plan ── */}
        {preparationPlan.length > 0 && (
          <Section title="Preparation Plan" icon="🗓️">
            <div style={styles.planList}>
              {preparationPlan.map((p, i) => (
                <div key={i} style={styles.planDay}>
                  <div style={styles.planDayBadge}>Day {p.day}</div>
                  <div style={styles.planDayContent}>
                    <p style={styles.planFocus}>{p.focus}</p>
                    <ul style={styles.planTasks}>
                      {(p.tasks || []).map((t, j) => (
                        <li key={j} style={styles.planTask}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* CTA */}
        <div style={styles.ctaRow}>
          <button style={styles.ctaBtn} onClick={() => navigate('/interview')}>
            Generate a New Report
          </button>
        </div>
      </main>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Styles
───────────────────────────────────────────── */
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
    justifyContent: 'space-between',
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
  newReportBtn: {
    padding: '7px 16px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
    cursor: 'pointer',
  },
  main: {
    maxWidth: '780px',
    margin: '0 auto',
    padding: '48px 24px 80px',
  },

  /* Score card */
  scoreCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '32px 36px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    flexWrap: 'wrap',
    gap: '24px',
  },
  scoreLeft: {},
  scoreCardTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 8px',
    letterSpacing: '-0.4px',
  },
  scoreCardSub: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0,
    maxWidth: '420px',
    lineHeight: '1.6',
  },
  scoreCircle: (color) => ({
    width: '110px',
    height: '110px',
    borderRadius: '50%',
    border: `4px solid ${color}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    flexShrink: 0,
  }),
  scoreNumber: (color) => ({
    fontSize: '28px',
    fontWeight: '800',
    color: color,
    lineHeight: 1,
  }),
  scorePercent: (color) => ({
    fontSize: '11px',
    color: color,
    opacity: 0.7,
    fontWeight: '600',
  }),
  scoreLabel: {
    fontSize: '10px',
    color: '#6b7280',
    marginTop: '2px',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  /* Steps */
  stepsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '36px',
    gap: '8px',
  },
  stepDone: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  stepNumberDone: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#16a34a',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLabelDone: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#16a34a',
  },
  stepConnector: {
    height: '1px',
    width: '48px',
    backgroundColor: '#d1d5db',
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

  /* Section */
  section: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    padding: '28px 32px',
    marginBottom: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  sectionTitle: {
    fontSize: '17px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    letterSpacing: '-0.2px',
  },
  sectionIcon: {
    fontSize: '18px',
  },

  /* Submitted details */
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  detailLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0 0 6px',
  },
  detailValue: {
    fontSize: '14px',
    color: '#374151',
    lineHeight: '1.7',
    margin: 0,
    whiteSpace: 'pre-wrap',
  },

  /* Questions */
  questionsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  questionCard: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  qIndex: {
    flexShrink: 0,
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    backgroundColor: '#ede9fe',
    color: '#4f46e5',
    fontSize: '13px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '2px',
  },
  question: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 6px',
    lineHeight: '1.5',
  },
  intention: {
    fontSize: '13px',
    color: '#6b7280',
    margin: '0 0 12px',
    lineHeight: '1.5',
  },
  answerBox: {
    backgroundColor: '#f8f9fb',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '12px 14px',
  },
  answerLabel: {
    fontSize: '11px',
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    margin: '0 0 6px',
  },
  answerText: {
    fontSize: '14px',
    color: '#374151',
    margin: 0,
    lineHeight: '1.7',
  },

  /* Skill gaps */
  skillGapsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  skillChip: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#f3f4f6',
    borderRadius: '8px',
    padding: '8px 14px',
    border: '1px solid #e5e7eb',
  },
  skillName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#111827',
  },

  /* Preparation plan */
  planList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  planDay: {
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  planDayBadge: {
    flexShrink: 0,
    backgroundColor: '#ede9fe',
    color: '#4f46e5',
    fontSize: '12px',
    fontWeight: '700',
    borderRadius: '6px',
    padding: '4px 10px',
    whiteSpace: 'nowrap',
    marginTop: '2px',
  },
  planDayContent: {
    flex: 1,
  },
  planFocus: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#111827',
    margin: '0 0 8px',
  },
  planTasks: {
    margin: 0,
    paddingLeft: '18px',
  },
  planTask: {
    fontSize: '13px',
    color: '#374151',
    lineHeight: '1.7',
  },

  /* CTA */
  ctaRow: {
    textAlign: 'center',
    marginTop: '12px',
  },
  ctaBtn: {
    padding: '12px 28px',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  /* Empty / error state */
  emptyPage: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fb',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
  },
  emptyCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '48px 40px',
    textAlign: 'center',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  backBtn: {
    padding: '10px 20px',
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default InterviewReport;
