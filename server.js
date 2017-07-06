var express = require('express');
var app = express();
var jsonfile = require('jsonfile');
var hbs = require("hbs");

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// https://www.npmjs.com/package/hbs
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
hbs.registerPartials(__dirname + '/views/partials');


function sendOK(req, res) {
  res.status(200);
  res.send("OK");
  return;
}

function sendError(req, res, error) {
  res.status(400);
  var errorMessage = "Error";
  if (error) {
    errorMessage += ": " + error;
  }
  res.send(error);
  return;
}

function getData(filename, object, callback) {
  try {
    jsonfile.readFile(__dirname + "/public/" + filename + ".json", function(err, obj) {
      if (err) {
        throw err;
      } else {
        callback(obj[object]);
        return;
      }
    });
  } catch (err) {
    console.log(err);
  }
}



app.get("/", function (req, res) {
  
  getData("script", "script", function(script) {
    res.locals = {
      script: script
    }

    res.render("index");
  });

});

app.get("/calls", function (req, res) {
  res.sendFile(__dirname + "/public/calls.json");
});

app.get("/call/new", function (req, res) {
  try {
    if (req.query.district){
      var district = req.query.district;
      if (parseInt(district) > 0 && parseInt(district) < 52){
        jsonfile.readFile(__dirname + "/public/calls.json", function(err, obj) {
          if (err) {
            throw err;
          } else {
            var d = new Date()
            obj[district].push(d);
            jsonfile.writeFile(__dirname + "/public/calls.json", obj, function(err) {
              if (err){
                throw err;
              } else {
                res.status(201);
                res.json(obj);
              }
            });
          }
        });
      } else {
        throw "Error: Invalid district";
      }
    } else {
      throw "Error: No message";
    } 
  } catch (err) {
    sendError(req, res, err);
  }
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
