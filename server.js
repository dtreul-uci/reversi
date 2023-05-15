let static = require("node-static");

let http = require("http");

let port = process.env.PORT;
let directory = __dirname + "/public";

if (typeof port === "undefined" || port == null) {
  port = 8080;
  directory = "./public";
}

let file = new static.Server(directory);

let app = http
  .createServer((request, response) => {
    request
      .addListener("end", () => {
        file.serve(request, response);
      })
      .resume();
  })
  .listen(port);

console.log("listening");
