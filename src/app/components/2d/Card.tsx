// components/Card.tsx
import React, { FC, ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

const Card: FC<CardProps> = ({ children, onClick, className }) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 border-2 rounded-lg shadow-md transition transform hover:scale-105 cursor-pointer 
      ${className ? className : 'border-gray-300 bg-white'}`}
    >
      {children}
    </div>
  );
};

export default Card;
