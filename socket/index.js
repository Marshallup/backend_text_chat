const {
  ADD_NICKNAME,
  ADD_USER,
  ADD_USER_INITIAL,
  USER_LEAVE,
  CONNECT_USER,
  SEND_MESSAGE,
  GET_MESSAGE,
} = require('./events');

class Socket {
  io;

  initConnection(server) {
    this.io = require('socket.io')(server);

    this.onClientConnection();
  }

  getAllSocketsWithData(id) {
    const allSocketsData = Array.from(this.io.sockets.sockets.entries())
      .map(([key, value]) => ({ id: key, data: value.data }));

    if (id) {
      return allSocketsData.filter(socket => socket.id !== id);
    }

    return allSocketsData;
  }
  getSocketByID(id) {
    return this.io.sockets.sockets.get(id);
  }

  getUsernameByID(id) {
    const socket = this.getSocketByID(id);

    return socket?.data?.username;
  }

  addDataInSocketByID(id, data) {
    const socket = this.getSocketByID(id);

    if (socket) {
      socket.data = data;
    }
  }

  addUsernameInSocketByID(id, username) {
    this.addDataInSocketByID(id, { username });
  }

  getIDClients() {
    return Array.from(this.io.sockets.sockets.keys());
  }

  onClientConnection() {
    this.io.on('connection', socket => {

      console.info(`Клиент подключился id(${socket.id})`);

      socket.on(ADD_NICKNAME, ({ username }) => {
        this.addUsernameInSocketByID(socket.id, username);

        const clients = this.getAllSocketsWithData(socket.id);

        clients.forEach(client => {
          this.getSocketByID(client.id).emit(ADD_USER, { id: socket.id, username });
          socket.emit(ADD_USER_INITIAL, { id: client.id, username: client.data.username });
        });
      });

      socket.on(SEND_MESSAGE, ({ id, username, message }) => {
        socket.to(id).emit(GET_MESSAGE, { id: socket.id, username, message });
      });

      socket.on(CONNECT_USER, ({ id }) => {
        console.log(id, 'username');
      });
      
      socket.on('disconnect', () => {
        console.info(`Клиент отключился  id(${socket.id})`);

        const clients = this.getAllSocketsWithData(socket.id);

        clients.forEach(client => {
          this.getSocketByID(client.id).emit(USER_LEAVE, { id: socket.id });
        });
      });
      
    });
  }
}

module.exports = new Socket();