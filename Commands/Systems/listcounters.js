const { ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const DB = require("../../Structures/Schemas/CounterSetup");

module.exports = {
  name: "listcounters",
  description: "Lists all counters for this server.",
  permission: "ViewAuditLog",
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild } = interaction;
    try {
        await DB.find({ GuildID: guild.id }, function(err,docs) {
            if (err) {
                console.error;
                return interaction.reply({ content: 'An error has occurred', ephemeral: true });
            } else {
                const embed = new EmbedBuilder().setAuthor({ name: `${guild.name} Counters`, iconURL: guild.iconURL() }).setFooter({ text: guild.name, iconURL: guild.iconURL() });
                if (docs.length < 1) embed.addFields({ name: `No Counters!`, value: `This discord server does not have any counters setup yet!\nUse the \`/countersetup\` command to setup counter channels!` });
                if (docs.length > 25) docs.length = 25;
                docs.forEach((counter) => {
                    embed.addFields([{ name: guild.channels.cache.get(counter.Channel).name, value: `This channel counts the number of <@&${counter.Counting}> members\nAll <@&${counter.Viewers}> can view this channel.` }]);
                });
                return interaction.reply({embeds: [embed], ephemeral: true });
            }
        }).clone();
    } catch (err) {
      console.log('Error listing counters:\n', err);
      return interaction.reply({ content: 'An error has occurred', ephemeral: true });
    }
  },
};
