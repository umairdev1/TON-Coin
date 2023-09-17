require("dotenv").config();

const { Telegraf } = require("telegraf");
const logger = require("./Helper/logger");
const { getChat } = require("./Helper/functions");
const express = require("express");
const app = express();

const bot = new Telegraf(process.env.TG_API);

// Bot on start

bot.start(async (ctx) => {
  if (ctx.chat.type === "group") {
    logger.info(`Bot started In: ${ctx.chat.title} `);
  } else if (ctx.chat.type === "private") {
    logger.info(`Bot started By ${ctx.chat.username || ctx.chat.first_name} `);
  }

  ctx.reply(
    "Welcome To AI Bot 🧿 \n\nCommands 👾 \n/ask  ask anything from me Contract Devot if you want to report any BUG or change in features"
  );
});

bot.help((ctx) => {
  ctx.reply(
    "\nCommands 👾 \n\n/ask  ask anything from me \n\n\nContract Devot if you want to report any BUG or change in features "
  );
});
//Bot on ask command
bot.command("ask", async (ctx) => {
  const text = ctx.message.text?.replace("/ask", "")?.trim().toLowerCase();

  logger.info(`Chat: ${ctx.from.username || ctx.from.first_name}: ${text}`);

  if (text) {
    ctx.sendChatAction("typing");
    const res = await getChat(text);
    if (res) {
      ctx.telegram.sendMessage(
        ctx.message.chat.id,
        `${res}\n\n\nJoin us on Telegram\nDevot`,
        {
          reply_to_message_id: ctx.message.message_id,
        }
      );
    }
  } else {
    ctx.telegram.sendMessage(
      ctx.message.chat.id,
      "Please ask anything after /ask",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  }
});
//bot scrape
bot.on("message", async (ctx) => {
  logger.info(`message: ${ctx.message.text}`);
  const messageText = ctx.message.text?.toLowerCase();

  // List of keywords to filter
  const keywords = [
    "sarpia",
    "betting game",
    "betting dapp",
    "wallet tracker",
    "influencers",
    "callers",
    "eric cryptoman",
    "jakegagain",
    "scam",
    "honeypot",
    "rug",
    "hidden mint",
    "delayed honeypot",
    "hp",
    "insidor",
    "100x",
    "1000x",
    "10",
    "20×",
    "malicious",
    "code",
    "webdev",
    "utility dev",
    "launching soon",
    "when",
    "launch",
    "wen",
    "safe",
    "safu",
    "buy",
    "shill",
    "admins",
    "skull",
    "skull admins",
    "aeons admins",
    "ermnmusk",
    "elon musk",
    "vitalik",
    "the dev",
    "vitalik.eth",
    "realdogen",
    "insider",
    "kingdom",
    "pow",
    "carnage",
    "venom",
    "utility",
    "matt furie",
    "beeple",
    "whales",
    "giga",
    "twitter",
    "community",
    "dip",
    "entry",
    "shillers",
    "mods",
    "mod",
    "ath",
    "eca",
    "alpha",
    "aeons",
    "private group",
  ];

  const userId = ctx.from.id;

  // Check if the message contains any of the keywords
  const containsKeywords = keywords.some((keyword) =>
    messageText.includes(keyword)
  );

  if (containsKeywords) {
    bot.telegram.sendMessage(userId, ctx.message.text);
  } else {
    // Do nothing for messages that don't match the conditions
  }
});

app.all("/", (req, res) => {
  console.log("Just got a request!");
  res.send("Yo!");
});

app.listen(process.env.PORT || 3000, () => {
  bot.launch();
});
