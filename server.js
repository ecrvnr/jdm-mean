const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const routes = require('./server/routes');

// API file for interacting with MongoDB

var app = express();
app.use(bodyParser.json());

// Create link to Angular build directory
app.use(express.static(path.join(__dirname, 'dist')));
// Initialize the app.
var server = app.listen(process.env.PORT || 8081, function () {
    var port = server.address().port;
    console.log('App now running on port', port);
});

// CONTACTS API ROUTES 

// API location
app.use('/api', routes);

// DEFAULT CATCH-ALL ROUTE

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});