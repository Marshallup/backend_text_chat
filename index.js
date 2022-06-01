const app = require('express')();
const server = require('http').createServer(app);
const { initConnectionSocket } = require('./socket');
const port = process.env.PORT || 8880;

initConnectionSocket(server);

server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});