import React, { useState, useEffect, useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './memory.scss';
import Card from './card';
import ContextSocket from '../../context/context-socketio';
import { useLocation } from 'react-router-dom';

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


    const [cards, setCards] = useState([]);
    const [players, setPlayers] = useState([]);
    const [choice1, setChoice1] = useState(null);
    const [choice2, setChoice2] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [turn, setTurn] = useState(0);
    const [playerturn, setPlayerTurn] = useState('');
    const [username, setUsername] = useState('');
    const [LobbyName, setLobbyName] = useState('');
    const [anfitrion, setAnfitrion] = useState('');
    const [lobbyInfo, setLobbyInfo] = useState([]);
    const [personalScore, setPersonalScore] = useState(null);
    const [playerOrder, setPlayerOrder] = useState([]);

    const { state } = useLocation();

    useEffect(() => {
        setUsername(state.username);
        setLobbyName(state.lobbyName);
        setAnfitrion(state.anfitrion);
        setPlayerOrder(state.playersOrder);
        console.log('Player Order'+state.playersOrder);
        if(state.anfitrion === state.username){
            setPlayerTurn(state.anfitrion);
            shuffleCards();
        };
        Socket.on('generateGameTrue', (data) => {
            console.log(data);
            data = JSON.parse(data);
            console.log(data);
            const ply = Object.values(data['players']);
            const ply2 = [];
            const ply3 = [];
            for (let i = 0; i < ply.length; i++) {
                console.log(ply[i]);
                ply2.push(Object.values(ply[i]));
            }
            for (let i = 0; i < ply2.length; i++) {
                ply3.push(ply2[i][0]);
            }
            console.log(ply3);
            setPlayers(ply3);
            // setPlayerTurn(data['turnoActual']);
            setLobbyInfo(data);
            console.log('maso' + data['deck']);
            setCards(data['deck']);
        });
        
        
        Socket.on('turnUpdated', (data) => {
            console.log('turno actual '+data['playerturn']);           
            setPlayerTurn(data['playerturn']);            
        });
        
    }, []);

    const shuffleCards = () => {
        const shuffleCards = [...cardImages, ...cardImages]
            .sort(() => Math.random() - 0.5)
            .map((card) => ({ ...card, id: Math.random() }));

        // setChoice1(null);
        // setChoice2(null);
        Socket.emit('generateGame', { 'nameRoom': state.lobbyName, 'cards': shuffleCards })
        setCards(shuffleCards);
    };

    setInterval(() => {

        Socket.on('choice1Update', (data) => {
            console.log(data);
            console.log(state.username);
            console.log(playerturn);
            if (username !== playerturn && !choice1) {
                cards.map((card) => {
                    if (card.src === data['choice1'] && card.id === data['id']) {
                        setChoice1(card);
                    }
                }
                );
            }
        });
        Socket.on('choice2Update', (data) => {
            console.log(data);
            console.log(state.username);
            console.log(playerturn);
            if (username !== playerturn && choice1 && !choice2) {
                cards.map((card) => {
                    if (card.src === data['choice2'] && card.id === data['id']) {
                        setChoice2(card);
                    }
                }
                );
            }
        });

      }, 1000);
    
    const handleChoice1 = () => {
        const upd = { 'lobbyName': LobbyName, 'choice1': choice1.src, 'id': choice1.id };
        Socket.emit('choice1', upd);
    };

    const handleChoice2 = () => {
        const upd = { 'lobbyName': LobbyName, 'choice2': choice2.src, 'id': choice2.id };
        Socket.emit('choice2', upd);
    };

    const handleTurn = () => {
        const index = playerOrder.indexOf(state.username);
        const newTurn = playerOrder[(index + 1) % playerOrder.length];
        setPlayerTurn(newTurn);
        const upd = { 'lobbyName': LobbyName, 'playerturn': newTurn };
        Socket.emit('turn', upd);
    };

    const handleChoice = (card) => {
        console.log('si llego aqui');
        choice1 ? setChoice2(card) : setChoice1(card);
    };

    useEffect(() => {
        if(choice1 && !choice2 && username === playerturn){
            console.log('entro ' + username + ' ' + playerturn);
            handleChoice1();
            
        }
        if (choice1 && choice2) {
            if(username === playerturn){
                console.log('entro2 ' + username + ' ' + playerturn);
                handleChoice2();
            }
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
                        if (player.username === username && username === playerturn) {
                            return { ...player, score: player.score + 1 };
                        } else {
                            return player;
                        }
                    });
                });
                if(username === playerturn){
                    setPersonalScore(personalScore + 1);
                }
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
        if(username === playerturn){
            handleTurn();
        }
        
    };

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
                                            <td>{player.username}</td>
                                            <td>{player.score}</td>
                                        </tr>
                                    )
                                })}
                            </table>
                        </div>
                        <div className='esp'>
                            <h5>Turns: {turn}</h5>
                            <h5>Turno de jugador: {playerturn}</h5>
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
                                        playerturn = {playerturn === username}
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