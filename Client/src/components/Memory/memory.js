import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './memory.scss';
import Card from './card';
import ContextSocket from '../../context/context-socketio';

// import ChatPopUp from '../Chat/ChatPopUp';

const cardImages = [
    { "src": "/img/burro.svg", matched: false },
    { "src": "/img/caballo.svg", matched: false },
    { "src": "/img/lion.svg", matched: false },
    { "src": "/img/lobo.svg", matched: false },
    { "src": "/img/osos.svg", matched: false },
    { "src": "/img/penguin.svg", matched: false },
    { "src": "/img/serpiente.svg", matched: false },
    { "src": "/img/tortuga.svg", matched: false },
    { "src": "/img/ardilla.svg", matched: false },
    { "src": "/img/huella.svg", matched: false },
    { "src": "/img/aguila.svg", matched: false },
    { "src": "/img/dog.svg", matched: false },
    { "src": "/img/rana.svg", matched: false },
    { "src": "/img/vaca.svg", matched: false },
    { "src": "/img/gallina.svg", matched: false },
    { "src": "/img/obeja.svg", matched: false }
];






function Memory() {

    const Socket = useContext(ContextSocket);


    // useEffect(() => {
    //     Socket.on("data", (data) => {
    //         setMessages([...messages, data.data]);
    //     });
    //     return () => {
    //         Socket.off("data", () => {
    //             console.log("data event was removed");
    //         });
    //     };
    // }, [Socket, messages])




    const [cards, setCards] = useState([]);
    const [players, setPlayers] = useState([]);
    const [choice1, setChoice1] = useState(null);
    const [choice2, setChoice2] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [turn, setTurn] = useState(0);
    const [playerturn, setPlayerTurn] = useState(true);
    const ply = [
        { 'name': 'd()', 'score': 0 },
        { 'name': 'Player 2', 'score': 0 },
    ];



    const shuffleCards = () => {
        const shuffleCards = [...cardImages, ...cardImages]
            .sort(() => Math.random() - 0.5)
            .map((card) => ({ ...card, id: Math.random() }));

        setChoice1(null);
        setChoice2(null);
        setCards(shuffleCards);
        setPlayers(ply);
    };

    const handleChoice = (card) => {
        choice1 ? setChoice2(card) : setChoice1(card);
    };

    useEffect(() => {
        if (choice1 && choice2) {
            setDisabled(true);
            if (choice1.src === choice2.src) {
                setCards(prevCards => {
                    return prevCards.map(card => {
                        if (card.src === choice1.src) {
                            return { ...card, matched: true };
                        } else {
                            return card;
                        }
                    });
                });
                setPlayers(prevPlayers => {
                    return prevPlayers.map(player => {
                        if (player.name === 'Player 1') {
                            return { ...player, score: player.score + 1 };
                        } else {
                            return player;
                        }
                    });
                });
            } else {
                console.log('no match');
            }
            setTimeout(() => resetTurn(), 1000);
        }
    }, [choice1, choice2]);

    console.log(players);

    const resetTurn = () => {
        setChoice1(null);
        setChoice2(null);
        setDisabled(false);
        setTurn(turn + 1);
    };

    useEffect(() => {
        shuffleCards();
    }, []);

    return (
        <div>
            <div className='container-xxl'>
                <div className='row gx-5'>
                    <div className='col-2 info-player'>
                        <h4>Info Jugadores</h4>
                        <div>

                            <table>
                                <tr>
                                    <th>Name</th>
                                    <th>Score</th>
                                </tr>
                                {players.map((player, key) => {
                                    return (
                                        <tr key={key}>
                                            <td>{player.name}</td>
                                            <td>{player.score}</td>
                                        </tr>
                                    )
                                })}
                            </table>
                        </div>
                        <div className='esp'>
                            <h5>Turns: {turn}</h5>
                        </div>
                    </div>
                    <div className='col-8'>
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
                    <div className='col-2 info-chat'>
                        <h4>Chat</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Memory;