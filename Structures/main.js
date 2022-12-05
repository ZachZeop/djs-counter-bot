const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const { Guilds, GuildMembers } = GatewayIntentBits;
const { Channel } = Partials;
const ms = require("ms");

const client = new Client({
  partials: [Channel],
  intents: [Guilds, GuildMembers],
  allowedMentions: { parse: ["everyone", 'users', 'roles'] },
  rest: { timeout: ms("1m") }
}).setMaxListeners(0);

client.config = require("./config.js");
client.commands = new Collection();

const { promisify } = require("util");
const Ascii = require("ascii-table");
const { glob } = require("glob");
const PG = promisify(glob);

["Events", "Commands", "AntiCrash"].forEach((handler) => {
  require(`./Handlers/${handler}`)(client, PG, Ascii);
});

module.exports = client;

client.login(client.config.token);