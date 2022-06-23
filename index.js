import dot from "dotenv"
import api from './web.js';
import setUpBot from './bot.js'

dot.config()

console.log(process.env.TOKEN, process.env.ENV, process.env.ENV !== 'api')

const bot = process.env.ENV !== 'api' ? setUpBot() : null;

api(bot)
