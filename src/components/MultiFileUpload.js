// MultiFileUpload.js
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

function MultiFileUpload() {
  const { setSelectedFiles } = useContext(AppContext);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(files);
  };

  return (
    <div>
      <input type="file" multiple accept=".pdf,.jpg,.png" onChange={handleFileChange} />
    </div>
  );
}

export default MultiFileUpload;
