const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
const Socket = require('./socket');
const port = process.env.PORT || 8880;
const routes = require('./routes');

app.use(express.json());
app.use(cors({
  origin: '*',
}));
Socket.initConnection(server);
app.use('/api', routes);

server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});