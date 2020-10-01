const Http = require("http");
const Fs = require("fs");

const port = "8000"
const host = "localhost";

const Server = module.exports;

function requestListener(request, response){

  //nom du fichier audio ou video
  const file_name = url.parse(req.url,true).pathname;
  const file_path = "../video/" + file_name;

  var file_stat = fs.statSync(filePath);

    response.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': file_stat.size
    });

    var readStream = fileSystem.createReadStream(file_path);
    readStream.pipe(response);
}

const server = Http.createServer(requestListener);
server.listen(host, port, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
