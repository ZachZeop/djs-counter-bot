const { GuildChannel } = require("discord.js");
const DB = require("../../Structures/Schemas/CounterSetup");
module.exports = {
    name: "channelDelete",
    /**
     * 
     * @param {GuildChannel} channel
     */
    async execute(channel) {
        const counter = await DB.findOne({ GuildID: channel.guild.id, Channel: channel.id }).clone();
        if (counter) await counter.deleteOne();
    }
}