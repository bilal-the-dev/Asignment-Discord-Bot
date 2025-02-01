const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

module.exports = {
  name: "send_assignment_btn",
  description:
    "Send an assignment message with a button to a specified channel.",
  options: [
    {
      name: "channel",
      description: "The channel to send the assignment message in.",
      required: true,
      type: ApplicationCommandOptionType.Channel,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.Administrator],

  callback: async (client, interaction) => {
    try {
      const targetChannel = interaction.options.getChannel("channel");

      const button = new ButtonBuilder()
        .setCustomId("assignment_create")
        .setLabel("Create")
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder().addComponents(button);

      await targetChannel.send({
        content: "Create your asignment from here",
        components: [row],
      });

      await interaction.reply({
        content: `Assignment message sent in ${targetChannel}.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error(error);
    }
  },
};
