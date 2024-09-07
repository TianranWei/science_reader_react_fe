import React, { useState } from 'react';
import axios from 'axios';
import { useStateContext } from '../context/ContextProvider';
import { useNavigate } from 'react-router-dom';

const UploadAndViewPDF = () => {
  const { setFileUrl, setFile, fileUrl, file } = useStateContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://127.0.0.1:8000/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const url = URL.createObjectURL(file);
        setFileUrl(url);
        setFile(file);
      } catch (error) {
        alert('File upload failed');
      }
    }
  };

  const handleButtonClick = () => {
    document.getElementById('fileInput').click();
  };

  return (
    <div className="flex flex-col items-center justify-center mx-80 p-10">
      <h1 className="text-2xl font-bold mb-4">Manage your Cognitive Workload!</h1>
      <h3 className="text-2xl font-bold mb-4 text-center">
        Upload a paper and get a clear, concise explanation, ask questions, and test your comprehension by interacting with Science Reader!
      </h3>
      <div className="mb-4">
        <input
          id="fileInput"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button
          className="rounded bg-black font-semibold text-white m-2 p-2 font-poppins hover:bg-slate-700"
          onClick={handleButtonClick}
        >
          Upload Paper
        </button>
      </div>
    </div>
  );
};

export default UploadAndViewPDF;
