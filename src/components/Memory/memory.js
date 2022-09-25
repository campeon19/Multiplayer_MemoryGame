import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './memory.scss';
import Card from './card';

const cardImages = [
    {"src": "/img/burro.svg", matched: false },
    {"src": "/img/caballo.svg", matched: false },
    {"src": "/img/lion.svg", matched: false },
    {"src": "/img/lobo.svg", matched: false },
    {"src": "/img/osos.svg", matched: false },
    {"src": "/img/penguin.svg", matched: false },
    {"src": "/img/serpiente.svg", matched: false },
    {"src": "/img/tortuga.svg", matched: false },
    {"src": "/img/ardilla.svg", matched: false }
];


function Memory() {
  const [cards, setCards] = useState([]);
  const [players, setPlayers] = useState([]);
  const [choice1, setChoice1] = useState(null);
  const [choice2, setChoice2] = useState(null);
  const [disabled, setDisabled] = useState(false);


  const shuffleCards = () => {
    const shuffleCards = [...cardImages, ...cardImages]
     .sort(() => Math.random() - 0.5)
     .map((card) => ({ ...card, id: Math.random() }));

    setChoice1(null);
    setChoice2(null);
    setCards(shuffleCards);
    };

    const handleChoice = (card) => {
        choice1 ? setChoice2(card) : setChoice1(card);
    };

    useEffect(() => {      
        if(choice1 && choice2) {
            setDisabled(true);
            if(choice1.src === choice2.src) {
                setCards(prevCards => {
                    return prevCards.map(card => {
                        if(card.src === choice1.src) {
                            return {...card, matched: true};
                        } else {
                            return card;
                        }
                    });
                });
            } else {
                console.log('no match');
            }
            setTimeout(() => resetTurn(), 1000);
        }
    }, [choice1, choice2]);

    const resetTurn = () => {
        setChoice1(null);
        setChoice2(null);
        setDisabled(false);
    };

    useEffect(() => {
        shuffleCards();
    }, []);

  return (
    <div>
        <div className='memory'>
            <h1>Memory Game</h1>
            <div className='card-grid'>
                {cards.map(card => (
                    <Card 
                        key={card.id} 
                        card={card} 
                        handleChoice={handleChoice} 
                        flipped={card === choice1 || card === choice2 || card.matched} 
                        disabled={disabled}
                    />
                ))}
            </div>
            
        </div>
    </div>
  );
}

export default Memory;