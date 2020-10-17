'use strict'

const Http = require("http");
const Url = require("url");
const Fs = require("fs");

const port = 8000;
const host = "http://ec2-18-222-23-99.us-east-2.compute.amazonaws.com";

module.exports.port = port;
module.exports.host = host;

const Server = module.exports;

function CloseServer(){
  server.close();
}

function requestListener(request, response){

  console.log("Request ");

  //nom du fichier audio ou video
  var file_name = Url.parse(request.url,true).pathname;
  file_name = decodeURI(file_name);
  file_name = file_name.replace("/", "");

  const file_path = "../video/" + file_name;

  response.setHeader('Content-disposition', 'attachment; filename=' + file_name);

  var read_stream = Fs.createReadStream(file_path);
  read_stream.pipe(response);

}

const server = Http.createServer(requestListener);
server.listen(port, () => {
  console.log(`Server is running on ${host}:${port}`);
});

process.on("exit", CloseServer);
process.on("uncaughtException", CloseServer);
process.on("SIGTERM", CloseServer);
