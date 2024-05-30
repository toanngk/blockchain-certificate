const crypto = require('crypto'), SHA256 = message => crypto.createHash('sha256').update(message).digest('hex');
const EC = require('elliptic').ec, ec = new EC('secp256k1');

const VALIDATORS = [
    '04cc0406e668bd904dcda39550114739fe5364df261ee636ea28f4e4be17da7a6b28e8ba31c0166fc131234b85d6d91f832b0a5a3d53ba68ddb17edb60131dfbef', // Network1
    '04220372613e4ea03ebe26b71526c3e5e67a7c8cc4fe15cf4fd46fd5d7be641848111e8053d225c9954c1a1a64489243420d774cca1328fe0ec609ac71ddb079a0' // Network2
];

class Block {
    constructor(timestamp = "", data = [], validator = "") {
        this.timestamp = timestamp;
        this.data = data;
        this.hash = Block.getHash(this);
        this.prevHash = "";
        this.validator = validator;
        this.signature = "";
    }

    static getHash(block) {
        return SHA256(JSON.stringify(block.data) + block.timestamp + block.prevHash + block.validator);
    }

    signBlock(signingKey) {
        if (signingKey.getPublic('hex') !== this.validator) {
            throw new Error('You cannot sign this block!');
        }

        const hash = Block.getHash(this);
        this.signature = signingKey.sign(hash, 'base64').toDER('hex');
    }

    static hasValidSignature(block) {
        if (!block.signature || !block.validator) return false;

        const publicKey = ec.keyFromPublic(block.validator, 'hex');
        return publicKey.verify(Block.getHash(block), block.signature);
    }

}

class Blockchain {
    constructor() {
        this.chain = [new Block(new Date().toISOString(), "Genesis Block", VALIDATORS[0])];
        this.pendingData = [];
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock, validatorKey) {
        newBlock.prevHash = this.getLastBlock().hash;
        newBlock.hash = Block.getHash(newBlock);

        if (VALIDATORS.includes(newBlock.validator) && newBlock.validator === validatorKey.getPublic('hex')) {
            newBlock.signBlock(validatorKey);
            if (Block.hasValidSignature(newBlock)) {
                this.chain.push(Object.freeze(newBlock));
            } else {
                throw new Error('Block signature is not valid');
            }
        } else {
            throw new Error('Validator not authorized');
        }
    }

    addData(data) {
        if (!this.hasValidData(data)) {
            console.log('Invalid data');
            return false;
        } else {
            this.pendingData.push(data);
            console.log('Data added');
            return true;
        }
    }

    hasValidData(data) {
        // Check if data is an object
        if (typeof data !== 'object' || data === null) {
            console.log('Data is not an object');
            return false;
        }

        // Required properties and their types
        const requiredFields = {
            id: 'number',
            name: 'string',
            course: 'string',
            grade: 'number',
            issuer: 'string',
            issuedDate: 'string',
        };

        // Check if all required properties exist
        for (const field in requiredFields) {
            if (!data.hasOwnProperty(field)) {
                console.log(`Data is missing ${field}`);
                return false;
            }
        }

        // Check if property types match
        for (const field in requiredFields) {
            if (typeof data[field] !== requiredFields[field]) {
                console.log(`Data type mismatch for ${field}`);
                return false;
            }
        }

        return true;
    }

    processPendingData(validatorKey) {
        const newBlock = new Block(new Date().toISOString(), this.pendingData, validatorKey.getPublic('hex'));
        this.addBlock(newBlock, validatorKey);
        this.pendingData = [];
    }

    static isValid(blockchain) {
        for (let i = 1; i < blockchain.chain.length; i++) {
            const currentBlock = blockchain.chain[i];
            const prevBlock = blockchain.chain[i - 1];

            if (
                currentBlock.hash !== Block.getHash(currentBlock) ||
                currentBlock.prevHash !== prevBlock.hash ||
                !Block.hasValidSignature(currentBlock)
            ) {
                return false;
            }
        }
        return true;
    }
}

const TheChain = new Blockchain();
console.log(TheChain.getLastBlock());

module.exports = { Block, Blockchain, TheChain };