// IMPORT
const config = require('./config.json');
const Telegraf = require('telegraf');
const fs = require('fs');
// CONSTANTS
const token = config.token;
const bot = new Telegraf(token);

// COMMANDS
bot.start((ctx) => ctx.reply('EN PROCESO'));
bot.help((ctx) => ctx.reply('EN PROCESO'));
fs.readdirSync("./commands/").forEach((file) => {
    let commandFunction = require(`./commands/${file}`);
    let commandName = file.split(".")[0];
    bot.command(commandName, (...args) => commandFunction.run(bot, ...args));
});
bot.on('location', (ctx, location) => {
    console.log(location);
    ctx.reply('Localización');
});
bot.launch();

// Comprobación
console.log("Bot ON");