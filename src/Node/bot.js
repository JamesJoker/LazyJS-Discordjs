const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client({intents: Discord.Intents});
const ffmpegPath = require('ffmpeg-static');
const prefix = "!";
const { Readable } = require('stream');

const SILENCE_FRAME = Buffer.from([0xF8, 0xFF, 0xFE]);

class Silence extends Readable {
  _read() {
    this.push(SILENCE_FRAME);
    this.destroy();
  }
}

client.on('debug', console.log)

client.on('error', console.log)

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    if (message.content[0] !== prefix) return;
    if (message.content.startsWith(prefix + "ping")) {
        message.reply('pong!');
    }

    if (message.content.startsWith(prefix + "join")){
        if(message.member.voice.channel){
            message.member.voice.channel.join().then(connection =>{
            connection.play(new Silence(), { type: 'opus' });
            let audioStream = connection.receiver.createStream(user, { mode: 'pcm' });
            audioStream.on('data', (chunk) => console.log(chunk));
            });
        }
    }

    if (message.content.startsWith(prefix + "leave")){
        if(client.voice.connections.find(channel => channel = message.member.voice.channel)){
            client.voice.connections.find(channel => channel = message.member.voice.channel).disconnect();
        }else{
            console.log("No channel!");
        }
    }
});

client.login('token');