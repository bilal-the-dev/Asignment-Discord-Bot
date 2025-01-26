# Assignment Management Discord Bot

This Discord bot is designed to assist in managing assignments within a Discord server. It allows admins to create dedicated channels for each assignment, where users can submit assignments and discuss them in threads. The bot also enables admins to delete channels once assignments are complete, keeping the server organized.

### Features:
1. **Create Assignment Channel**: Admins can use the `/assignment_create [channel]` command to create a channel for a new assignment.
2. **Interactive Buttons**: 
   - **Submit Assignment**: This button creates a thread under the assignment channel where users can discuss the assignment with admins.
   - **Delete Channel**: This button allows admins to delete the channel once the assignment is complete.
3. **User Input via Modal**: Upon clicking the button, the user is prompted to input the **title**, **description**, and **channel name** for the new assignment.

---

## Table of Contents

- [Project Description](#project-description)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Bot Commands](#bot-commands)
- [Configuration](#configuration)
- [Running the Bot](#running-the-bot)
- [License](#license)
- [How to Create the README File](#how-to-create-the-readme-file)
- [Adding .env to the Project](#adding-env-to-the-project)

---

## Project Description

The **Assignment Management Discord Bot** helps streamline the process of managing assignments within a Discord server. It automates the creation of channels for each new assignment, sends detailed assignment descriptions, and allows admins to manage submission processes through a well-structured button interaction system.

### Flow:
1. Admins create an assignment by using `/assignment_create [channel]`.
2. The bot prompts the admin for a title, description, and the channel name via a modal.
3. Once the information is submitted, the bot creates a channel with the specified name.
4. Inside that channel, the bot sends an embed with the assignment details and two buttons: "Submit Assignment" and "Delete Channel".
5. If the user clicks **Submit Assignment**, a thread is created in the channel for discussion.
6. If an admin clicks **Delete Channel**, the assignment channel is deleted to keep the server clean.

---

## Prerequisites

Before you begin, ensure that you have met the following requirements:

- **Node.js** (version 16 or above)
- **npm** (Node Package Manager)
- **A Discord bot token** from the [Discord Developer Portal](https://discord.com/developers/applications)
- **A Discord server** where you can test the bot
- **Admin privileges** on the server to manage channels

---

## Installation

1. **Clone the Repository**:
   Clone the bot repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/assignment-bot.git
