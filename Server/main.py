from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO, emit, send, join_room, leave_room
from flask_session import Session
import uuid


app = Flask(__name__)

app.debug = True
app.config['SECRET_KEY'] = 'secret!'
app.config['SESSION_TYPE'] = 'filesystem'


socket_io = SocketIO(app, cors_allowed_origins="*")

app.host = 'localhost'

users = []
rooms = {}


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
            emit('updateLobby', msg, broadcast=True)
            print('Se unio exitosamente a la sala')


@socket_io.on('getLobbyInfo')
def getLobbyInfo(data):
    print('Solicitud recibida, mandando lobby info de: ' + str(data))
    sala = rooms[data]
    print(sala)
    jugadores = sala['players']
    print(jugadores)
    jugadores = {'players': jugadores}
    emit('lobbyInfo', jugadores)


@app.route('/', methods=['GET', 'POST'])
def chat():
    if(request.method == 'POST'):
        username = request.form('username')

        # Store the data in sessions
        session['username'] = username

        return session['username']


if __name__ == '__main__':
    socket_io.run(app, host='0.0.0.0', port=5000)
