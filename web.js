import fastify from 'fastify';
import routes from './API/routes.js';
import swagger from '@fastify/swagger'

const app = fastify()

app.register(swagger, {
  exposeRoute: true,
  routePrefix: "/docs",
  swagger: {
    info: {
      title: 'API swagger',
      description: 'Hi',
      version: '0.6.9'
    },
  }
})

app.register(routes)

function startApp(bot) {
  if (bot) {
    app.post('/' + bot.token, (req, res) => {
      bot.processUpdate(req.body);
      res.code(200).send()
    })
    app.get('/drop', (_, res) => {
      bot.deleteWebhook()
      setTimeout(() => {
        bot.setWebhook(process.env.HEROKU_URL + process.env.TOKEN);
        res.send('restarted')
      }, 5000)
    })
  }

  return app.listen({ port: process.env.PORT || 3333, host: '0.0.0.0' }, function (err, address) {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log('hi @', address)
  })
}

export default startApp;
