const { ChatInputCommandInteraction, ChannelType, ApplicationCommandOptionType, PermissionFlagsBits } = require("discord.js");
const DB = require("../../Structures/Schemas/CounterSetup");

module.exports = {
  name: "countersetup",
  description: "Setup the member counting system.",
  permission: "ViewAuditLog",
  options: [{
    name: "category",
    description: "Select the counter channel's creation category.",
    required: true,
    type: ApplicationCommandOptionType.Channel,
    channelTypes: [ChannelType.GuildCategory],
  },
  {
    name: "viewers",
    description: "Select the role that can view this counter channel.",
    required: true,
    type: ApplicationCommandOptionType.Role,
  },
  {
    name: "counting",
    description: "Select the role to be counted (@everyone for all members).",
    required: true,
    type: ApplicationCommandOptionType.Role,
  }],
  /**
   *
   * @param {ChatInputCommandInteraction} interaction
   */
  async execute(interaction) {
    const { guild, options } = interaction;
    const Category = options.getChannel("category");
    const Viewers = options.getRole("viewers");
    const Counting = options.getRole("counting");
    try {
      await guild.members.fetch(); // Need to fetch all guild members beforehand
      const currentCount = Counting.id == guild.id ? (await guild.members.fetch()).filter((member) => !member.user.bot).size : (await guild.roles.fetch(Counting.id, true)).members.filter((member) => !member.user.bot).size;
      await guild.channels.create({
        name: Counting.id == guild.id ? `Members: ${currentCount}` : `${Counting.name.replaceAll(':', '')}: ${currentCount}`,
        type: ChannelType.GuildVoice,
        parent: Category,
        permissionOverwrites: [{ id: Viewers.id, allow: [PermissionFlagsBits.ViewChannel], deny: [PermissionFlagsBits.Connect] }]
      }).then(async (newChannel) => {
        await DB.findOne({ GuildID: guild.id, Counting: Counting.id }, async function (err, docs) {
          if (err) {
            console.error
          } else {
            if (docs) await guild.channels.cache.get(docs.Channel).delete();
          }
          await DB.findOneAndUpdate({ GuildID: guild.id, Counting: Counting.id }, { GuildID: guild.id, Category: Category.id, Channel: newChannel.id, Viewers: Viewers.id, Counting: Counting.id }, { new: true, upsert: true });
        }).clone();
        interaction.reply({ content: "Counter channel created!", ephemeral: true });
      });
    } catch (err) {
      console.log('Error creating Counter Channel:\n', err);
      interaction.reply({ content: 'An error occurred while creating your counter channel!', ephemeral: true });
    }
  },
};
