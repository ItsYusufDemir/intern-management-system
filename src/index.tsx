import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import {AuthProvider} from "./utils/AuthProvider";


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  
  <BrowserRouter basename='/ims'>
    <AuthProvider >
      <App />
    </AuthProvider>
  </BrowserRouter>
  
);
