import React from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { user, handleLogout } = useAuth();

  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <div className="landing-logo-area">
          <div className="landing-logo-icon">✦</div>
          <span className="landing-logo-text">InterviewAI</span>
        </div>
        <div className="landing-header-right">
          {user && (
            <span className="landing-user-badge">
              {user.username || user.email}
            </span>
          )}
          <button
            type="button"
            className="landing-logout-btn"
            onClick={handleLogout}
          >
            Sign out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-main">
        <div className="landing-badge">
          <span className="landing-badge-icon">✦</span>
          AI-Powered Interview Preparation
        </div>

        <h1 className="landing-title">
          Ace Your Next Interview with <span className="landing-title-highlight">InterviewAI</span>
        </h1>

        <p className="landing-subtitle">
          Upload your resume, match with job descriptions, uncover skill gaps, and get personalized interview questions and preparation plans in seconds.
        </p>

        <div className="landing-cta-container">
          <button
            type="button"
            className="landing-cta-btn"
            onClick={() => navigate('/interview')}
          >
            <span>Generate Interview Report</span>
            <span>→</span>
          </button>
          <p className="landing-cta-subtext">
            Takes less than a minute • Instant analysis & roadmaps
          </p>
        </div>

        {/* Feature Cards */}
        <div className="landing-features-grid">
          <div className="landing-feature-card">
            <span className="landing-feature-icon">🎯</span>
            <h3 className="landing-feature-title">Resume & Job Matching</h3>
            <p className="landing-feature-desc">
              Get an accurate match score and identify critical skill gaps tailored to your target job role.
            </p>
          </div>

          <div className="landing-feature-card">
            <span className="landing-feature-icon">💡</span>
            <h3 className="landing-feature-title">Tailored Questions</h3>
            <p className="landing-feature-desc">
              Practice real technical and behavioral interview questions with recruiter intentions and model answers.
            </p>
          </div>

          <div className="landing-feature-card">
            <span className="landing-feature-icon">🗺️</span>
            <h3 className="landing-feature-title">Day-by-Day Roadmap</h3>
            <p className="landing-feature-desc">
              Follow a structured, actionable preparation plan to bridge your skill gaps and ace your interview.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
