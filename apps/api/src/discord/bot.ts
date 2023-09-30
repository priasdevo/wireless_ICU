const { Client, Events, IntentsBitField } = require('discord.js')

// Create a new Discord client
const client = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
] })

// Set up an event listener for when the bot is ready
client.once(Events.ClientReady, (c: { user: { tag: any; }; }) => {
	console.log(`Ready! Logged in as ${c.user.tag} v004`);
})

client.on("messageCreate", (msg: { author: { bot: any; }; content: string; reply: (arg0: string) => void; }) => {
    console.log(msg.content);
    if (msg.author.bot) return;
    if (msg.content.toLocaleLowerCase() === "hello") {
      msg.reply("Hi!");
    }
  });

// get the bot token from bot.json via require
const { token } = require('./bot.json')

// Log in to Discord with your client's token
client.login(token)


