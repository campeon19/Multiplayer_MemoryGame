from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO, emit, send, join_room, leave_room
import random
import json


app = Flask(__name__)

app.debug = True
app.config['SECRET_KEY'] = 'secret!'
app.config['SESSION_TYPE'] = 'filesystem'


socket_io = SocketIO(app, cors_allowed_origins="*")

app.host = 'localhost'

users = []
rooms = {}
games = {}
gameStructure = {
    'lobbyName': '',
    'turnoActual': '',
    'turno': 0,
    'players': [],
    'choice1': '',
    'choice2': '',
    'parejas_encontradas': [],
    'winner': '',
    'deck': []
}


@socket_io.on('connect')
def test_connect():
    print('Conectado')


@socket_io.on('disconnect')
def test_disconnect():
    print('Disconnect')


@socket_io.on('registro')
def registro(data):
    print('received json: ' + str(data))
    users.append(data)
    print(users)

# send users to the front end


@socket_io.on('getUsers')
def getUsers(data):
    print('solicitud recibida, mandando usuarios')
    emit('userslist', users, broadcast=True)


@socket_io.on('message')
def handle_message(data):
    """event listener when client types a message"""
    print("data from the front end: ", str(data))
    emit("chat", data, broadcast=True)


@socket_io.on('createRoomInfo')
def roomsData(data):
    print(str(data))
    if rooms.get(data['lobbyName']) == None:
        rooms[data['lobbyName']] = data
        join_room(data['lobbyName'])
        print(rooms)


@socket_io.on('joinRoom')
def joinRoom(data):
    print(str(data))
    if rooms.get(data['lobbyName']) != None:
        roominfo = rooms[data['lobbyName']]
        if roominfo['password'] == data['password'] and int(roominfo['roomSize']) > len(roominfo['players']):
            rooms[data['lobbyName']]['players'].append(data['username'])
            join_room(data['lobbyName'])
            msg = {'players': rooms[data['lobbyName']]['players']}
            emit('updateLobby', msg, to=data['lobbyName'])
            print('Se unio exitosamente a la sala')


@socket_io.on('getLobbyInfo')
def getLobbyInfo(data):
    print('Solicitud recibida, mandando lobby info de: ' + str(data))
    sala = rooms[data]
    print(sala)
    jugadores = sala['players']
    print(jugadores)
    jugadores = {'players': jugadores}
    emit('lobbyInfo', sala)


@socket_io.on('startGame')
def startGame(data):
    print('Iniciando juego')
    msg = {'start': True}
    emit('startGameTrue', msg, to=data['nameRoom'])


@socket_io.on('generateGame')
def generateGame(data):
    print('Generando juego')
    sala = rooms[data['nameRoom']]
    games[data['nameRoom']] = gameStructure
    games[data['nameRoom']]['lobbyName'] = data['nameRoom']
    games[data['nameRoom']]['turnoActual'] = sala['anfitrion']
    games[data['nameRoom']]['deck'] = data['cards']
    for player in sala['players']:
        games[data['nameRoom']]['players'].append(
            {player: {'username': player, 'score': 0}})
    juego = json.dumps(games[data['nameRoom']])
    print("juego generado: " + str(juego))
    emit('generateGameTrue', juego, to=data['nameRoom'])


@socket_io.on('choice1')
def choice1(data):
    print('Choice 1 recibido: ' + str(data))
    games[data['lobbyName']]['choice1'] = data['choice1']
    upd = {'choice1': data['choice1'], 'id': data['id']}
    emit('choice1Update', upd, to=data['lobbyName'])


@socket_io.on('choice2')
def choice2(data):
    print('Choice 2 recibido: ' + str(data))
    games[data['lobbyName']]['choice2'] = data['choice2']
    upd = {'choice2': data['choice2'], 'id': data['id']}
    emit('choice2Update', upd, to=data['lobbyName'])


@socket_io.on('turn')
def choice2(data):
    print('Cambio de turno recibido: ' + str(data))
    games[data['lobbyName']]['turnoActual'] = data['playerturn']
    upd = {'playerturn': data['playerturn']}
    emit('turnUpdated', upd, to=data['lobbyName'])


@socket_io.on('gamestatus')
def gamestatus(data):
    print('Solicitud recibida, mandando estado del juego' + str(data))
    games[data['lobbyName']] = data
    emit('gamestatusUpdate', data, to=data['lobbyName'])


if __name__ == '__main__':
    import sys
    PORT = 5000
    if len(sys.argv) > 1:
        PORT = sys.argv[1]
    print(f"{PORT = }")
    socket_io.run(app, port=PORT, host='0.0.0.0')
