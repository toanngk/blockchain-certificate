const crypto = require('crypto'), SHA256 = message => crypto.createHash('sha256').update(message).digest('hex');
const EC = require('elliptic').ec, ec = new EC('secp256k1');
const { parse } = require('path');
const { Block, Blockchain, TheChain } = require('./blockchain');

const privateKey = 'd0351a52b188b5df78e71ab94a05ee61010cccc89b758c13605595b271fd675d';
const keyPair = ec.keyFromPrivate(privateKey, 'hex');
const publicKey = keyPair.getPublic('hex'); // 04220372613e4ea03ebe26b71526c3e5e67a7c8cc4fe15cf4fd46fd5d7be641848111e8053d225c9954c1a1a64489243420d774cca1328fe0ec609ac71ddb079a0

// Express
const express = require('express');
const app = express();
const cors = require('cors');
const EXPRESS_PORT = 8081;

// WebSocket Server
const WS = require('ws');
const PORT = 8001;
const PEERS = ['ws://localhost:8000'];
const MY_ADDRESS = `ws://localhost:${PORT}`;
const server = new WS.Server({ port: PORT });

let opened = [], connected = [];

console.log(`Node is listening on port ${PORT}...`);

server.on('connection', async (socket, req) => {
    socket.on('message', message => {
        const _message = JSON.parse(message);
        // When a message is received, check the type of message
        switch (_message.type) {
            // Ask for handshake => Connect to new node
            case "TYPE_HANDSHAKE":
                const nodes = _message.data;
                nodes.forEach(node => connect(node));
                break;
            // Ask for adding new data => Add data to the blockchain pending data
            case "TYPE_CREATE_DATA":
                const data = _message.data;
                TheChain.addData(data);

                break;
            // Ask for adding new block => Add the new block to the chain if valid
            case "TYPE_REPLACE_CHAIN":
                const newBlock = _message.data;
                const tempChain = new Blockchain();
                tempChain.chain = TheChain.chain.concat([newBlock]);
                if (Blockchain.isValid(tempChain)) {
                    TheChain.chain = tempChain.chain;
                    TheChain.pendingData = [];
                }
                break;
            // For new nodes to get the chain
            // Request the chain => Send the chain blocks one by one
            case "TYPE_REQUEST_CHAIN":
                const chainSocket = opened.filter(node => node.address === _message.data)[0].socket;
                for (let i = 0; i < TheChain.chain.length; i++) {
                    chainSocket.send(JSON.stringify(produceMessage(
                        "TYPE_SEND_CHAIN",
                        {
                            block: TheChain.chain[i],
                            finished: i === TheChain.chain.length - 1
                        }
                    )));
                }
                break;
            // Receive the blocks => Add the blocks to the blockchain one by one
            case "TYPE_SEND_CHAIN":
                const { block, finished } = _message.data;
                if (!finished) {
                    tempChain.chain.push(block);
                } else {
                    tempChain.chain.push(block);
                    if (Blockchain.isValid(tempChain)) {
                        TheChain.chain = tempChain.chain;
                    }
                    tempChain = new Blockchain();
                }
                break;
            // Request the chain pending data => Send the chain pending data
            case "TYPE_REQUEST_INFO":
                opened.filter(node => node.address === _message.data)[0].socket.send(
                    JSON.stringify(produceMessage(
                        "TYPE_SEND_INFO",
                        [TheChain.pendingData]
                    ))
                );
                break;
            // Receive the chain pending data => Add the chain pending data to the blockchain
            case "TYPE_SEND_INFO":
                TheChain.pendingData = _message.data;
                break;
        }
    });
    socket.send(JSON.stringify(produceMessage("TYPE_HANDSHAKE", [MY_ADDRESS])));
});

async function connect(address) {
    if (!connected.find(peerAddress => peerAddress === address) && address !== MY_ADDRESS) {
        const socket = new WS(address);
        socket.on('open', () => {
            socket.send(JSON.stringify(produceMessage("TYPE_HANDSHAKE", [MY_ADDRESS, ...connected])));

            opened.forEach(node => node.socket.send(JSON.stringify(produceMessage("TYPE_HANDSHAKE", [address]))));

            if (!opened.find(peer => peer.address === address) && address !== MY_ADDRESS) {
                opened.push({ socket, address });
            }

            if (!connected.find(peerAddress => peerAddress === address) && address !== MY_ADDRESS) {
                connected.push(address);
            }
            opened.forEach(node => node.socket.send(JSON.stringify(produceMessage("TYPE_HANDSHAKE", [address]))));
        });

        socket.on('close', () => {
            opened.splice(connected.indexOf(address), 1);
            connected.splice(connected.indexOf(address), 1);
        });
    }
}

function produceMessage(type, data) {
    return { type, data };
}

function sendMessage(message) {
    opened.forEach(node => {
        node.socket.send(JSON.stringify(message));
    })
}

process.on('uncaughtException', (err) => console.log('Uncaught exception:', err));

PEERS.forEach(peer => connect(peer));

// Express
app.use(cors());
app.use(express.json());

app.listen(EXPRESS_PORT, () => {
    console.log(`Server is listening on port ${EXPRESS_PORT}...`);
})

app.get('/chain', (req, res) => {
    console.log('Chain requested');
    res.json(TheChain);
});

app.get('/validate', (req, res) => {
    console.log('Validation requested');
    if (TheChain.pendingData.length !== 0) {
        TheChain.processPendingData(keyPair);
        const addedBlock = TheChain.getLastBlock();
        sendMessage(produceMessage("TYPE_REPLACE_CHAIN", addedBlock));
        res.json({ message: 'New block added successfully', addedBlock });
    } else {
        res.send({ message: 'No block added' });
    }
});

app.post('/add', (req, res) => {
    console.log('Data creation requested');
    const newData = req.body;
    console.log(newData);
    if (TheChain.addData(newData)) {
        sendMessage(produceMessage("TYPE_CREATE_DATA", newData));
        res.send({ message: "Data added successfully" });
    } else {
        res.send({ message: "Data is not valid" });
    }
});

// // --------------------------------------------------
// // EXAMPLE USAGE
// // Add data periodically and check for processing
// setInterval(() => {
//     const newData = {
//         "id": Math.floor(Math.random() * 100000),
//         "name": "Random Name",
//         "course": "Blockchain Fundamentals",
//         "grade": Math.floor(Math.random() * 100),
//         "issuer": "University of Blockchain",
//         "issueDate": new Date().toISOString().split('T')[0]
//     };
//     TheChain.addData(newData);
//     sendMessage(produceMessage("TYPE_CREATE_DATA", newData));
//     printBlockchain();
// }, 3000);

// setInterval(() => {
//     printBlockchain();
// }, 10000);

// function printBlockchain() {
//     process.stdout.write('\x1Bc')
//     console.log(`Port: ${PORT}`);
//     console.log(TheChain);
// }

// // Add new block to the chain every 10 seconds if there is pending data
// setInterval(() => {
//     if (TheChain.pendingData.length !== 0) {
//         TheChain.processPendingData(keyPair);
//         sendMessage(produceMessage("TYPE_REPLACE_CHAIN", TheChain.getLastBlock()));
//     }
//     printBlockchain();
// }, 10000);

// function printBlockchain() {
//     process.stdout.write('\x1Bc');
//     console.log(`Port: ${PORT}`);
//     console.log(TheChain);
// }