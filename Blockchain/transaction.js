//  Tạo giao dịch với định các giá trị bên trong constructor
class Transaction{
    constructor(from, to, amount){
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}

module.exports = Transaction
