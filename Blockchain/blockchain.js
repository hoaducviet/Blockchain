const Block = require('./block')
const sha256 = require('js-sha256');

class Blockchain{
    // Tạo chuỗi bắt đầu từ block đầu tiên
    constructor(genesisBlock){
        this.blocks = [];
        this.addBlock(genesisBlock);
    }

    //Tạo các giá trị cố định của Block đầu
    addBlock(block){
        if(this.blocks.length == 0){
            block.previousHash = "0000000000000000";
            block.hash = this.generateHash(block);
        }
        this.blocks.push(block);
    }


    getNextBlock(transactions){
        let block = new Block()
        transactions.forEach((transaction) => {
            
            block.addTransaction(transaction)
        });

        let previousBlock = this.getPreviousBlock()
        block.index = this.blocks.length
        block.previousHash = previousBlock.hash
        block.hash = this.generateHash(block)
        
        return block
    }

    getPreviousBlock(){
        return this.blocks[this.blocks.length - 1]
    }

    
    

    //Tạo giá trị băm cho mỗi Block trong hàm while có dùng PoW với độ khó trong phần diều kiện

    generateHash(block){
        let hash = sha256(block.key);
        while(!hash.startsWith('000')){
            block.nonce += 1
            hash = sha256(block.key)
            console.log(hash)
        }
        return hash;
    }
}

module.exports = Blockchain