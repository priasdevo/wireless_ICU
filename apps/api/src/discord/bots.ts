import { Client, EmbedBuilder, Events, IntentsBitField } from "discord.js";
const { token } = require('./bot.json')

var client: Client<boolean>;

export const registerBot = () => {
  client = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ] })
  
  // Set up an event listener for when the bot is ready
  client.once(Events.ClientReady, (c: { user: { tag: any; }; }) => {
    console.log(`Ready! Logged in as ${c.user.tag} v004`);
  })
  
  client.on("messageCreate", async (msg: { author: { bot: any; }; content: string; reply: (arg0: string) => void; }) =>  {
    //console.log(msg.content);
    if (msg.author.bot) return;
    if (msg.content.toLocaleLowerCase() === "hello") {
      msg.reply("Hi!");
      return;
    }/*
    if (msg.content.toLocaleLowerCase() === "test") {
      console.log('test123');
      messageChannel('1157728920339234996', 'messaging this channel.')
      console.log('done');
      return;
    }
    if (msg.content.toLocaleLowerCase() === "embed") {
      //sampleEmbed('1157728920339234996');
      notify('1157728920339234996', '012345', '')
      return;
    }*/

  });
  
  // Log in to Discord with your client's token
  client.login(token)
}

export const getClient = () => {
  return client;
}

export const messageChannel = async (channelId: string, message: string) => {
  console.log('messageChannel');
  const channel = await client.channels.fetch(channelId);
  console.log(channel);
  if(!channel) return console.log('Channel not found');
  if (channel.isTextBased()) {
    channel.send(message);
  }
}

export const sampleEmbed = async (channelId: string) => {
  const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Embed Title')
      .setDescription('This is a sample embedded message.')
      .addFields({name: 'Field 1', value: 'Field 1 Value', inline: true})
      .addFields({name: 'Field 2', value: 'Field 2 Value', inline: true})
      .setFooter({text: 'This is a footer.'})
  const channel = await client.channels.fetch(channelId);
  if(!channel) return console.log('Channel not found');
  if (channel.isTextBased()) {
    channel.send({ embeds: [embed] });
  }
}

export const notify = async (channelId: string, deviceID: string, link: string) => {
  if(link === '') link = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const footageHyperlink = '[File Link]('+link+')';
  const embed = new EmbedBuilder()
      .setColor('#9e001a')
      .setTitle('Movement Detected from device ' + deviceID+'!')
      .setDescription('Your device has detected activity and recorded a video.')
      .addFields({name: 'Timestamp', value: new Date().toLocaleString(), inline: false})
      .addFields({name: 'Footage', value: footageHyperlink, inline: false})
      .setFooter({text: 'ICU version 0.0.1'})
  const channel = await client.channels.fetch(channelId);
  if(!channel) return console.log('Channel not found');
  if (channel.isTextBased()) {
    channel.send({ embeds: [embed] });
  }
}