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

server.listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});

//==================
//-----Routing------
//==================
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/awal.html');
});

app.get('/game', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/start', function (req, res) {
  res.sendFile(__dirname + '/awal.html');
});

app.get('/instruksi', function (req, res) {
  res.sendFile(__dirname + '/instruksi.html');
});

//=================
//-----Socket------
//=================
io.on('connection', function(socket) {
  socket.on('join', function(room) {
    socket.join(room);

    socket.on('keyboardEvent', function(data) {
      console.log(data);
      io.sockets.in(room).emit('keyboardEvent', data);
    });

    socket.on('deviceOrientation', function(data) {
      io.sockets.in(room).emit('deviceOrientation', data);
    })

    socket.on('sync', function(data) {
      io.sockets.in(room).emit('sync', data);
    });
  });

  socket.on('disconnect', function() {
    console.log('A user disconnected');
  });
});