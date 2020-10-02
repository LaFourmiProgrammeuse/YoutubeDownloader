'use strict';

//Modules
const Discord = require('discord.js');
const Fs = require("fs");
const Vm = require('vm');

const {ArgumentParser} = require("argparse");
const parser = new ArgumentParser();


// Create an instance of a Discord client
var client = new Discord.Client();
module.exports.GetDiscordClient = function(){
    return client;
}

const Server = require("./server.js");
const Command = require("./command.js");

const app_version = "1.0";
module.exports.app_version = app_version;

var discord_token;
var debug_guild_id = "670299451252015125";
var debug = false;

parser.add_argument("-d", "--debug", {help: "Active debug mode"});
var args = parser.parse_args();

if(args.debug == '1'){
    debug = true;
}

var special_caracter = "ytb ";    //caractere qui précède une commande


async function LoadDiscordToken(){

  return new Promise((resolve, reject) => {

    Fs.readFile("../discord_token.txt", "utf8", (err, data) => {

      if(err){
        console.log("Impossible de charger le token discord");
        reject();
      }
      else{
        discord_token = data.replace(/[\n]/gi, "");
        resolve();
      }
    });
  });
}


async function LoginToDiscord(){

  await LoadDiscordToken();

  console.log(discord_token);
  client.login(discord_token);
}

client.on('ready', () => {
    console.log('I am ready!');

    client.user.setActivity("ytb help", {type: "WATCHING"});
});

// Create an event listener for messages
client.on('message', message => {

    if(message.channel.type != "dm"){

      if(message.guild.id != debug_guild_id && debug == true || message.guild.id == debug_guild_id && debug == false){
        return;
      }
    }

    console.log(message.content);

    if(message.content.search(special_caracter) != -1){ console.log("d");

    let command = message.content.replace(special_caracter, "", 1);
    let channel = message.channel;
    let author = message.author;

    Command.TreatCommand(command, channel, author);
    }
});



LoginToDiscord();
