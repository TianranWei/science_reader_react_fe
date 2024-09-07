import axios from "axios";
import { useStateContext } from "../context/ContextProvider";
import { useState } from "react";
import { IoMdSend } from "react-icons/io";
import { useRef } from "react";
import { useEffect } from "react";

const ComprehensionTab = () => {
  const { fileUrl } = useStateContext();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const { comperhensionHistory, setComperhensionHistory } = useStateContext();
  const [sendQuery, setSendQuery] = useState("");
  const [processing, setProcessing] = useState(false);
  const { file } = useStateContext();
  const [scroll, setScroll]=useState(false)
  const chatEndRef=useRef()
     
  const defaultQuers = {
    'Generate easy comprehension question':"Generate easy comprehension multiple-choice questions that assess basic understanding of key concepts and details from the document. Each question should have one correct answer and three plausible distractors.",
    "Generate hard comprehension question":"Generate challenging comprehension multiple-choice questions that evaluate in-depth understanding and critical thinking based on the document. Each question should include one correct answer and three distractors that are closely related but incorrect.",

  };
  const handleQuerySubmit = async () => {
    setSendQuery(query);
    try {
      setProcessing(true);
      const result = await axios.post('http://127.0.0.1:8000/api/query', { query });
      setResponse(result.data.answer);
      const QA = {
        question: query,
        answer: result.data.answer
      };
      setComperhensionHistory(prevChatHistory => [...prevChatHistory, QA]);
      setSendQuery("");
      setQuery("");
      setProcessing(false);
    } catch (error) {
      console.error('Error querying document:', error);
      alert('Query failed');
    }
  };

  const handleQuerySubmitButton = async (defaultQuery) => {
    setSendQuery(defaultQuery);
    try {
      setProcessing(true);
      const result = await axios.post('http://127.0.0.1:8000/api/query', { query: defaultQuery });
      setResponse(result.data.answer);

      const QA = {
        question: defaultQuery,
        answer: result.data.answer
      };
      setComperhensionHistory(prevChatHistory => [...prevChatHistory, QA]);
      setSendQuery("");
      setQuery("");
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
      console.error('Error querying document:', error);
      setProcessing(false);
      alert('Query failed');
    }
  };

  const handleButtonQuery = (defaultQuery) => {
    setQuery(defaultQuery);
    handleQuerySubmitButton(defaultQuery);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comperhensionHistory,processing]);

  return (
    <div className='flex flex-col flex-auto overflow-auto w-full'>
      <div className='flex flex-col flex-1 p-2 overflow-hidden'>
        <div className="flex-1 overflow-auto mb-1 p-2 rounded bg-slate-800">
          {comperhensionHistory.length > 0 ? (
            <div>
              {comperhensionHistory.map((chat, idex) => (
                <div className='flex flex-col gap-2' key={idex}>
                  <div className='flex justify-end'>
                    <p className='p-2 text-start text-sm text-white rounded bg-slate-700 '>{chat.question}</p>
                  </div>
                  <div className='flex justify-start'>
                    <p className='p-2 text-start text-sm text-slate-50 rounded' style={{ whiteSpace: 'pre-wrap' }}>{chat.answer}</p>
                  </div>
                </div>
              ))}
              {sendQuery && (
                <div className='flex justify-end'>
                  <p className='p-2 text-start text-sm text-white rounded bg-slate-700 '>{query}</p>
                </div>
              )}
              {processing && (
                <div className="ml-6 flex gap-2 border-1 rounded-lg pb-4 mt-2">
                <div>
                  <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                    </span>
                  </div>

                  <div className="font-serif text-lg text-slate-700">Generating...</div>
                </div>
              )}
              <div ref={chatEndRef}></div>
             </div>
          ) : 
          <div>
            {sendQuery && (
              <div className='flex justify-end'>
                <p className='p-2 text-start text-sm text-slate-50 rounded bg-slate-600'>{query}</p>
              </div>
            )}
            {processing && (
                <div className="ml-6 flex gap-2 border-1 rounded-lg pb-4 mt-2">
                <div>
                  <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
                    </span>
                  </div>

                  <div className="font-serif text-lg text-slate-700">Generating...</div>
                </div>
              )}
          </div>}
        </div>
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex gap-2">
            <button className="w-1/2 border border-slate-50 font-poppins text-slate-50 
            rounded p-1 shadow-sm  hover:bg-gray-800"
            onClick={() => handleButtonQuery(Object.values(defaultQuers)[0])}> 
               {Object.keys(defaultQuers)[0]}
            </button>
            <button className="w-1/2 border border-slate-50 font-poppins text-slate-50 
            rounded p-1 shadow-sm hover:bg-slate-800"
            onClick={() =>  handleButtonQuery(Object.values(defaultQuers)[1])}
            > 
            {Object.keys(defaultQuers)[1]}
            </button>
          </div>

          <div className="flex">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask comprehension question"
              className="border rounded p-2 text-black font-semibold w-full"
              rows={1} // Adjust the number of rows as needed
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleQuerySubmit();
                }
              }}
            />
            <button
              onClick={handleQuerySubmit}
              type="submit"
              className="rounded border-slate-200 bg-slate-600 mx-2 p-2 font-serif text-slate-300 hover:bg-slate-200 text-2xl hover:text-slate-800"
              disabled={processing}
            >
              <IoMdSend />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComprehensionTab;




