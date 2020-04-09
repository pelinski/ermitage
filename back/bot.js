require('dotenv').config();

const axios = require('axios');
const Telegraf = require('telegraf');
const Markup = require("telegraf/markup")
const session = require('telegraf/session');
const bot = new Telegraf(process.env.BOT_TOKEN);

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true
});



bot.use(session())
bot.start((ctx) => { ctx.reply(`log in using /login <username> <password>`) })
const state = {
  index: 0
}


bot.command('login', async (ctx) => {
  const auth = ctx.message.text.replace("/login ", "").split(" ");
  const username = auth[0];
  const password = auth[1];
  const res = await api.post("/auth/login", { username, password });
  if (res.status == 200) {
    ctx.session.user = res.data.user;
    console.log(ctx.session)
    ctx.reply('You are now logged in.')
  } else {
    ctx.reply('Try again')
  }
})

bot.command("get_folders", async (ctx) => {
  console.log("getfolders")
  const res = await api.get("/dashboard/folders", { headers: { user: ctx.session.user } });
  console.log("res", res.data);
})

bot.launch()

//user telegram id ctx.message.chat.id
