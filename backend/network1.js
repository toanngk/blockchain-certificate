const crypto = require('crypto'), SHA256 = message => crypto.createHash('sha256').update(message).digest('hex');
const EC = require('elliptic').ec, ec = new EC('secp256k1');
const { Blockchain } = require('./blockchain');
const { getBlockchain, saveBlockchain } = require('./sharedBlockchain');

const privateKey = 'bc997946ac6a2bc99622197a2526b3cc36a23051cee4f3c4beb715134d3285db';
const keyPair = ec.keyFromPrivate(privateKey, 'hex');
const publicKey = keyPair.getPublic('hex'); // 04cc0406e668bd904dcda39550114739fe5364df261ee636ea28f4e4be17da7a6b28e8ba31c0166fc131234b85d6d91f832b0a5a3d53ba68ddb17edb60131dfbef

// Express
const express = require('express');
const app = express();
const cors = require('cors');
const EXPRESS_PORT = 8080;

// WebSocket Server
const WS = require('ws');
const PORT = 8000;
const PEERS = [];
const MY_ADDRESS = `ws://localhost:${PORT}`;
const server = new WS.Server({ port: PORT });

const blockchain = getBlockchain();
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
                blockchain.addData(data);
                break;
            // Ask for adding new block => Add the new block to the chain if valid
            case "TYPE_REPLACE_CHAIN":
                const newBlock = _message.data;
                const tempChain = new Blockchain();
                tempChain.chain = blockchain.chain.concat([newBlock]);
                if (Blockchain.isValid(tempChain)) {
                    blockchain.chain = tempChain.chain;
                    blockchain.pendingData = [];
                }
                break;
            // For new nodes to get the chain
            // Request the chain => Send the chain blocks one by one
            case "TYPE_REQUEST_CHAIN":
                const chainSocket = opened.filter(node => node.address === _message.data)[0].socket;
                for (let i = 0; i < blockchain.chain.length; i++) {
                    chainSocket.send(JSON.stringify(produceMessage(
                        "TYPE_SEND_CHAIN",
                        {
                            block: blockchain.chain[i],
                            finished: i === blockchain.chain.length - 1
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
                        blockchain.chain = tempChain.chain;
                    }
                    tempChain = new Blockchain();
                }
                break;
            // Request the chain pending data => Send the chain pending data
            case "TYPE_REQUEST_INFO":
                opened.filter(node => node.address === _message.data)[0].socket.send(
                    JSON.stringify(produceMessage(
                        "TYPE_SEND_INFO",
                        [blockchain.pendingData]
                    ))
                );
                break;
            // Receive the chain pending data => Add the chain pending data to the blockchain
            case "TYPE_SEND_INFO":
                blockchain.pendingData = _message.data;
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
    res.json(blockchain);
});

app.get('/validate', (req, res) => {
    console.log('Validation requested');
    if (blockchain.pendingData.length !== 0) {
        try {
            blockchain.processPendingData(keyPair);
            saveBlockchain(blockchain);
            const addedBlock = blockchain.getLastBlock();
            sendMessage(produceMessage("TYPE_REPLACE_CHAIN", addedBlock));
            res.json({ message: 'New block added successfully', addedBlock });
        } catch (error) {
            res.json({ message: error.message });
        }
    }
});

app.post('/add', (req, res) => {
    console.log('Data creation requested');
    const newData = req.body;
    console.log(newData);
    if (blockchain.addData(newData)) {
        saveBlockchain(blockchain);
        sendMessage(produceMessage("TYPE_CREATE_DATA", newData));
        res.send({ message: "Data added successfully" });
    } else {
        res.send({ message: "Data is not valid" });
    }
});

console.log(blockchain);