const crypto = require('crypto'), SHA256 = message => crypto.createHash('sha256').update(message).digest('hex');
const EC = require('elliptic').ec, ec = new EC('secp256k1');
const { Blockchain } = require('./blockchain');
const { getBlockchain, saveBlockchain } = require('./sharedBlockchain');

const privateKey = 'd0351a52b188b5df78e71ab94a05ee61010cccc89b758c13605595b271fd675d';
const keyPair = ec.keyFromPrivate(privateKey, 'hex');
const publicKey = keyPair.getPublic('hex'); // 04220372613e4ea03ebe26b71526c3e5e67a7c8cc4fe15cf4fd46fd5d7be641848111e8053d225c9954c1a1a64489243420d774cca1328fe0ec609ac71ddb079a0

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const EXPRESS_PORT = 8081;

// WebSocket Server
const WS = require('ws');
const PORT = 8001;
const PEERS = ['ws://localhost:8000'];
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
app.use(bodyParser.json());

const con = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'Aye12345',
    database: 'UniversityDB'
});

con.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

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

// SignIn API
app.post('/signin', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM Users WHERE Username = ?';
    con.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }

        if (results.length === 0) {
            console.error('No user found with the provided username');
            res.status(401).send('Invalid username');
            return;
        }

        const user = results[0];

        if (password !== user.Password) {
            console.error('Password does not match');
            res.status(401).send('Invalid password');
            return;
        }

        // Include user role in the response
        res.status(200).send({ message: 'Sign in successful', user: { username: user.Username, role: user.Role } });
    });
});


// SignUp API
app.post('/signup', (req, res) => {
    const { username, fullName, password, role } = req.body;

    // Check if the username already exists
    const checkUserSql = 'SELECT * FROM Users WHERE Username = ?';
    con.query(checkUserSql, [username], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }

        if (results.length > 0) {
            console.error('User already exists');
            res.status(409).send('User already exists');
            return;
        }

        // Create a new user
        const createUserSql = 'INSERT INTO Users (Username, FullName, Password, Role) VALUES (?, ?, ?, ?)';
        con.query(createUserSql, [username, fullName, password, role], (err, result) => {
            if (err) {
                console.error('Error creating user:', err);
                res.status(500).send('Error creating user');
                return;
            }
            console.log('User created successfully');
            res.status(201).send('User created successfully');
        });
    });
});

app.post('/addStudent', (req, res) => {
    const { studentId, fullName } = req.body;

    // Insert new student into Student table
    const sql = 'INSERT INTO Student (StudentID, FullName) VALUES (?, ?)';
    con.query(sql, [studentId, fullName], (err, result) => {
        if (err) {
            console.error('Error adding student:', err);
            res.status(500).send('Error adding student');
            return;
        }
        console.log('Student added successfully');
        res.status(201).json({ message: 'Student added successfully' });
    });
});

app.get('/getLastBlockHash', (req, res) => {
    try {
        const lastBlockHash = getLastBlockHash();
        res.json({ lastBlockHash });
    } catch (error) {
        console.error('Error fetching last block hash:', error);
        res.status(500).json({ error: 'Failed to retrieve last block hash' });
    }
});

app.post('/addSemester', (req, res) => {
    const { currentHash } = req.body;

    // Insert currentHash into Semester table
    const sql = 'INSERT INTO Semester (BlockchainId) VALUES (?)';
    con.query(sql, [currentHash], (err, result) => {
        if (err) {
            console.error('Error adding semester data:', err);
            res.status(500).json({ message: 'Error adding semester data' });
            return;
        }
        console.log('Semester data added successfully');
        res.status(201).json({ message: 'Semester data added successfully' });
    });
});

console.log(blockchain);