var express = require("express");
var app = express();
var myArgs = process.argv.slice(2);

var port = process.env.PORT || 8080;
if (typeof myArgs[0] !== "undefined") port = parseFloat(myArgs[0]);
var morgan = require("morgan");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var router = express.Router();
var appRoutes = require("./app/routes/api")(router);
var path = require("path");
var passport = require("passport");
var https = require("https");

var settings = require("./settings.js")(port);

//app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "20mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "20mb", extended: true }));
app.use(express.static(__dirname + "/front"));
app.use("/api", appRoutes);

mongoose.connect(settings.mongoUri, { useNewUrlParser: true }, function (err) {
  if (err) {
    console.log("Not Connected to the Database");
    throw err;
  } else {
    console.log("Connected to MOngoDB");
  }
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname + "/front/app/views/index.html"));
});

if (port === 443) {
  var server = https.createServer(settings.ssl, app);
  server.listen(port, () =>
    console.log("Server listening on port " + port + "!")
  );

  var redirectApp = express();
  redirectApp.use(
    "/.well-known",
    express.static(path.join(__dirname, "./front/.well-known"))
  );
  redirectApp.get("/", function (req, res) {
    res.set("Content-Type", "text/html");
    res.send(
      new Buffer(
        '<html><head><meta http-equiv="refresh" content="0; url=' +
          settings.url +
          '" /></head></html>'
      )
    );
  });
  redirectApp.listen(80);
} else {
  app.listen(port, function () {
    console.log("Running on " + port + " check Browser");
  });
}
