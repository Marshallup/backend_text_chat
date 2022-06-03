class Socket {
  io;

  initConnection(server) {
    this.io = require('socket.io')(server);

    this.onClientConnection();
  }

  onClientConnection() {
    this.io.on('connection', socket => {

      console.info(`Client connected [id=${socket.id}]`);
      socket.join(socket.request._query.id);
      socket.on('disconnect', () => {
        console.info(`Client disconnected [id=${socket.id}]`);
      });
      
    });
  }
}

module.exports = new Socket();