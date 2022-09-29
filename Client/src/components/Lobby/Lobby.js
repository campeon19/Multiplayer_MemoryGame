import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Lobby.scss';
import ContextSocket from '../../context/context-socketio';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../Api/api';
import seedrandom from 'seedrandom';

// Simple Login

function Inicio() {
  const [username, setUsername] = useState('');
  const [nameRoom, setNameRoom] = useState('');
  const [password, setPassword] = useState('');
  const [players, setPlayers] = useState([]);
  const [roomSize, setRoomSize] = useState('');
  const [anfitrion, setAnfitrion] = useState('');
  const [start, setStart] = useState(false);

  const Socket = useContext(ContextSocket);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username);
  };

  const { state } = useLocation();

  useEffect(() => {
    setUsername(state.username);
    setNameRoom(state.nameRoom);
    setPassword(state.password);
    setPlayers([state.username]);
    // setPlayers(players => [...players, username]);
    // setPlayers(['Chris', 'Jorge', 'Juan', 'Pedro']);
    // Socket.emit('getUsers', 'getUsers');
    // Socket.on('userslist', (data) => {
    //     console.log(data + 'userslist');
    //     // setPlayers(data);
    //     });
    Socket.emit('getLobbyInfo', state.nameRoom);
    Socket.on('lobbyInfo', (data) => {
      console.log(data + 'lobbyInfo');
      //   if(data.length > 1){
      //     setPlayers([data]);
      //   } else{
      //     setPlayers(data);
      //   }
      setPlayers(data['players']);
      setRoomSize(data['roomSize']);
      setAnfitrion(data['anfitrion']);
    });
  }, []);

  useEffect(() => {
    if (start) {
        navigate('/memory', { state: { username: username, lobbyName: nameRoom, anfitrion: anfitrion, playersOrder: players } });
    }
  }, [start]);


  setInterval(() => {
    Socket.on('updateLobby', (data) => {
      console.log(data);
      console.log(players)
      if (data != players) {
        setPlayers(data['players']);
      }
    });
    Socket.on('startGameTrue', (data) => {
      console.log(data);
      if (data['start'] != start) {
        setStart(data['start']);
      }
    });

  }, 2000);

  const navigate = useNavigate();

  const handleStart = () => {
    console.log('start');
    Socket.emit('startGame', {'nameRoom': nameRoom});
    navigate('/memory', { state: { username: username, lobbyName: nameRoom, anfitrion: anfitrion, playersOrder: players } });
  };


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
                    {players?.map((player, key) => {
                      return (
                        <div className='nameCard'>{player}</div>
                      )
                    })}
                  </div>
                  <div>
                    <h5>{players.length}/{roomSize}</h5>
                  </div>
                  <form onSubmit={handleSubmit}>
                    {
                      players.length === parseInt(roomSize) && anfitrion === username &&
                      <div className='distbutton'>
                        <button type='submit' className='btn btn-outline-light btn-lg px-5' onClick={handleStart}>Start Game</button>
                      </div>
                    }
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