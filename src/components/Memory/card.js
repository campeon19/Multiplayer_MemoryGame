import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './card.scss';


function Card({ card, handleChoice, flipped }) {

  const handleClick = () => {
    handleChoice(card);
  };


  return (
    <div className='carta'>
        <div className={flipped ? "flipped" : ""}>
            <img className='front' src={card.src} alt='card front' />
            <img className='back' src='/img/back.jpg' onClick={handleClick} alt='card back' />
        </div>
    </div>
  );
}

export default Card;