import controllers from './controllers.js'

const ping = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
         hello: { type: 'string' }
        }
      }
    }
  },
  handler: controllers.ping
}
const updateAllowance = {
  schema: {
    body: {
      type: 'object',
      required: ['currency', 'value'],
      properties: {
        currency: { type: 'string' },
        value: { type: 'number' },
        personalToken: { type: 'string' },
      },
    },
    response: {
      201: {
        type: 'object',
        items: {
          type: 'object',
          properties: {
            allowance: { type: 'object' },
          },
        },
      },
    },
  },
  handler: controllers.addAllowance
}
const getAllowance = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
         currency: { type: 'string' },
         value: { type: 'number' },
        }
      }
    }
  },
  handler: controllers.getAllowance
}
const addExpenses = {
  schema: {
    body: {
      type: 'object',
      required: ['currency', 'value'],
      properties: {
        currency: { type: 'string' },
        value: { type: 'number' },
        personalToken: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
        items: {
          type: 'object',
          properties: {
            expenses: { type: 'array' },
          },
        },
      },
    },
  },
  handler: controllers.addExpenses,
}
const getExpenses = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          expenses: { type: 'array' },
        }
      }
    }
  },
  handler: controllers.getExpenses
}


export default { ping, updateAllowance, getAllowance, getExpenses, addExpenses };
