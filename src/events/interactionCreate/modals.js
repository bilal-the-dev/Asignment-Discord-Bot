const {
    ChannelType,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    PermissionFlagsBits,
  } = require('discord.js');
  
  module.exports = async (client, interaction) => {
    try {
      // Check if the interaction is a modal submit
      if (interaction.isModalSubmit() && interaction.customId === 'assignment_modal') {
        // Retrieve modal input values
        const title = interaction.fields.getTextInputValue('title');
        const description = interaction.fields.getTextInputValue('description');
        const channelName = interaction.fields.getTextInputValue('channelName');

        if (channelName.length > 100) {
          await interaction.reply({
            content: '❌ The channel name must not exceed 100 characters. Please try again.',
            ephemeral: true,
          });
          return; 
        }
  
        const channel = await interaction.guild.channels.create({
          name: channelName,
          type: ChannelType.GuildText,
          parent: process.env.ASSIGNMENT_CATEGORY_ID, // Specify the category under which the channel should be created
          reason: 'Assignment submission',
          permissionOverwrites: [
            {
              id: interaction.guild.id, // Deny access to everyone
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: interaction.guild.roles.everyone, // Ensure @everyone role is denied
              deny: [PermissionFlagsBits.ViewChannel],
            },
            {
              id: interaction.guild.roles.cache.find(role =>
                role.permissions.has(PermissionFlagsBits.Administrator)
              )?.id, // Grant access to admins
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages],
            },
          ],
        });
        // Get server icon for the thumbnail (fallback if not available)
        const serverIcon = interaction.guild.iconURL({ dynamic: true, size: 1024 });
  
        // Create an embed
        const embed = new EmbedBuilder()
          .setColor(0x00aaff)
          .setTitle(`📋 ${title}`)
          .setDescription(`📝 **Description:**\n${description}`)
          .setThumbnail(serverIcon)
  
        // Create a button
        const submitButton = new ButtonBuilder()
          .setCustomId('submit_assignment')
          .setEmoji("📤")
          .setStyle(ButtonStyle.Secondary);
  

          const deleteButton = new ButtonBuilder()
  .setCustomId('delete_button')
  .setEmoji('🗑️') 
  .setStyle(ButtonStyle.Secondary);
        // Add the button to an action row
        const row = new ActionRowBuilder().addComponents(submitButton, deleteButton);
  
        // Send the embed and button in the new channel
        await channel.send({
          content: `<@&${process.env.PING_ROLE_ID}>`,
          embeds: [embed],
          components: [row],
        });
  
        // Acknowledge the interaction
        await interaction.reply({
          content: `🎉 Your assignment channel has been created: ${channel}`,
          ephemeral: true,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };