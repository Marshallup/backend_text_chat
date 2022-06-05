const { ADD_NICKNAME, SUCCESS_CONNECTED, ADD_USER, USER_LEAVE, CONNECT_USER, SEND_MESSAGE, GET_MESSAGE } = require('./events');

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

  emitAllUsers() {

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
          socket.emit(ADD_USER, { id: client.id, username: client.data.username });
        });

        // console.log(clients, this.getAllSocketsWithData(), 's')
      });

      socket.on(SEND_MESSAGE, ({ id, message }) => {
        socket.to(id).emit(GET_MESSAGE, { id: socket.id, message });
      });

      socket.on(CONNECT_USER, ({ id }) => {

        console.log(id, 'username');
        // const chatRoom = this.io.sockets.adapter.rooms.get(this.getUsernameByID(socket.id));

        // if (chatRoom) {

        // } else {
        //   socket.join(username);
        // }
        // console.log(username, this.getUsernameByID(socket.id), 'sosss')

        // console.log(socket.rooms, id, this.io.sockets.adapter.rooms, 'rooms');

        // const chatRooms = Array.from(this.io.sockets.adapter.rooms.entries())
        //   .filter(([ roomID, clientsID ]) => new RegExp(prefixChat).test(roomID));

        // console.log(chatRoom, 'chatRoom');
        // console.log(Array.from(this.io.sockets.adapter.rooms.entries()), 'entries')
      });

      // const clientSocket = this.io.sockets.sockets.get(socket.id);

      // clientSocket.data = {
        // wewe: 'www'
      // }
      // console.log(this.io.sockets.sockets)
      // console.log(this.getIDClients(), 'socket')
      // socket.join(socket.request._query.id);
      socket.on('disconnect', () => {
        console.info(`Клиент отключился  id(${socket.id})`);

        const clients = this.getAllSocketsWithData(socket.id);

        clients.forEach(client => {
          this.getSocketByID(client.id).emit(USER_LEAVE, { id: socket.id });
        });
      });

      socket.emit(SUCCESS_CONNECTED);
      
    });
  }
}

module.exports = new Socket();