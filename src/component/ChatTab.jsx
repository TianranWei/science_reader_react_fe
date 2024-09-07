
import axios from "axios";
import { useStateContext } from "../context/ContextProvider";
import { useState, useEffect, useRef } from "react";
import { IoMdSend } from "react-icons/io";
import { faL } from "@fortawesome/free-solid-svg-icons";

const ChatTab = () => {
  const { fileUrl } = useStateContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const { file } = useStateContext();
  const [sendQuery, setSendQuery] = useState("");
  const { chatHistory, setChatHistory } = useStateContext();
  const [processing, setProcessing] = useState(false);
  const chatEndRef = useRef(null);
  const [scroll, setScroll]=useState(false)
  const defaultQuers = {
    conclusion: "what is the conclusion ?",
    aim: "what is the aim of this research ?",
    author: "who is the author ?",
    overview: "please provide a brief overview ?"
  };

  const propmt="Provide a detailed and comprehensive response with in-depth information to fully address the query for this query."

  const handleQuerySubmit = async () => {
    setSendQuery(query);
    setScroll(true)
    try {
      setProcessing(true);
      const result = await axios.post('http://127.0.0.1:8000/api/query', { query });
      setResponse(result.data.answer);

      const QA = {
        question: query,
        answer: result.data.answer
      };
      setChatHistory(prevChatHistory => [...prevChatHistory, QA]);
      setSendQuery("");
      setQuery("");
      setScroll(false)
      setProcessing(false);
    } catch (error) {
      console.error('Error querying document:', error);
      alert('Query failed');
      setScroll(false)
      setProcessing(false);
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
      setChatHistory(prevChatHistory => [...prevChatHistory, QA]);
      setSendQuery("");
      setQuery("");
      setProcessing(false);
    } catch (error) {
      setProcessing(false);
      console.error('Error querying document:', error);
      alert('Query failed');
    }
  };

  const handleButtonQuery = (defaultQuery) => {
    setQuery(defaultQuery);
    handleQuerySubmitButton(defaultQuery);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory,processing]);

  return (
    <div className='flex flex-col flex-auto w-full overflow-auto'>
      <div className='flex flex-1 justify-between flex-col p-2 overflow-auto'>
        <div className="mb-1 p-4 rounded flex-1 bg-slate-800 overflow-auto pb-3">
          {chatHistory.length > 0 ?
            <div className='flex-1 flex-col'>
              {chatHistory.map((chat, index) => (
                <div className='flex flex-col gap-2 flex-1' key={index}>
                  <div className='flex justify-end'>
                    <p className='p-2 text-start text-sm text-white rounded bg-slate-700'>{chat.question}</p>
                  </div>
                  <div className='flex justify-start'>
                    <p className='p-2 text-start text-sm text-slate-50 rounded'>{chat.answer}</p>
                  </div>
                </div>
              ))}
              {sendQuery && (
                <div className='flex justify-end'>
                  <p className='p-2 text-start text-sm text-white rounded bg-slate-700'>{query}</p>
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

                  <div className="font-serif text-lg text-slate-700 ">Thinking...</div>
                </div>
              )}
              <div ref={chatEndRef}></div>
            </div> :
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

                  <div className="font-serif text-lg text-slate-700">Thinking...</div>
                </div>
              )}
            </div>
          }
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-4 mr-2">
            <div className="flex flex-col w-1/2 items-start justify-center">
              <button className="border-slate-50 border font-poppins w-full my-1 text-slate-50 rounded p-1 shadow-sm hover:bg-slate-800" onClick={() => handleButtonQuery(defaultQuers.conclusion)}>
                {defaultQuers.conclusion}
              </button>
              <button className="border-slate-50 border font-poppins w-full my-1 text-slate-50 rounded p-1 shadow-sm hover:bg-slate-800" onClick={() => handleButtonQuery(defaultQuers.aim)}>
                {defaultQuers.aim}
              </button>
            </div>

            <div className="flex flex-col w-1/2 items-start justify-center">
              <button className="border-slate-50 border w-full my-1 font-poppins text-slate-50 rounded p-1 shadow-sm hover:bg-slate-800" onClick={() => handleButtonQuery(defaultQuers.author)}>
                {defaultQuers.author}
              </button>
              <button className="border-slate-50 border font-poppins w-full my-1 text-slate-50 rounded p-1 shadow-sm hover:bg-slate-800" onClick={() => handleButtonQuery(defaultQuers.overview)}>
                {defaultQuers.overview}
              </button>
            </div>
          </div>

          <div className="flex">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question about the document"
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
  )
}

export default ChatTab;

