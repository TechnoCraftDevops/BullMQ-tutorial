
import express from 'express';
import bodyParser from 'body-parser';
import { ExpressAdapter, createBullBoard, BullMQAdapter } from '@bull-board/express';
import { addSplitCommissionsByBrokerJob, splitCommissionsByBrokerQueue } from './src/queues/queue.commissionSplitedByBroker.mjs';
import { splitCommissionsByBrokerProcess } from './src/process/process.commissionSplitedByBroker.mjs';
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const redisHost = process.env.REDIS_HOST
const queueManagerPort = process.env.QUEUE_MANAGER_PORT


app.use(bodyParser.json());


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/getCommissionsData', (req, res) => {
  addSplitCommissionsByBrokerJob(req.body)
  splitCommissionsByBrokerProcess()
  res.send('je m\'en occupe ')

})

/**
 * Bull-Board Express
 */
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/ui');

createBullBoard({
  queues: [
    new BullMQAdapter(splitCommissionsByBrokerQueue)
  ],
  serverAdapter,
});

app.use('/ui', serverAdapter.getRouter());

app.listen(queueManagerPort, () => {
  console.log(`Queue Manager app listening on port ${queueManagerPort}`)
})