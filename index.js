const tmi = require("tmi.js");
const fs = require("fs");

require("dotenv").config();

const config = {
  identity: {
    username: process.env.BOT_NAME,
    password: process.env.TOKEN,
  },
  channels: [process.env.CHANNEL_NAME],
};

let motivosBan = [];
let saudacoes = [];
let mensagens = [];

try {
  const data = fs.readFileSync("motivosBan.txt", "UTF-8");

  const lines = data.split(/\r?\n/);

  lines.forEach((line) => {
    motivosBan.push(line);
  });
} catch (err) {
  console.error(err);
}

try {
  const data = fs.readFileSync("saudacoes.txt", "UTF-8");

  const lines = data.split(/\r?\n/);

  lines.forEach((line) => {
    saudacoes.push(line);
  });
} catch (err) {
  console.error(err);
}

try {
  const data = fs.readFileSync("mensagens.txt", "UTF-8");

  const lines = data.split(/\r?\n/);

  lines.forEach((line) => {
    mensagens.push(line);
  });
} catch (err) {
  console.error(err);
}

function mensagemChegou(target, context, message, isBot) {
  if (isBot) {
    return;
  }

  const username = context.username;
  let [commandName, argument] = message.trim().split(" ");

  if (saudacoes.includes(commandName.toLowerCase())) {
    argument = argument.replace("@", "");
    argument = argument.toLowerCase();

    if (argument == process.env.BOT_NAME) {
      const index = Math.floor(Math.random() * mensagens.length);

      const mensagem = mensagens[index];
      client.say(target, `/me  ${username} ${mensagem}`);
    }
  }

  switch (commandName) {
    case "!twitter":
      client.say(target, "/me twitter.com/pixlrose");
      break;
    case "!ban":
      if (argument) {
        const index = Math.floor(Math.random() * motivosBan.length);

        const motivo = motivosBan[index];

        client.say(target, `/me ${username} baniu ${argument} por ${motivo}!`);
      } else {
        client.say(target, `/me ${username} marque alguem!`);
      }
      break;
    default:
      break;
  }
}

function enteredTheChat(address, port) {
  console.log(`* Bot entrou no endereço ${address}:${port}`);
}

const client = new tmi.client(config);

client.on("message", mensagemChegou);
client.on("connected", enteredTheChat);

client.connect();
