const { Configuration, OpenAIApi } = require("openai");
const { TextToSpeechClient } = require("@google-cloud/text-to-speech");
const fs = require("fs");
const util = require("util");
const textToSpeechClient = new TextToSpeechClient();
const logger = require("./logger");

const configuration = new Configuration({
  apiKey: process.env.API,
});

const openai = new OpenAIApi(configuration);

// Generate answer from prompt
const getChat = async (text) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: text,
      temperature: 0,
      max_tokens: 500,
    });

    return response.data.choices[0].text;
  } catch (error) {
    console.log(error);
    logger.error("Error while generating Answer");
  }
};

// Convert to standard english
const correctEngish = async (text) => {
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Correct this to standard English: /n${text}`,
      temperature: 0,
      max_tokens: 1000,
    });

    return response.data.choices[0].text;
  } catch (error) {
    logger.error("Error while generating English ");
  }
};
module.exports = {
  openai,

  getChat,
  correctEngish,
};
