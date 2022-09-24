import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Inicio.scss';

// Simple Login

function Inicio() {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username);
  };

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
                            <input type='text' id='nickname' name='nickname' className='form-control form-control-lg' onChange={(e) => setUsername(e.target.value)}></input>
                            <label className='form-label' htmlFor='nickname'>Nickname</label>
                          </div>
                          <div className='distbutton'>
                            <button type='submit' className='btn btn-outline-light btn-lg px-5'>Start</button>
                          </div>
                        </form>
                        <div>
                          <button type='submit' className='btn btn-outline-light btn-lg px-5'>How to play?</button>
                        </div>
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