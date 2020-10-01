const Discord = require('discord.js');

const Youtube = require("./youtube.js");

var Command = module.exports;


module.exports.TreatCommand = async function (command_no_parsed, channel, author) {

  var command = ParseCommand(command_no_parsed);
  var n_arg = command.length;

  console.log(command);

  switch(command[0]) {
      case "help":

      break;

      case "download":

      let url = command[1];

      let options = new Array();
      if(n_arg >= 3){
        options = command.slice(2);
        console.log(options);
      }

      Youtube.DownloadVideo(url, options);

      break;

      case "options":

      ShowOptions(channel);

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

  var e_message = new Discord.MessageEmbed();
  e_message.addField("Supported qualities : ", qualities_string);
  e_message.addFiled("Supported filters : ", filters_string);

  channel.send(e_message);
}
