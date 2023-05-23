
const Block = require('./block')
const Blockchain = require('./blockchain')
const Transaction = require('./transaction')
const BlockchainNode = require('./blockchainNode')

const fetch = require('node-fetch')


const express = require('express')
const app = express()


const arguments = process.argv

let PORT = 8080

if(arguments.length > 2){
    PORT = arguments[2]
}


app.use(express.json())

let transactions = []
let nodes = []
let genesisBlock = new Block()
let blockchain = new Blockchain(genesisBlock)
let allTransactions = []

app.get('/resolve', (req,res) =>{
    nodes.forEach(node =>{
        fetch(`${node.url}/blockchain`)
        .then(response => response.json())
        .then(otherBlockchain =>{
            if(blockchain.blocks.length < otherBlockchain.blocks.length){
                allTransactions.forEach(transaction =>{
                    fetch(`${node.url}/transactions`,{
                        method: 'POST',
                        headers:{
                            'Content-Type': 'appplication/json'
                        },
                        body:JSON.stringify(transaction)

                    }).then(response => response.json())
                    .then(_ =>{
                        fetch(`${node.url}/mine`)
                        .then(response => response.json())
                        .then(_ => {
                            fetch(`${node.url}/blockchain`)
                            .then(response => response.json())
                            .then(updatedBlockchain => {
                                console.log(updatedBlockchain)
                                blockchain = updatedBlockchain
                                res.json(blockchain)
                            })

                        })
                    })
                })
            }else{
                res.json(blockchain)
            }

        })
    })
})



app.post('/nodes/register', (req,res) =>{
    const urls = req.body
    urls.forEach(url => {
        const node = new BlockchainNode(url)
        nodes.push(node)
        console.log(node)
    })
    res.json(nodes)
})

app.post('/transactions', (req,res) => {
    const to = req.body.to
    const from = req.body.from
    const amount = req.body.amount

    let transaction = new Transaction(from, to, amount)
    transactions.push(transaction)
    res.json(transactions)

})

app.get('/mine', (req,res) => {
    let block = blockchain.getNextBlock(transactions)
    blockchain.addBlock(block)
    transactions.forEach(transaction => {
        allTransactions.push(transaction)
    })
    transactions = []

    res.json(block)
})

app.get('/blockchain', (req,res) => {
    res.json(blockchain)
})    

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})    

  
// let genesisBlock = new Block()
// let blockchain = new Blockchain(genesisBlock)


// let transaction = new Transaction('Viet','Mary',100)
// let block = blockchain.getNextBlock([transaction])
// blockchain.addBlock(block)

// let anotherTransaction = new Transaction('Steve', 'Brian', 300)
// let block1 = blockchain.getNextBlock([anotherTransaction, transaction])
// blockchain.addBlock(block1)
