import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Inicio.scss';
import ContextSocket from '../../context/context-socketio';
import { useNavigate } from 'react-router-dom';
import api from '../Api/api';
import Popup from 'reactjs-popup';
import HowToPlay from '../HowPlay/HowPlay';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



// Simple Login

function Inicio() {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username);
  };

  const Socket = useContext(ContextSocket);

  function sendMessage() {
    Socket.emit('message', username);
    Socket.emit('registro', String(username));
  };

  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  return (

    <div>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card cardinicio text-white">
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Memory Game</h2>
                  <p className="text-white-50 mb-5">Please enter a nickname</p>
                  <form onSubmit={handleSubmit}>
                    <div className='form-outline form-white mb-4'>
                      <input type='text' id='nickname' name='nickname' className='form-control form-control-lg' maxLength='12' onChange={(e) => setUsername(e.target.value)}></input>
                      <label className='form-label' htmlFor='nickname'>Nickname</label>
                    </div>
                    <div className='distbutton'>
                      <button type='submit' className='btn btn-outline-light btn-lg px-5' onClick={() => { navigate('/rooms', { state: { username: username } }); sendMessage(username) }}>Start</button>
                    </div>
                  </form>
                  <div>

                    <button type='submit' className='btn btn-outline-light btn-lg px-5' onClick={handleShow} >How to play?</button>
                    <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>How to play</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>Bienvenido al juego de memoria, las intrucciones son simples, cada jugador tiene su respectivo turno, y durante ese turno puedes levantar dos cartas, si haces una pareja obtienes puntos, el ganador sera quien tenga mas puntos.</Modal.Body>
                      <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                          Close
                        </Button>

                      </Modal.Footer>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >

  );
}

export default Inicio;