var path = require("path");
var fs = require("fs");

var settings = function (port) {
  if (port == 443) {
    return {
      ssl: {
        ca: fs
          .readFileSync(
            path.join(__dirname, "./certificates/production.bundle")
          )
          .toString(),
        cert: fs
          .readFileSync(path.join(__dirname, "./certificates/production.crt"))
          .toString(),
        key: fs
          .readFileSync(path.join(__dirname, "./certificates/production.key"))
          .toString(),
      },
      url: "https://aureussales.co.za",
      mongoUri: "mongodb://localhost:27018/test",
      /* mongoUri:
        "mongodb://Administrator:" +
        encodeURIComponent("Bokke@2020") +
        "@localhost:27090/test?retryWrites=true&w=majority",*/
    };
  } else {
    return {
      mongoUri: "mongodb://127.0.0.1:27018/test?retryWrites=true&w=majority",
    };
  }
};

module.exports = settings;
