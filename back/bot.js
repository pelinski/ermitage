require('dotenv').config();

const axios = require('axios');
const Telegraf = require('telegraf');
const session = require('telegraf/session')
const bot = new Telegraf(process.env.BOT_TOKEN);
const { checkHashed } = require("./lib/hashing");
const User = require("./models/User");

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
});




bot.use(session())
bot.start((ctx) => ctx.reply(`Please log in using /login <username> <password>`))


const state = {
  username: null,
  password: null
}


bot.command('login', async (ctx) => {
  const auth = ctx.message.text.replace("/login ", "").split(" ");
  const username = auth[0];
  const password = auth[1];
  const res = await api.post("/auth/login", { username, password });
  if (res.status == 200) {
    state.username = username;
    state.password = password;
    ctx.reply('You are now logged in')
  } else {
    ctx.reply('Try again')
  }
})



//user telegram id ctx.message.chat.id
bot.launch()