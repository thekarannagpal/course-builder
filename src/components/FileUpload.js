import React, { useRef } from 'react';
import { FiUpload } from 'react-icons/fi';

const FileUpload = ({ onFileUpload }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files);
    }
    // Reset input
    e.target.value = '';
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      onFileUpload(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="file-upload-container">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx,.txt,.mp4,.mp3"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />
      <button 
        onClick={handleClick} 
        className="upload-btn"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <FiUpload /> Upload
      </button>
    </div>
  );
};

export default FileUpload;
