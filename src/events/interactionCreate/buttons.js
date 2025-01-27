const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    StringSelectMenuBuilder,
  } = require('discord.js');
  
  module.exports = async (client, interaction) => {
    try {
      // Check if the interaction is a button click
      if (interaction.isButton() && interaction.customId === 'assignment_create') {
        // Create a modal
        const modal = new ModalBuilder()
          .setCustomId('assignment_modal')
          .setTitle('Create Your Assignment');
  
        // Create text input fields
        const titleInput = new TextInputBuilder()
          .setCustomId('title')
          .setLabel('Title')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('Enter the title of your assignment')
          .setRequired(true);

          const channelName = new TextInputBuilder()
          .setCustomId('channelName')
          .setLabel('Channel Name')
          .setStyle(TextInputStyle.Short)
          .setPlaceholder('channel name where assignment will go')
          .setRequired(true);


  
        const descriptionInput = new TextInputBuilder()
          .setCustomId('description')
          .setLabel('Description')
          .setStyle(TextInputStyle.Paragraph)
          .setPlaceholder('Enter a brief description of your assignment')
          .setRequired(true);
  
        // Add inputs to action rows
        const titleRow = new ActionRowBuilder().addComponents(titleInput);
        const descriptionRow = new ActionRowBuilder().addComponents(descriptionInput);
        
        const channelNameRow = new ActionRowBuilder().addComponents(channelName);
  
        // Add action rows to the modal
        modal.addComponents(titleRow, descriptionRow, channelNameRow);
  
        // Show the modal to the user
        await interaction.showModal(modal);
      } else if(interaction.isButton() && interaction.customId === 'submit_assignment'){
        const parentChannel = interaction.channel;
      
        try {
          // Create a thread under the channel
          const thread = await parentChannel.threads.create({
            name: `Submit and discuss your assignment here`,
            autoArchiveDuration: 1440, // 24 hours
            reason: 'Assignment visibility thread created',
          });

          const mm = await thread.fetchStarterMessage()
          await mm.delete()

      
          // Send a message in the thread
          await thread.send({
            content: `📝 ${interaction.user} here is your thread is for discussions regarding the assignment.`,
          });
      
          // Respond to the interaction
          await interaction.reply({
            content: `✅ A thread has been created.`,
            ephemeral: true,
          });
        } catch (error) {
          console.log(`Error creating thread: ${error}`);
          await interaction.reply({
            content: '❌ There was an error creating the thread. Please try again.',
            ephemeral: true,
          });
        }
      }else if (interaction.isButton() && interaction.customId === 'delete_button') {
        try {

          const member = interaction.member;
          if (!member.permissions.has('Administrator')) {
            return await interaction.reply({
              content: '❌ Only admins can delete this channel.',
              ephemeral: true,
            });
          }
      
          const channel = interaction.channel;
          if (!channel) {
            return await interaction.reply({
              content: '❌ Unable to find the channel to delete. Please try again.',
              ephemeral: true,
            });
          }
      
          // Delete the channel
          await channel.delete('Channel deleted by the delete button');
          console.log(`Channel "${channel.name}" was deleted successfully.`);
        } catch (error) {
          console.error(`Error deleting channel: ${error}`);
          await interaction.reply({
            content: '❌ There was an error deleting the channel. Please try again.',
            ephemeral: true,
          });
        }
      }
      
    } catch (error) {
      console.log(`There was an error running this command: ${error}`);
    }
  };
  