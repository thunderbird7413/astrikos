import React from 'react';
import './Middle.css';

function Middle() {
  return (
    
    <div className="middle ">
     
     <div>
      <div className='h-[50%]'></div>
      <h2 className="title">Visualize Smarter, <br />Collaborate Better</h2>
      <ul className="features">
        <li className="feature">
          <span className="plus-icon">+</span>  Real-Time 3D & 2D Editing
        </li>
        <li className="feature">
          <span className="plus-icon">+</span> Collaborative Map Visualization
        </li>
        <li className="feature">
          <span className="plus-icon">+</span> Smooth File Imports (GLTF, GeoJSON & more)
        </li>
        <li className="feature">
          <span className="plus-icon">+</span> Instant Previews & Feedback

        </li>
        <li className="feature">
          <span className="plus-icon">+</span> Cross-Team Collaboration

        </li>
        <li className="feature">
          <span className="plus-icon">+</span> Zero Setup, Fully Web-Based
        </li>
      </ul>
      </div>
    </div>
  );
}

export default Middle;