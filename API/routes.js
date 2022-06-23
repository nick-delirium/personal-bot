import schema from './schema.js'

async function routes (fastify, options, done) {
  fastify.get('/ping', schema.ping)
  fastify.get('/allowance', schema.getAllowance)
  fastify.post('/allowance', schema.updateAllowance)
  fastify.get('/expenses', schema.getExpenses)
  fastify.post('/expenses', schema.addExpenses)
  done()
}

export default routes
