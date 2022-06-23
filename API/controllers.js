import { join, dirname } from 'path'
import { Low, JSONFile } from 'lowdb'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));

// db setup
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)
await db.read()
const defaultData =  { budget: { allowance: { currency: '', value: 0 }, expenses: [] } }
db.data = db.data || defaultData

const getData = async () => {
  await db.read()

  const data = db.data

  return data
}

const ping = (_, res) => res.send({ hello: 'world' })

const addAllowanceWorker = async (newAllowance) => {
  db.data.budget.allowance = newAllowance;
  try {
    await db.write()
  } catch (e) {
    console.log(e)
    return false;
  }

  return true;
}
const addAllowance = async (req, res) => {
  const { value, currency } = req.body;
  const personalToken = req.body.personalToken;

  if (personalToken !== process.env.PERSONAL_TOKEN) {
    return res.code(401).send('Wrong personal token')
  }

  await addAllowanceWorker({ value, currency })

  res.send({ allowance: db.data.budget.allowance })
}

const getAllowanceWorker = async () => {
  const { budget: { allowance }} = await getData()

  console.log(allowance, await getData())
  return allowance;
}
const getAllowance = async (_, res) => {
  const allowance = await getAllowance();

  res.send(allowance)
}

const getExpensesWorker = async () => {
  const { budget: { expenses }} = await getData()

  return expenses;
}
const getExpenses = async (_, res) => {
  const expenses = await getExpensesWorker();

  res.send(expenses)
}

const addExpensesWorker = async (newExpenses) => {
  db.data.budget.expenses = newExpenses;
  try {
    await db.write()
  } catch (e) {
    console.log(e)
    return false;
  }
}
const addExpenses = async (req, res) => {
  const { value, currency } = req.body;
  const personalToken = req.body.personalToken;

  if (personalToken !== process.env.PERSONAL_TOKEN) {
    return res.code(401).send('Wrong personal token')
  }

  await addExpensesWorker({ value, currency })

  res.send({ expenses: db.data.budget.expenses })
}

export default {
  ping,
  addAllowance,
  getAllowance,
  addAllowanceWorker,
  getAllowanceWorker,
  addExpenses,
  getExpenses,
  addExpensesWorker,
  getExpensesWorker,
}
