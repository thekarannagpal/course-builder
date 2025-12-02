import React, { useRef, useEffect } from 'react';
import { FiFolder, FiUpload, FiLink } from 'react-icons/fi';

const AddDropdown = ({ onAddModule, onAddFile, onAddLink, onClose }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="add-dropdown" ref={dropdownRef}>
      <div className="dropdown-item" onClick={onAddModule}>
        <FiFolder className="dropdown-icon" />
        <span>Create module</span>
      </div>
      <div className="dropdown-item" onClick={onAddFile}>
        <FiUpload className="dropdown-icon" />
        <span>Upload</span>
      </div>
      <div className="dropdown-item" onClick={onAddLink}>
        <FiLink className="dropdown-icon" />
        <span>Create link</span>
      </div>
    </div>
  );
};

export default AddDropdown;
