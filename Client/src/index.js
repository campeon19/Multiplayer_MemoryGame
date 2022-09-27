import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Inicio from './components/Inicio/Inicio';
import Rooms from './components/Rooms/Rooms';
import Memory from './components/Memory/memory';
import 'bootstrap';
import { ContextSocketProvider } from './context/context-socketio';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(


  <ContextSocketProvider>
    <Inicio />
  </ContextSocketProvider >

);

