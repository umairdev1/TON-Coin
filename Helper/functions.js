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

// Generate image from prompt
const getImage = async (text) => {
  try {
    const response = await openai.createImage({
      prompt: text,
      n: 1,
      size: "512x512",
    });

    return response.data.data[0].url;
  } catch (error) {
    logger.error("Error while generating image");
  }
};
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
const convertTextToMp3 = async (text) => {
  try {
    const res = await getChat(text);
    if (res) {
      const request = {
        input: { text: res },
        voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
        audioConfig: { audioEncoding: "MP3" },
      };
      const [response] = await textToSpeechClient.synthesizeSpeech(request);
      const fileName = `voice${Date.now()}.mp3`;
      const writeFile = util.promisify(fs.writeFile);
      console.log("Text");
      await writeFile(fileName, response.audioContent, "binary");

      return fileName;
    }
  } catch (error) {
    logger.error("Error while translating ");
  }
};

module.exports = {
  openai,
  getImage,
  getChat,
  correctEngish,
  convertTextToMp3,
};
