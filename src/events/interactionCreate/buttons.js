const {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  MessageFlags,
} = require("discord.js");

const {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} = require("@aws-sdk/client-dynamodb");

const dynamoDbClient = new DynamoDBClient();

module.exports = async (client, interaction) => {
  try {
    // Check if the interaction is a button click
    if (
      interaction.isButton() &&
      interaction.customId === "assignment_create"
    ) {
      // Create a modal
      const modal = new ModalBuilder()
        .setCustomId("assignment_modal")
        .setTitle("Create Your Assignment");

      // Create text input fields
      const titleInput = new TextInputBuilder()
        .setCustomId("title")
        .setLabel("Title")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Enter the title of your assignment")
        .setRequired(true);

      const channelName = new TextInputBuilder()
        .setCustomId("channelName")
        .setLabel("Channel Name")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Write the channel name that bot will create!")
        .setRequired(true);

      const descriptionInput = new TextInputBuilder()
        .setCustomId("description")
        .setLabel("Description")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Enter a brief description of your assignment")
        .setRequired(true);

      // Add inputs to action rows
      const titleRow = new ActionRowBuilder().addComponents(titleInput);
      const descriptionRow = new ActionRowBuilder().addComponents(
        descriptionInput
      );

      const channelNameRow = new ActionRowBuilder().addComponents(channelName);

      // Add action rows to the modal
      modal.addComponents(titleRow, descriptionRow, channelNameRow);

      // Show the modal to the user
      await interaction.showModal(modal);
    } else if (
      interaction.isButton() &&
      interaction.customId === "submit_assignment"
    ) {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });

      const { channel, user } = interaction;

      const input = {
        TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
        Key: {
          channelId: {
            S: channel.id,
          },
          userId: {
            S: user.id,
          },
        },
      };
      const command = new GetItemCommand(input);
      const response = await dynamoDbClient.send(command);

      if (response.Item)
        return await interaction.editReply(
          `❌ You have a already created thread, please use that https://discord.com/channels/${response.Item.channelId.S}/${response.Item.threadId.S}`
        );

      const thread = await channel.threads.create({
        name: user.displayName,
        autoArchiveDuration: 1440,
        reason: "Assignment visibility thread created",
      });

      const mm = await thread.fetchStarterMessage();
      await mm.delete();

      const putInput = {
        TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
        Item: {
          channelId: {
            S: channel.id,
          },
          userId: {
            S: user.id,
          },
          threadId: {
            S: thread.id,
          },
        },
      };
      const putCommand = new PutItemCommand(putInput);
      const putResponse = await dynamoDbClient.send(putCommand);

      if (putResponse.$metadata.httpStatusCode !== 200)
        return await interaction.editReply(
          "Something went wrong, please try creating another thread"
        );

      await thread.send({
        content: `📝 ${interaction.user} here is your thread for discussions regarding the assignment.`,
      });

      await interaction.editReply(`✅ A thread has been created.`);
    } else if (
      interaction.isButton() &&
      interaction.customId === "delete_button"
    ) {
      const member = interaction.member;
      if (!member.permissions.has("Administrator")) {
        return await interaction.reply({
          content: "❌ Only admins can delete this channel.",
          ephemeral: true,
        });
      }

      const channel = interaction.channel;

      await channel.delete("Channel deleted by the delete button");
      console.log(`Channel "${channel.name}" was deleted successfully.`);
    }
  } catch (error) {
    console.log(error);
  }
};
