import dotenv from 'dotenv'
import { Worker } from 'bullmq';
import { splitCommissionsByBroker } from '../service/service.commission.mjs'
import { queueName, jobName } from '../queues/queue.commissionSplitedByBroker.mjs';

dotenv.config()
const redisHost = process.env.REDIS_HOST
const redisPort = process.env.REDIS_PORT



async function splitCommissionsByBrokerProcess() {
await timeout(1000)
    new Worker(queueName, async job => {
        await job.updateProgress(10);
        if (job.name === jobName) {
console.log(`Processing Job ${jobName} with id ${job.id}`);
            await job.updateProgress(50);

            await splitCommissionsByBroker(JSON.stringify(job.data));
            
            await job.updateProgress(80);
        }
await timeout(1000)
        await job.updateProgress(100);
    },
        {
            concurrency: 2 ,
            connection: {
                host: redisHost,
                port: redisPort
            }
        }
    );
}


function timeout(ms) {
    console.log('timout', ms)
    return new Promise(resolve => setTimeout(resolve, ms));
}



export { splitCommissionsByBrokerProcess };

console.log('Worker running');
