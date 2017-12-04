const express = require('express');
const morgan = require('morgan');
const path = require('path');
var favicon = require('serve-favicon');

var app = express();
var http = require('http').Server(app);

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Serve static assets
app.use('/js', express.static('js'));
app.use('/css', express.static('css'));
app.use('/data', express.static('data'));
app.use('/images', express.static('images'));
app.use('/font-awesome', express.static('font-awesome'));

//Favicon
app.use(favicon(path.join(__dirname,'favicon.ico')));

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './', 'index.html'));
});

const PORT = process.env.PORT || 9000;

http.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});