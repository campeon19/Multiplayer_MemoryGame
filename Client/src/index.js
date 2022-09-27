import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Inicio from './components/Inicio/Inicio';
import Rooms from './components/Rooms/Rooms';
import Memory from './components/Memory/memory';
import 'bootstrap';
import { ContextSocketProvider } from './context/context-socketio';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(


  <ContextSocketProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/memory" element={<Memory />} />

      </Routes>

    </BrowserRouter>

  </ContextSocketProvider >

);

