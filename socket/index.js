exports.initConnectionSocket = server => {
    io = require('socket.io')(server);

    io.on('connection', (socket) => {
        console.info(`Client connected [id=${socket.id}]`);
        socket.join(socket.request._query.id);
        socket.on('disconnect', () => {
          console.info(`Client disconnected [id=${socket.id}]`);
        });
    });
}