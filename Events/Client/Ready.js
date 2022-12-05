const { mongooseConnectionString } = require("../../Structures/config");
const { Client } = require("discord.js");
const mongoose = require("mongoose");

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} client
   */
  async execute(client) {
    // Connect to DB
    mongoose.connect(mongooseConnectionString, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
      console.log("Connected to MongoDB!");
    }).catch(console.error);

    console.log(`Ready! Logged in as ${client.user.tag}`); //Let us know that the bot is online.

    // All our cronjobs
    require('../../Structures/cronjobs')(client);
  }
}
