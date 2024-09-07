import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import { useStateContext } from './context/ContextProvider';
import ChatWindow from './component/ChatWindow';
import Chat from './Chat';

const App = () => {
  const { file, setFile } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    setFile("");
  }, []);

  useEffect(() => {
    if (!file) {
      navigate('/uploadFile');
    } else {
      navigate('/preview');
    }
  }, [file, navigate]);

  return (
    <div className="h-screen w-full">
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/uploadFile" element={<Chat />} />
        <Route path="/preview" element={<ChatWindow />} />
      </Routes>
    </div>
  );
};
export default App;
