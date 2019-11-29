const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
app.set('port', 3000);

// Secara default, nodejs tidak mengijinkan
// untuk mengakses file sebelum didaftarkan
app.use('/build',express.static(path.join(__dirname, 'build')));
app.use('/css',express.static(path.join(__dirname, 'css')));
app.use('/img',express.static(path.join(__dirname, 'img')));
app.use('/js',express.static(path.join(__dirname, 'js')));

const server = http.createServer(app);
server.listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});

//==================
//-----Routing------
//==================
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});