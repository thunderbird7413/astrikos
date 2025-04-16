import React from 'react'
import './card.css'

const Card = ({id,title,description,icon,onClick}) => {
    return (
        <div className="card-card" onClick={() => onClick(id)}>
          <div className="icon-container">
            <img src={icon} alt={title} className="card-icon" />
          </div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      );
}

export default Card