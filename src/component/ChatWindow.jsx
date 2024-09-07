
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { useStateContext } from '../context/ContextProvider';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowForward, IoIosArrowBack, IoIosAddCircleOutline, IoMdRemoveCircleOutline } from "react-icons/io";

import ChatTab from './ChatTab';
import SummaryTab from './SummaryTab';
import ComprehensionTab from './ComprehensionTab';
import { Navigate } from 'react-router-dom';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const ChatWindow = () => {
  const { fileUrl } = useStateContext();
  const navigate=useNavigate()
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0); 
  const { file, setFile } = useStateContext();
  const [tab, setTab] = useState(1)
  const { summaryFetched, setSummaryFetched } = useStateContext();

  const {chatHistory, setChatHistory}=useStateContext()
  const {comperhensionHistory, setComperhensionHistory}=useStateContext()
  const {response, setResponse}= useStateContext()
  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, numPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleZoomIn = () => {
    setScale(prevScale => prevScale + 0.1);
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(prevScale - 0.1, 0.2));
  };

  const backHome=()=>{
    setFile("")
    setChatHistory([])
    setComperhensionHistory([])
    setResponse()
  }

  const handleSummaryClick = () => {
    setTab(1);
    if (!summaryFetched) {
      setSummaryFetched(true);
    }
  };

  return (
    <div className="h-full rounded shadow-sm flex bg-slate-700 gap-4 p-2">
      <div className='flex flex-col items-center w-full md:w-1/2'>
        <div className='flex justify-between w-full items-center'>
          <button className='shadow-sm rounded p-1 border border-slate-900
           hover:bg-slate-800 text-white font-poppins font-semibold text-sm
           '
           onClick={backHome}
           >Back</button>
          <div className="text-slate-400 text-xl font-poppins font-semibold w-4/5 text-center">
            Paper View
          </div>
          <div className="text-slate-400 text-xl font-sans w-1/5 text-right">
            <button
              onClick={handleZoomOut}
              className="rounded border-slate-400 mx-1 font-serif hover:bg-slate-600"
            >
              <IoMdRemoveCircleOutline />
            </button>
            <button
              onClick={handleZoomIn}
              className="rounded border-slate-400 mx-1 font-serif hover:bg-slate-600"
            >
              <IoIosAddCircleOutline />
            </button>
          </div>
        </div>
        <div className='overflow-auto w-full'>
          <Document
            file={fileUrl}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            className="p-1 rounded m-1 overflow-hidden flex justify-center flex-auto"
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
            />
          
          </Document>
        </div>
        <div className='flex justify-center w-full my-2 items-center'>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage <= 1}
            className="rounded mx-1 p-1 text-slate-400 font-serif hover:bg-slate-600"
          >
            <IoIosArrowBack />
          </button>
          <span className="text-lg text-center text-slate-400 font-serif font-bold">{`${currentPage} / ${numPages}`}</span>
          <button
            onClick={handleNextPage}
            disabled={currentPage >= numPages}
            className="rounded mx-1 p-1 text-slate-400 font-serif hover:bg-slate-600"
          >
            <IoIosArrowForward />
          </button>
        </div>
      </div>
      <div className=" flex flex-col h-full w-full md:w-1/2">
        <div className='flex justify-around items-center'>
          <button
            onClick={handleSummaryClick}
            className={`shadow-sm rounded p-2  bg-slate-600 font-poppins font-semibold border-slate-50 text-white ${tab === 1 ? 'bg-slate-700 cursor-default' : 'bg-slate-600 hover:bg-slate-800 cursor-pointer '}`}
          >
            Summary
          </button>
          <button
            onClick={() => setTab(2)}
            className={`shadow-sm rounded p-2  font-poppins font-semibold border-slate-50 text-white mx-1 ${tab === 2 ? 'bg-slate-700 cursor-default' : 'bg-slate-600 hover:bg-slate-800 cursor-pointer'}`}
          >
            Ask ChatBot
          </button>
          <button
            onClick={() => setTab(3)}
            className={`shadow-sm rounded p-2  font-poppins font-semibold border-slate-50 text-white  mx-1 ${tab === 3 ? 'bg-slate-700 cursor-default' : 'bg-slate-600 hover:bg-slate-800 cursor-pointer' } `}
          >
            Comprehension Tests
          </button>
        </div>
          {tab === 1 && <SummaryTab />}
          {tab === 2 && <ChatTab />}
          {tab === 3 && <ComprehensionTab />}
      </div>
    </div>
  );
};

export default ChatWindow;
