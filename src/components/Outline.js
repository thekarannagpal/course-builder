import React from 'react';
import { FiFolder } from 'react-icons/fi';

const Outline = ({ modules, activeModule, onModuleClick }) => {
  return (
    <div className="outline">
      <h3>Course Outline</h3>
      <div className="outline-list">
        {modules.map(module => (
          <div
            key={module.id}
            className={`outline-item ${activeModule === module.id ? 'active' : ''}`}
            onClick={() => onModuleClick(module.id)}
          >
            <FiFolder className="outline-icon" />
            <span>{module.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Outline;
