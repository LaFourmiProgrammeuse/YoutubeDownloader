const Axios = require("axios");
const Qs = require("qs");
const Fs = require("fs");
const Ytdl = require("ytdl-core");
const CryptoJs = require("crypto-js");
const Url = require("url");
const AdmZip = require("adm-zip");

const URL = Url.URL;

ytb_supported_qualities = ["highest", "lowest", "highestaudio", "lowestaudio", "highestvideo", "lowestvideo"];
module.exports.ytb_supported_qualities = ytb_supported_qualities;

supported_filters = ["audioonly", "videoonly"];
module.exports.supported_filters = supported_filters;

var youtube_token = undefined;
const youtube_api_path = "https://www.googleapis.com/youtube/v3/"

function LoadToken(){

  return new Promise((resolve, reject) => {

    if(youtube_token != undefined){
      resolve();
    }

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

module.exports.DownloadFromYoutube = async function(url, options, channel, author, callback_func){

  console.log(url); console.log("test2");

  await LoadToken();

  //On regarde si l'url correspond à une playlist ou à une vidéo
  if(url.search("playlist") != -1){ console.log("test3");
  DownloadPlaylist(url, options, channel, author, callback_func);
}
else if(url.search("watch") != -1){console.log("test");
DownloadVideo(url, options, channel, author, callback_func);
}

//DownloadVideo(url, options, channel, callback_func);
}

async function DownloadPlaylist(playlist_url_string, options, channel, author, callback_func){


  //Le but est de retrouver à partir de l'url d'une playlist les urls de ses vidéos
  let l_video_url = new Array();

  let api_endpoint = "playlistItems";

  let playlist_url = new URL(playlist_url_string);
  let playlist_id = playlist_url.searchParams.get("list");

  console.log(playlist_id);

  //On crée l'archive zip dans laquelle on va stocker les fichiers de la playlist
  let archive_name = CryptoJs.MD5(author.username).toString() + ".zip";
  let zip = new AdmZip();


  let next_page_token = "";
  while(next_page_token != undefined){

    let params = {key: youtube_token, playlistId: playlist_id, part: "snippet", pageToken: next_page_token};

    let url = youtube_api_path + api_endpoint + "?" + Qs.stringify(params, {arrayFormat: "brackets"});

    let response;
    await Axios({
      method: "get",
      url: url
    }).then((response_) => {
      response = response_;
    });

    let data = response.data;
    let l_page_video = data.items;

    for(let video of l_page_video){
      let url = "https://www.youtube.com/watch?v=" + video.snippet.resourceId.videoId;
      l_video_url.push(url);
    }
    next_page_token = data.nextPageToken;
  }

  console.log(l_video_url);


  let l_video_file_name = new Array();

  for(video_url of l_video_url){

    let file_name = await DownloadVideo(video_url, options, channel).catch((err) => {
      console.log(err);
      return undefined;
    });

    console.log("File name : " + file_name)

    if(file_name == undefined){
      console.log("y1");
      continue;
      console.log("y");
    }

    let file_path = "../video/" + file_name;
    console.log("file path : " + file_path);

    l_video_file_name.push(file_name);

    zip.addLocalFile(file_path);

    console.log(await Fs.statSync(file_path));
  }

  zip.writeZip("../video/" + archive_name);

  callback_func(archive_name, channel);

  console.log(l_video_file_name);
}




async function DownloadVideo(video_url, options, channel, author, callback_func){

  return new Promise(async function (resolve, reject) {

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

    let video_info = await Ytdl.getInfo(video_url).catch((error) => {
       reject(error);
    });

    if(video_info == undefined){
      console.log("x1");
      reject("Video info undefined");
      return;
      console.log("x");
    }

    let format = Ytdl.chooseFormat(video_info.formats, json_options).container; //On récupère le format choisie par Ytdl en fonction des choix de l'utilisateur

    let file_name = video_info.title + "." + format;

    const regex = new RegExp("[ \/]", "gm");
    file_name = file_name.replace(regex, "_");

    let input_stream = Ytdl(video_url, {format: format});
    let output_stream = Fs.createWriteStream('../video/' + file_name);

    output_stream.on("finish", () => {
      console.log("Video ecrite avec succes");

      if(callback_func != undefined){
        callback_func(file_name, channel);
        resolve();
      }
      else{
        resolve(file_name);
      }
    });

    input_stream.pipe(output_stream);
  });
}
