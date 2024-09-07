import React, { useEffect, useState } from 'react';
import { useStateContext } from '../context/ContextProvider';
import axios from 'axios';

const SummaryTab = () => {
  const { fileUrl, response, setResponse, file, summaryHistory, 
    setsummaryHistory, summaryFetched, setSummaryFetched } = useStateContext();
  const [processing, setProcessing] = useState(false);

  const handleQuerySubmit = async () => {

    const query = `You are an expert research assistant. I need you to summarize a research paper in a structured JSON format. Follow the structure exactly as specified below, 
                    and ensure the output is a valid JSON object which contain detail explanations elaboration .

                {
                  "Overview": "Provide a general overview of the paper, including its main objective and significance.",
                  "Problem": "Summarize the main problem or research question addressed in the paper.",
                  "Solution": "Describe the proposed solution or hypothesis presented by the authors.",
                  "Approach": "Explain the methodology and approach used in the paper to tackle the problem.",
                  "Architecture": "If applicable, outline any specific models, frameworks, or architectures used or proposed in the research.",
                  "Conclusion": "Summarize the key findings, implications, and any future work suggested by the authors."
                }

                Ensure that each key in the JSON is present, even if the value is 'null'. If 'null' is used, briefly explain the reason. The response must be directly in JSON format, without any additional text or code blocks.`;

    try {
      setResponse({});
      setProcessing(true);
      const result = await axios.post('http://127.0.0.1:8000/api/query', { query })
      const response=result.data.answer
      const cleanResponse = response.replace(/```json|```/g, '');
      const jsonResponse = JSON.parse(cleanResponse);
      setResponse(jsonResponse);
    } catch (error) {
      alert('Query failed');
      setProcessing(false);
      setResponse("");
      console.log("An error", error)
    } finally {
      setProcessing(false);
      setSummaryFetched(false);
    }
  };

  const renderValue = (value) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <div className='list-disc pl-5'> 
          <ul >
            {Object.entries(value).map(([subKey, subValue]) => (
              <li key={subKey}>
                <strong>{subKey}:</strong> {subValue}
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return value !== null ? value : 'There is no detailed information available.';
  };

  return (
    <div className='flex flex-col flex-auto w-full overflow-auto'>
      <div className='flex flex-col flex-1 p-2 overflow-auto'>
        <div className="flex-auto overflow-auto mb-1 p-2 rounded bg-slate-800">
          {processing ? (
            <div className="ml-6 flex gap-2 border-1 rounded-lg pb-4 mt-2">
              <div>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                </span>
              </div>
              <div className="font-serif text-lg text-slate-700">Summarizing...</div>
            </div>
          ) : (
            response && (
              <div className='p-2 text-start text-sm text-slate-50 rounded flex-auto overflow-auto'>
                {Object.entries(response).map(([key, value]) => (
                  <div key={key} className='p-1 text-sm'>
                    <strong>{key}:</strong>
                    <div className='p-1 text-start text-sm text-white rounded'>
                      {renderValue(value)}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
        <div className="flex justify-center items-center mb-2">
          <button
            className="w-1/2 border border-slate-50 font-poppins text-slate-50 
            rounded p-1 shadow-sm hover:bg-gray-800"
            onClick={handleQuerySubmit}
          >
            Summarize research
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryTab;
