const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let transactionSchema = new Schema({
    digest: {
        type: String,
    },
    payment_address: {
        type: String,
    },
    pending: {
        type: Boolean,
    },
    timestamp: {
        type: Date,
    },
    feePerKilobyte: {
        type: Number,
    },
    tx: {
        type: String,
    },
    txstamp: {
        type: Date,
    },
    blockstamp: {
        type: Date,
    },
    fee: {
        type: Map,
    },
    email: {
        type: String,
    },
    subscribed: {
        type: Boolean,
    },
});

module.exports = mongoose.model('Transaction', transactionSchema);