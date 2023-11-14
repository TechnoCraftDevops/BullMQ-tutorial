import dotenv from 'dotenv';
import { Queue } from 'bullmq';

dotenv.config();
const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;
const queueName = 'split-commissions-by-broker';
const jobName = 'create_slpited_commissions_file';

const splitCommissionsByBrokerQueue = new Queue(queueName, {
    connection: {
        host: redisHost,
        port: redisPort
    }
});

async function addSplitCommissionsByBrokerJob(commissionData) {
    for (const crId in commissionData) {
        await splitCommissionsByBrokerQueue.add(
            jobName,
            {
                title: `Generate commision of ${crId}`,
                crId: crId,
                commissionOfContracts: commissionData[crId]
            },
            {
                lifo: true
                // delay: 10000,
                // removeOnComplete: true,
                // removeOnFail: true
            }
        );
    };
}
console.log('split-commissions-by-broker-queue running');

export { addSplitCommissionsByBrokerJob, splitCommissionsByBrokerQueue, queueName, jobName };
