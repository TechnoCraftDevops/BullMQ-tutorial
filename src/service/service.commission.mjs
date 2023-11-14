import fs from 'fs'

async function splitCommissionsByBroker(data) {
    const dataToStore = JSON.parse(data)
    fs.writeFile(`../result/${dataToStore.crId}.json`, data, err => {
        if (err) {
            console.error(err);
            throw (err.message)
        }
    });
}


export { splitCommissionsByBroker };