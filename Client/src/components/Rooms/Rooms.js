import React, { useState, useContext, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Rooms.scss';
import ContextSocket from '../../context/context-socketio';
import { useNavigate, useLocation } from 'react-router-dom';

// Simple Create/Join Room

function Rooms() {
  const [username, setUsername] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [roomSize, setRoomSize] = useState('');
  const [enterRoom, setEnterRoom] = useState('');
  const [enterPassword, setEnterPassword] = useState('');

  const { state } = useLocation();

  useEffect(() => {
    setUsername(state.username);
    // receiveUsersData();
  }, []);
  console.log(username);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(newRoom);
    console.log(newPassword);
    console.log(roomSize);
  };
  const handleSubmitJoin = (e) => {
    e.preventDefault();
    console.log(enterRoom);
    console.log(enterPassword);
  };

  const Socket = useContext(ContextSocket);

  function sendRoomsData() {
    Socket.emit('createRoomInfo', { 'lobbyName': newRoom, 'password': newPassword, 'roomSize': roomSize, 'anfitrion' : username, 'players': [username], 'start': false });
  };

  function sendRoomsDataPublic() {
    Socket.emit('joinRoom', { 'lobbyName': enterRoom, 'password': enterPassword, 'username': username });
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
                  <h2 className="fw-bold mb-2 text-uppercase">Create Room</h2>
                  <form onSubmit={handleSubmit}>
                    <div className='form-outline form-white mb-4'>
                      <input type='text' id='lobbyname' name='lobbyname' className='form-control form-control-lg' onChange={(e) => setNewRoom(e.target.value)}></input>
                      <label className='form-label' htmlFor='lobbyname'>Lobby</label>
                    </div>
                    <div className='form-outline form-white mb-4'>
                      <input type='text' id='lobbypassword' name='lobbypassword' className='form-control form-control-lg' onChange={(e) => setNewPassword(e.target.value)}></input>
                      <label className='form-label' htmlFor='lobbypassword'>Password</label>
                    </div>
                    <div>
                      <h4>Lobby Size</h4>
                    </div>
                    <div className='distbutton'>
                      <div className='form-check form-check-inline'>
                        <input className='form-check-input' type="radio" name="flexRadioDefault" id="flexRadioDefault1" onChange={(e) => setRoomSize('2')} />
                        <label className='form-check-label' htmlFor='flexRadioDefault1'>2</label>
                      </div>
                      <div className='form-check form-check-inline'>
                        <input className='form-check-input' type="radio" name="flexRadioDefault" id="flexRadioDefault2" onChange={(e) => setRoomSize('3')} />
                        <label className='form-check-label' htmlFor='flexRadioDefault2'>3</label>
                      </div>
                      <div className='form-check form-check-inline'>
                        <input className='form-check-input' type="radio" name="flexRadioDefault" id="flexRadioDefault3" onChange={(e) => setRoomSize('4')} />
                        <label className='form-check-label' htmlFor='flexRadioDefault3'>4</label>
                      </div>
                    </div>
                    <div>
                      <button type='submit' className='btn btn-outline-light btn-lg px-5' onClick={() => { sendRoomsData(); navigate('/lobby', {state:{username: username, nameRoom: newRoom, password: newPassword}}) }}> Start</button>
                    </div>
                  </form>
                  <h4 className="mb-2 text-uppercase space">Or</h4>
                  <h2 className="fw-bold mb-2 text-uppercase space">Join Room</h2>
                  <form onSubmit={handleSubmitJoin}>
                    <div className='form-outline form-white mb-4'>
                      <input type='text' id='lobbyname' name='lobbyname' className='form-control form-control-lg' onChange={(e) => setEnterRoom(e.target.value)}></input>
                      <label className='form-label' htmlFor='lobbyname'>Lobby</label>
                    </div>
                    <div className='form-outline form-white mb-4'>
                      <input type='text' id='lobbypassword' name='lobbypassword' className='form-control form-control-lg' onChange={(e) => setEnterPassword(e.target.value)}></input>
                      <label className='form-label' htmlFor='lobbypassword'>Password</label>
                    </div>
                    <div>
                      <button type='submit' className='btn btn-outline-light btn-lg px-5' onClick={() => { sendRoomsDataPublic(); navigate('/lobby', {state:{username: username, nameRoom: enterRoom, password: enterPassword}}) }}>Join</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
    </div >
  );
}

export default Rooms;