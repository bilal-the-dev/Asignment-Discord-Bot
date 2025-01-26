const {
    ApplicationCommandOptionType,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
  } = require('discord.js');
  
  module.exports = {
    name: 'send_assignment_btn',
    description: 'Send an assignment message with a button to a specified channel.',
    options: [
      {
        name: 'channel',
        description: 'The channel to send the assignment message in.',
        required: true,
        type: ApplicationCommandOptionType.Channel,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.ManageMessages],
    botPermissions: [PermissionFlagsBits.SendMessages],
  
    callback: async (client, interaction) => {
      const targetChannel = interaction.options.getChannel('channel');

  
      // Create a button
      const button = new ButtonBuilder()
        .setCustomId('assignment_create')
        .setLabel('Create')
        .setStyle(ButtonStyle.Primary);
  
      // Create an ActionRow
      const row = new ActionRowBuilder().addComponents(button);
  
      // Send the message with the button
      try {
        await targetChannel.send({
          content: 'Create your asignment from here',
          components: [row],
        });
  
        interaction.reply({
          content: `Assignment message sent in ${targetChannel}.`,
          ephemeral: true,
        });
      } catch (error) {
        console.error(error);
        interaction.reply({
          content: 'There was an error sending the message. Please try again later.',
          ephemeral: true,
        });
      }
    },
  };
  