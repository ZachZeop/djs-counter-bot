const { GuildChannel } = require("discord.js");
const DB = require("../../Structures/Schemas/CounterSetup");
module.exports = {
    name: "channelUpdate",
    /**
     * 
     * @param {GuildChannel} oldChannel 
     * @param {GuildChannel} newChannel 
     */
    async execute(oldChannel, newChannel) {
        if (oldChannel.name !== newChannel.name) {
            const counter = await DB.findOne({ GuildID: oldChannel.guild.id, Channel: oldChannel.id }).clone();
            if (counter) if (newChannel.name.split(':').length > 2) await newChannel.setName(oldChannel.name);
// Ensures no additional colons are added to counter channels' names
        }
    }
}
