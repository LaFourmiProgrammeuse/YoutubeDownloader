const Discord = require('discord.js');
const Fs = require("fs");

const Youtube = require("./youtube.js");
const Server = require("./server");
const Index = require("./index.js");

var Command = module.exports;


module.exports.TreatCommand = async function (command_no_parsed, channel, author) {

  var command = ParseCommand(command_no_parsed);
  var n_arg = command.length;

  let date = new Date();
  date = date.toLocaleString('fr-FR', {timezone: "UTC"});
  let date_string = date.toString();

  let log = "\n[" + date_string + "] " + command_no_parsed + " - " + author.username;

  Fs.appendFileSync("../log.txt", log, (err) => {
    if(err){
      throw err;
    }
  });

  console.log(command);

  switch(command[0]) {
      case "help":

      ShowHelp(channel);

      break;

      case "download":

      let url = command[1];

      let options = new Array();
      if(n_arg >= 3){
        options = command.slice(2);
        console.log(options);
      }

      Youtube.DownloadVideo(url, options, channel, ShowFileLink);

      break;

      case "options":

      ShowOptions(channel);

      break;

      case "about":

      ShowAbout(channel);

      break;

    }

}


function ParseCommand(command){

  var parsed_command = new Array();

  var arg = "";
  for(c of command){
    if(c != " "){
      arg += c;
    }
    else{
      parsed_command.push(arg);
      arg = "";
    }
  }
  parsed_command.push(arg);

  return parsed_command;
}


function ShowOptions(channel){

  var qualities = Youtube.ytb_supported_qualities;
  var qualities_string = qualities.join(", ");

  var filters = Youtube.supported_filters;
  var filters_string = filters.join(", ");

  var embed_message = new Discord.MessageEmbed();
  embed_message.setColor('#0099ff');
  embed_message.addField("Supported qualities : ", qualities_string);
  embed_message.addField("Supported filters : ", filters_string);

  embed_message.setTimestamp();

  let app_version = "Youtube downloader v" + Index.app_version;
  embed_message.setFooter(app_version);

  channel.send(embed_message);
}

function ShowFileLink(file_name, channel){

  host = Server.host;
  port = Server.port;

  file_link = host + ":" + port + "/" + file_name;
  file_link_field_value = file_link + "\n\n NB : you have one hour to recover your file before deletion."

  var embed_message = new Discord.MessageEmbed();
  embed_message.setColor('#0099ff');
  embed_message.setTitle("Your file has finished downloading");
  embed_message.addField("File link : ", file_link_field_value);

  embed_message.setTimestamp();

  let app_version = "Youtube downloader v" + Index.app_version;
  embed_message.setFooter(app_version);

  channel.send(embed_message);

}


function ShowHelp(channel){

  let c_download_synopsys = "ytb download <youtube_url> [option1] [option2] ...";
  let c_download_explanation = "Example:\nytp download https://www.youtube.com/watch?v=FpQI1ARQTQ highest";

  let c_options_synopsys = "ytb options";
  let c_options_explanation = "Lists the options that can be used with the download command"

  var embed_message = new Discord.MessageEmbed();
  embed_message.setTitle("Help");
  embed_message.setColor('#0099ff');
  embed_message.addField(c_download_synopsys, c_download_explanation);
  embed_message.addField(c_options_synopsys, c_options_explanation);
  embed_message.addField("ytp about", "Miscellaneous application information");

  embed_message.addField("\u200B", "\u200B");

  let dm_explanation = "*You can also use me by sending me private messages*";
  embed_message.addField("Namely...", dm_explanation);

  embed_message.setTimestamp();

  let app_version = "Youtube downloader v" + Index.app_version;
  embed_message.setFooter(app_version);

  channel.send(embed_message);

}

function ShowAbout(channel){

  let embed_message = new Discord.MessageEmbed();
  embed_message.setTitle("About");
  embed_message.setColor('#0099ff');
  embed_message.addField("Github", "https://github.com/LaFourmiProgrammeuse/YoutubeDownloader");
  embed_message.addField("Contact", "antoine.sauzeau3@gmail.com");

  embed_message.setTimestamp();

  let app_version = "Youtube downloader v" + Index.app_version;
  embed_message.setFooter(app_version);

  channel.send(embed_message);
}
