const app = require('express')();
const fs = require('fs');
const http = require('http').Server(app)
const io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/pickName.html');
});

const players = new Set();
const state = {
  gameStarted: false,
}
const placeData = JSON.parse(fs.readFileSync('places.json', 'utf8'));

app.get('/game', (req, res) => {
  const { name } = req.query;
  players.add(name);
  res.sendFile(__dirname + '/src/index.html');
});

io.on('connection', (socket) => {
  io.emit('all players', Array.from(players));
  socket.on('kick', (name) => {
    players.delete(name);
    io.emit('all players', Array.from(players))
  });

  socket.on('startGame', () => {
    const allPlayers = Array.from(players);
    const theSpy = allPlayers[Math.floor(Math.random() * allPlayers.length)]
    const location = placeData.places[Math.floor(Math.random() * placeData.places.length)];
    io.emit('gameData', { theSpy, location });
    console.log(theSpy);
  });

})

http.listen(1576);