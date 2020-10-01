const axios = require("axios");
const Qs = require("qs");
const Fs = require("fs");
const Ytdl = require("ytdl-core");
const CryptoJs = require("crypto-js");

ytb_supported_qualities = ["highest", "lowest", "highestaudio", "lowestaudio", "highestvideo", "lowestvideo"];
module.exports.ytb_supported_qualities = ytb_supported_qualities;

supported_filters = ["audioonly", "videoonly"];
module.exports.supported_filters = supported_filters;

var youtube_token;
const youtube_api_path = "https://www.googleapis.com/youtube/v3/"

function LoadToken(){

    return new Promise((resolve, reject) => {

        Fs.readFile("../youtube_token.txt", "utf8", (err, data) => {

            if(err){
                reject(err);
            }
            else{
                youtube_token = data;
                resolve();
            }
        });
    });
}

module.exports.DownloadVideo = async function(video_url, options){

  video_id = Ytdl.getURLVideoID(video_url);
  file_name = CryptoJs.MD5(video_id) + ".mp3";

  console.log(file_name);

  let json_options = {};

  for(let option of options){

    if(option == "audioonly"){
      json_options.filter = option;
    }
    else if(option == "videoonly"){
      json_options.filter = option;
    }

    if(ytb_supported_qualities.find((array_element) => {return array_element == option})){
      json_options.quality = option;
    }
  }

  console.log(json_options);
  console.log(options);

  let stream = Ytdl(video_url, json_options);

  stream.pipe(Fs.createWriteStream('../video/' + file_name));

}
