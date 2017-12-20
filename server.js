const path = require('path'); 
const express = require('express');
const app = express();
// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 5000);