const express = require('express');
const app = express();
const cors = require('cors');
// const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const Socket = require('./socket');
const port = process.env.PORT || 8880;
const routes = require('./routes');

// app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
  origin: '*',
}));
app.use('/api', routes);
Socket.initConnection(server);

server.listen(port, function() {
  console.log(`Listening on port ${port}`);
});