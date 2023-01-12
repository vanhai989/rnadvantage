var express = require("express");
var server = express();

const port = process.env.PORT || 80;
const host = "0.0.0.0";

server.get(
  "/.well-known/apple-app-site-association",
  function (request, response) {
    response.sendFile(__dirname + "/apple-app-site-association");
  }
);

server.get("/.well-known/assetlinks", function (request, response) {
  response.sendFile(__dirname + "/assetlinks");
});

// server.listen(port, host, () => {
//   console.log(`Server listing at http://${host}:${port}`);
// });

server.listen(80);
