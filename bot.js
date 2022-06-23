const token = process.env.TOKEN
import fetch from 'node-fetch';
import controllers from './API/controllers.js';

import Bot from 'node-telegram-bot-api';
let bot;

function setUpBot() {
  if (process.env.NODE_ENV === 'production') {
    bot = new Bot(token);
    bot.setWebHook(process.env.HEROKU_URL + bot.token);
  } else {
    bot = new Bot(token, {
      polling: true
    });
  }

  bot.onText(/\/recipe/, msg => {
    fetch('https://www.themealdb.com/api/json/v1/12953/random.php')
    .then(response => response.json())
    .then(response => {
            let meal   = response.meals[0],
                tags   = meal.strTags,
                name   = meal.strMeal,
                area   = meal.strArea,
                recipe = meal.strInstructions,
                ingredients = []
            for (let i = 1;; i++) {
              if(i > 100 || meal['strIngredient'+i] == '' || meal['strIngredient'+i] == undefined) {break;}
              ingredients.push(
                {
                  ingredient: meal['strIngredient'+i],
                  measure: meal['strMeasure'+i]
                }
              );
            }
            ingredients = ingredients.map(item => {
              item = item.measure+' of '+item.ingredient
              return item;
            })
            let answer = name+'\n'+tags+'\n'+area+'\n\n'+recipe+'\n\nYou will need:\n'+ingredients;

            bot.sendMessage(msg.chat.id, answer).then(() => console.log('reciped!'))
          })

    })

  bot.onText(/\/витя/, (msg) => {
    let num = Math.round(Math.random()),
      text = num == 1 ? 'Витя пидор' : 'Витя не пидор';
    bot.sendMessage(msg.chat.id, text + ' ' + num).then(() => {
      // reply sent!
    });
  })

  bot.onText(/\/pidor/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Витя пидор!').then(() => {
      // reply sent!
    });
  });

  bot.onText(/\/wi/, msg => {
    fetch(`https://api.darksky.net/forecast/${process.env.WEATHER_TOKEN}/59.9271281,30.2498491?lang=ru&units=auto`)
      .then(res => res.json())
      .then(response => {
        let forecast = response.currently.summary.toLowerCase();
        let temp = response.currently.temperature;
        temp = Math.round(parseFloat(temp));
        let futurecast = response.hourly.summary;
        let daily = response.daily.summary;
        let str = "Привет! Вот твой прогноз: \nСегодня будет " + temp + "°С.  и " + forecast + ". \n" + futurecast + "\n" + "\nА вот, что нам несёт неделька: " + daily;
        bot.sendMessage(msg.chat.id, str).then(console.log('yay')).catch(error => console.log(error));
      })
      .catch(error => console.log(error))
  });


  bot.onText(/\/ping/, msg => {
    let str = 'Your ID is '+msg.chat.id
    bot.sendMessage(msg.chat.id, str)
  })

  bot.onText(/\/cat/, msg => {
    let cat = '';
    function getCat() {
      fetch('http://aws.random.cat/meow')
        .then(res => res.json())
        .then(response => {
            cat = response.file;
            if(cat.toString().includes('.gif')) {
              bot.sendDocument(msg.chat.id, cat.toString()).catch(e => console.log(e))
            }
            else {
              bot.sendPhoto(msg.chat.id, cat.toString()).catch(e => console.log(e))
            }
        })
        .catch(error => {
          bot.sendMessage(msg.chat.id, 'Этот котик убежал, но я уже ищу ещё!')
          getCat()
        })
    }
    bot.sendMessage(msg.chat.id, 'Ищем котика...').then(console.log('yay')).catch(e => bot.sendMessage(msg.chat.id, e));
    getCat();
  })

  bot.onText(/\/doge/, msg => {
    let dogeApi = 'http://shibe.online/api/shibes?count=1&urls=true&httpsUrls=false';
    function getDog() {
      fetch(dogeApi)
        .then(res => res.json())
        .then(response => {
          const dog = response[0]
          bot.sendPhoto(msg.chat.id, dog.toString()).catch(e => console.log(e))
        })
        .catch(e => {console.log(e) })
    }
    bot.sendMessage(msg.chat.id, 'Ищем доги...').then(() => console.log('yay'))
    getDog();
  })

  bot.onText(/\/ифу/, msg => {
    bot.sendMessage(msg.chat.id, '@Argon4ik - пиздюк').then(() => console.log('yay'))
  })

  bot.onText(/\/waifu/, msg => {
    bot.sendMessage(msg.chat.id, 'Ищем тянку...')
    fetch('https://api.waifu.pics/sfw/waifu')
    .then(r => r.json())
    .then(r => {
      const waifu = r.url;
      bot.sendPhoto(msg.chat.id, waifu);
    })
  })

  bot.onText(/\/baka/, msg => {
    fetch('https://api.catboys.com/baka')
    .then(r => r.json())
    .then(r => {
      if (r.url === '') return;
      const baka = r.url;
      bot.sendAnimation(msg.chat.id, baka);
    })
  })

  bot.onText(/\/орда/, msg => {
    bot.sendPhoto(msg.chat.id, 'https://i.imgur.com/5JGqonF.png')
    bot.sendMessage(msg.chat.id, '@Argon4ik @qqtred @Requiemma @No_Dodgy @evankrei @Seetr24 играть')
  })

  bot.onText(/\/allowance/, async msg => {
    const [, value, currency, token] = msg.text.split(' ')
    const string = (value, currency) => `Ваш лимит: ${value} ${currency}`

    if (!value || !currency) {
      const { currency, value } = await controllers.getAllowanceWorker()
      return bot.sendMessage(msg.chat.id, string(value, currency))
    } else if (token === process.env.PERSONAL_TOKEN) {
      const result = await controllers.addAllowanceWorker({value, currency})
      return  bot.sendMessage(msg.chat.id, result ? string(value, currency) : 'Что-то пошло не так')
    }

    return bot.sendMessage(msg.chat.id, 'Нет доступа')
  })

  console.log('Bot server started in the ' + process.env.NODE_ENV + ' mode')
  return bot
}

export default setUpBot
