require("dotenv").config();
const { Telegraf } = require("telegraf");
const { default: axios } = require("axios");
const logger = require("./Helper/logger");
const express = require("express");
const app = express();

const bot = new Telegraf(process.env.TG_API);

// Bot on start
bot.start((ctx) => {
  console.log("Group Chat ID:", ctx.chat.id);
});
bot.start(async (ctx) => {
  if (ctx.chat.type === "group") {
    logger.info(`Bot started In: ${ctx.chat.title} `);
  } else if (ctx.chat.type === "private") {
    logger.info(`Bot started By ${ctx.chat.username || ctx.chat.first_name} `);
  }

  ctx.reply(
    "Welcome To AI Bot 🧿 \n\nCommands 👾 \n/ask  ask anything from me \n/image to create image from text  \n/en to correct your grammer \n\n\nContract PePe CEO if you want to report any BUG or change in features"
  );
});

bot.help((ctx) => {
  ctx.reply(
    "\nCommands 👾 \n\n/ask  ask anything from me \n/image to create image from text  \n/en to correct your grammer \n\n\nContract PePe CEO if you want to report any BUG or change in features "
  );
});

const fetchDataAndSendMessage = async () => {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://app.geckoterminal.com/api/p1/ton/pools?include=dex%2Cdex.network%2Cdex.network.network_metric%2Ctokens&page=1&include_network_metrics=true",
    headers: {
      authority: "app.geckoterminal.com",
      accept: "application/json, text/plain, */*",
      "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
      "if-none-match": 'W/"fc1e484453b45fa89f986b48bb7e9be3"',
      origin: "https://www.geckoterminal.com",
      referer: "https://www.geckoterminal.com/",
      "sec-ch-ua":
        '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
  };

  axios
    .request(config)
    .then((response) => {
      const pools = response.data.data; // Take only the first 10 pools
      for (let index = 0; index < pools.length; index++) {
        const pool = pools[index];
        const message = `🪙 *${
          pool.attributes.name
        }*\n👉 *Price:* $${parseFloat(pool.attributes.price_in_usd).toFixed(
          7
        )}\n👉 *5M:* ${parseFloat(
          pool.attributes.price_percent_changes.last_5m
        ).toFixed(2)}%\n👉 *1H:* ${parseFloat(
          pool.attributes.price_percent_changes.last_1h
        ).toFixed(2)}%\n👉 *6H:* ${parseFloat(
          pool.attributes.price_percent_changes.last_6h
        ).toFixed(2)}%\n👉 *24H:* ${parseFloat(
          pool.attributes.price_percent_changes.last_24h
        ).toFixed(2)}%

        `;
        setTimeout(() => {
          bot.telegram.sendMessage("-1002128903978", message, {
            parse_mode: "Markdown",
          });
        }, index * 1 * 60 * 1000);
        // // Send each message individually to the Telegram group
        // bot.telegram.sendMessage("-1002128903978", message, {
        //   parse_mode: "Markdown",
        // });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};
const interval = 1 * 60 * 1000;
fetchDataAndSendMessage();
// setInterval(fetchDataAndSendMessage, interval);

app.all("/", (req, res) => {
  console.log("Just got a request!");
  bot.telegram.sendMessage(
    "-1002128903978",
    `Join us on Telegram\nPePe CEO https://www.geckoterminal.com/_next/image?url=https%3A%2F%2Fassets.geckoterminal.com%2F4dvjymidf47elezccjd0zxvobd1l&w=32&q=75`
  );

  res.send("Yo!");
});
bot
  .launch()
  .then(() => {
    console.log("Bot started");
  })
  .catch((err) => {
    console.error("Error starting bot:", err);
  });
app.listen(process.env.PORT || 3000, () => {});
