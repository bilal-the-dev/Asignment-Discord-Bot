const {
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  PermissionFlagsBits,
  MessageFlags,
} = require("discord.js");

module.exports = async (client, interaction) => {
  try {
    if (
      interaction.isModalSubmit() &&
      interaction.customId === "assignment_modal"
    ) {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      const title = interaction.fields.getTextInputValue("title");
      const description = interaction.fields.getTextInputValue("description");
      const channelName = interaction.fields.getTextInputValue("channelName");

      if (channelName.length > 100) {
        await interaction.editReply(
          "❌ The channel name must not exceed 100 characters. Please try again."
        );
        return;
      }

      const channel = await interaction.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        parent: process.env.ASSIGNMENT_CATEGORY_ID, // Specify the category under which the channel should be created
        reason: "Assignment submission",
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone, // Deny access to everyone
            deny: [PermissionFlagsBits.SendMessages],
          },
        ],
      });

      const serverIcon = interaction.guild.iconURL({
        dynamic: true,
        size: 1024,
      });

      const embed = new EmbedBuilder()
        .setColor(0x00aaff)
        .setTitle(`📋 ${title}`)
        .setDescription(`📝 **Description:**\n${description}`)
        .setThumbnail(serverIcon);

      const submitButton = new ButtonBuilder()
        .setCustomId("submit_assignment")
        .setEmoji("📤")
        .setLabel("Open thread")
        .setStyle(ButtonStyle.Secondary);

      const deleteButton = new ButtonBuilder()
        .setCustomId("delete_button")
        .setEmoji("🗑️")
        .setStyle(ButtonStyle.Secondary);
      const row = new ActionRowBuilder().addComponents(
        submitButton,
        deleteButton
      );

      await channel.send({
        content: `<@&${process.env.PING_ROLE_ID}>`,
        embeds: [embed],
        components: [row],
      });

      await interaction.editReply(
        `🎉 Your assignment channel has been created: ${channel}`
      );
    }
  } catch (error) {
    console.log(error);
  }
};
