const { model, Schema } = require("mongoose");

module.exports = model("CounterSetup", new Schema({
    GuildID: String,
    Category: String,
    Channel: String,
    Viewers: String,
    Counting: String
  })
);
