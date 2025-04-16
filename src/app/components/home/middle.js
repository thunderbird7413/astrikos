import React from 'react';
import './middle.css';

function Middle() {
  return (
    <section
      className="middle-section"
      style={{ backgroundImage: `url('/images/BG4.webp')` }}
    >
      <div className="middle-content">
        <h2>Unlimited Possibility, Unlimited Collaboration</h2>
        <ul className="middle-features">
          <li>
            <span className="feature-icon"></span> Instant Feedback
          </li>
          <li>
            <span className="feature-icon"></span> Efficient Workflows
          </li>
          <li>
            <span className="feature-icon"></span> Global Accessibility
          </li>
          <li>
            <span className="feature-icon"></span> Enhanced Creativity
          </li>
          <li>
            <span className="feature-icon"></span> Simultaneous Editing
          </li>
          <li>
            <span className="feature-icon"></span> Seamless Communication
          </li>
        </ul>
      </div>
      <div className="middle-image-container">
        <div className="middle-globe"></div>
      </div>
    </section>
  );
}

export default Middle;
