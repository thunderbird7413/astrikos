'use client'; // if you're using this in an app directory (Next.js 13+)

import React from 'react';
import Card from './card';
import './card.css'; // optional, but better to use modules in Next.js

const Content = [
  {
    id: 1,
    title: 'Create model',
    description: 'Create your model with our easy to use modeling tool.',
    icon: '/images/Create.jpg',
  },
  {
    id: 2,
    title: 'Visualize 3D model',
    description: 'Visualize your 3D model with our easy to use visualization tool.',
    icon: '/images/3D.png',
  },
  {
    id: 3,
    title: 'Visualize 2D model',
    description: 'Visualize your 2D model with our easy to use visualization tool.',
    icon: '/images/2D.jpg',
  },
  {
    id: 4,
    title: 'Visualize Map',
    description: 'Visualize your map with our easy to use visualization tool.',
    icon: '/images/Map.png',
  },
  {
    id: 5,
    title: 'Templates',
    description: 'With our templates you can easily finish your project in no time.',
    icon: '/images/Temp.jpg',
  },
];

const Frame = () => {
  const handleCardClick = (cardId) => {
    console.log(`Card with ID ${cardId} clicked!`);
  };

  return (
    <section className="card-section">
      <h2>Everything a 3D Software Needs</h2>
      <div className="card-grid">
        {Content.map((item) => (
          <Card
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            icon={item.icon}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </section>
  );
};

export default Frame;
