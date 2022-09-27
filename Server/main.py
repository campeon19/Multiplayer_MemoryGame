from flask import Flask, render_template, request, redirect, url_for, session
from flask_socketio import SocketIO, emit, send
from flask_session import Session


app = Flask(__name__)

app.debug = True
app.config['SECRET_KEY'] = 'secret!'
app.config['SESSION_TYPE'] = 'filesystem'


socket_io = SocketIO(app, cors_allowed_origins="*")

app.host = 'localhost'


@socket_io.on('connect')
def test_connect():
    print('Conectado')


@socket_io.on('disconnect')
def test_disconnect():
    print('Disconnect')


@socket_io.on('message')
def handle_message(data):
    """event listener when client types a message"""
    print("data from the front end: ", str(data))
    emit("chat", data, broadcast=True)


@socket_io.on('createRoomInfo')
def roomsData(data):
    print(str(data))


@socket_io.on('joinRoom')
def joinRoom(data):
    print(str(data))


@app.route('/', methods=['GET', 'POST'])
def chat():
    if(request.method == 'POST'):
        username = request.form('username')

        # Store the data in sessions
        session['username'] = username

        return session['username']


if __name__ == '__main__':
    socket_io.run(app, host='0.0.0.0', port=5000)
