import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Lobby.scss';
import ContextSocket from '../../context/context-socketio';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../Api/api';

// Simple Login

function Inicio() {
  const [username, setUsername] = useState('');
  const [nameRoom, setNameRoom] = useState('');
  const [password, setPassword] = useState('');
  const [players, setPlayers] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username);
  };

  const { state } = useLocation();

  useEffect(() => {
    setUsername(state.username);
    setNameRoom(state.nameRoom);
    setPassword(state.password);
    // setPlayers(players => [...players, username]);
    // setPlayers(['Chris', 'Jorge', 'Juan', 'Pedro']);
    Socket.emit('getUsers', 'getUsers');
    Socket.on('userslist', (data) => {
        console.log(data);
        setPlayers(data);
        });
  }, []);
  console.log(username);

  const Socket = useContext(ContextSocket);

  function sendMessage() {
    Socket.emit('message', username);
  };
  const navigate = useNavigate();

  return (

    <div>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className="card cardinicio text-white">
              <div className="card-body p-5 text-center">
                <div className="mb-md-5 mt-md-4 pb-5">
                  <h2 className="fw-bold mb-2 text-uppercase">Lobby-{nameRoom}</h2>
                  <p className="text-white-50 mb-5">Password to enter this room:{password}</p>
                  <div className='nameCardBack'>
                  {players.map((player, key) => {
                                    return (
                                        <div className='nameCard'>{player}</div>
                                    )
                    })}
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className='distbutton'>
                      <button type='submit' className='btn btn-outline-light btn-lg px-5' onClick={() => { navigate('/memory', {state:{username: username}}); sendMessage(username) }}>Start Game</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default Inicio;