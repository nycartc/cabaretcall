// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var jsonfile = require('jsonfile');

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/calls", function (request, response) {
  response.sendFile(__dirname + "/calls.json");
});

app.get("/call/new", function (request, response) {
  if (request.query.message){
    var message = request.query.message;
    jsonfile.readFile(__dirname + "/calls.json", function(err, obj) {
      obj.calls.push(message);
      jsonfile.writeFile(__dirname + "/calls.json", obj, function(err) {
          if (err){
            throw err;
          } else {
            response.status(200);
            response.send("OK");
          }
      });
    });
  } else {
    response.status(400);
    response.send("Error");
  }
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
