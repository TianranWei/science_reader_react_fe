import React from 'react'
import App from './App'
import './index.css'
import { BrowserRouter} from 'react-router-dom';
import { createRoot } from 'react-dom/client';

import { ContextProvider } from './context/ContextProvider';

const root=createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
  <ContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ContextProvider> 
  
</React.StrictMode>
)

