const fs = require('fs');
const { Blockchain } = require('./blockchain');

const FILE_NAME = 'blockchain.json';

function getBlockchain() {
    let blockchain;
    try {
        const data = fs.readFileSync(FILE_NAME, 'utf8');
        const parsedData = JSON.parse(data);

        // Create a new instance of Blockchain and copy properties
        blockchain = new Blockchain();
        blockchain.chain = parsedData.chain;
        blockchain.pendingData = parsedData.pendingData;
    } catch (err) {
        blockchain = new Blockchain();
    }
    return blockchain;
}

function saveBlockchain(blockchain) {
    fs.writeFileSync(FILE_NAME, JSON.stringify(blockchain));
}

function initializeBlockchain() {
    const blockchain = new Blockchain();
    if (!fs.existsSync(FILE_NAME) || fs.readFileSync(FILE_NAME, 'utf8') === '') {
        saveBlockchain(blockchain);
    }
}

initializeBlockchain();

module.exports = { getBlockchain, saveBlockchain };