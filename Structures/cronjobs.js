const { Client } = require("discord.js");
const cron = require("node-cron");
const DB = require("./Schemas/CounterSetup");
/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
  cron.schedule('*/15 * * * *', async () => { // Every 15mins
    client.guilds.cache.forEach(async (guild) => await guild.members.fetch()); // Need to fetch all guild members beforehand
    await DB.find({}).then(async (channels) => {
      channels.forEach(async (channelInfo) => {
        const { GuildID, Channel, Counting } = channelInfo;
        const guild = await client.guilds.fetch(GuildID);
        const channel = await guild.channels.fetch(Channel);

        const newCount = Counting == GuildID ? (await guild.members.fetch()).filter((member) => !member.user.bot).size : (await guild.roles.fetch(Counting, true)).members.filter((member) => !member.user.bot).size;
        const channelName = channel.name.split(':')[0]; // Our channelUpdate event will make sure this always works
        const currentCount = parseInt(channel.name.split(':')[1].replace(' ', ''));
        if (parseInt(newCount) != currentCount) await channel.setName(`${channelName}: ${newCount}`);
      });
    }).clone();
  }, { scheduled: true, timezone: "America/New_York" });
};
