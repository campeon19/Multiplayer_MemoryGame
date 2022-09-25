import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Inicio from './components/Inicio/Inicio';
import Rooms from './components/Rooms/Rooms';
import Memory from './components/Memory/memory';
import reportWebVitals from './reportWebVitals';
import 'bootstrap';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Memory />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
