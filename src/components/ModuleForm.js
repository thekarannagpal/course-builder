import React, { useState, useRef, useEffect } from 'react';

const ModuleForm = ({ onSubmit, onCancel }) => {
  const [moduleName, setModuleName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (moduleName.trim()) {
      onSubmit(moduleName.trim());
      setModuleName('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Create Module</h3>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter module name"
            value={moduleName}
            onChange={(e) => setModuleName(e.target.value)}
            onKeyDown={handleKeyPress}
            className="form-input"
            required
          />
          <div className="form-actions">
            <button type="submit" className="form-btn primary">
              Create Module
            </button>
            <button 
              type="button" 
              onClick={onCancel} 
              className="form-btn secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModuleForm;
