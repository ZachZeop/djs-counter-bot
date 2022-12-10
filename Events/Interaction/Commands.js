const { Client, ChatInputCommandInteraction, InteractionType, EmbedBuilder } = require("discord.js");
const { ApplicationCommand } = InteractionType;

module.exports = {
    name: "interactionCreate",

    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const { user, guild, commandName, member, type } = interaction

        if (!guild || user.bot) return

        if (type !== ApplicationCommand) return

        const embed = new EmbedBuilder().setColor("#38b6ff")
        
        const command = client.commands.get(commandName)

        if (!command) return interaction.reply({ embeds:[embed.setDescription(`An error occurred while running the command!`), ephemeral: true}) && client.commands.delete(commandName)

        if (command.UserPerms && command.UserPerms.length !== 0) if (!member.permissions.has(command.UserPerms)) return interaction.reply({ embeds:[embed.setDescription(`You need \`${command.UserPerms.join(", ")}\` permission(s) to execute this command!`), ephemeral: true });

        if (command.BotPerms && command.BotPerms.length !== 0) if (!guild.members.me.permissions.has(command.BotPerms)) return interaction.reply({ embeds:[embed.setDescription(`I need \`${command.BotPerms.join(", ")}\` permission(s) to execute this command!`), ephemeral: true});

        command.execute(interaction, client)

    }
}
