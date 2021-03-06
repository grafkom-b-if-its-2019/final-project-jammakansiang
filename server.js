const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);

app.set('port', 3000);

// Secara default, nodejs tidak mengijinkan
// untuk mengakses file sebelum didaftarkan
app.use('/build',express.static(path.join(__dirname, 'build')));
app.use('/css',express.static(path.join(__dirname, 'css')));
app.use('/img',express.static(path.join(__dirname, 'img')));
app.use('/js',express.static(path.join(__dirname, 'js')));
app.use('/sound',express.static(path.join(__dirname, 'sound')));
app.use('/fonts',express.static(path.join(__dirname, 'fonts')));
app.use('/particle',express.static(path.join(__dirname, 'particle')));

server.listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});

//==================
//-----Routing------
//==================
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views' + '/awal.html');
});

app.get('/game', function (req, res) {
  res.sendFile(__dirname + '/views' + '/index.html');
});

app.get('/game-multiplayer', function (req, res) {
  res.sendFile(__dirname + '/views' + '/indexmultiplayer.html');
});

app.get('/start', function (req, res) {
  res.sendFile(__dirname + '/views' + '/awal.html');
});

app.get('/instruksi', function (req, res) {
  res.sendFile(__dirname + '/views' + '/instruksi.html');
});

app.get('/master', function(req, res) {
  res.sendFile(__dirname + '/views' + '/master.html');
});

app.get('/player', function(req, res) {
  res.sendFile(__dirname + '/views' + '/player.html');
});

app.get('/multiplayer', function(req, res) {
  res.sendFile(__dirname + '/views' + '/form.html');
});

var players = [];

//=================
//-----Socket------
//=================
io.on('connection', function(socket) {
  socket.on('join', function(room) {
    socket.join(room);

    console.log(socket.id);

    if(players.length == 0 && socket.conn.remoteAddress != "::1") players.push(socket.id);
    for(let i = 0;i < players.length; i++) {
      if(socket.id != players[i] && socket.conn.remoteAddress != "::1") {
        players.push(socket.id);
        break;
      }
    }

    io.sockets.connected[socket.id].emit('init', players.indexOf(socket.id) + 1);

    if(players.length >= 2) {
      io.sockets.in(room).emit('gameplay', true);

      socket.on('sync', function(data) {
        io.sockets.in(room).emit('sync', data);
      });
    }    
  });

  socket.on('disconnect', function() {
    console.log('A user disconnected');
  });
});