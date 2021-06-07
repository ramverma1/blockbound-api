const registerController = require('../../lib/controller/register.controller');
const store = require('../../lib/controller/store.controller')
const stripe = require('../../lib/controller/stripe.controller')
const status = require('../../lib/controller/status.controller')
const mail = require('../../lib/controller/mail.controller')
// const core = require('../../lib/core')
const btc = require('./../../lib/controller/btc.controller')

/**
 * Get checkout session details.
 */

// function sessionInfo(req, res) {
//     stripe.sessionInfo(req)
//         .then(results => {
//             res.json(results)
//         }).catch(error => {
//             console.log(error.message)
//             res.status(500).end('Unexpected error')
//         })
// }


// /**
//  * fulfill orders after a customer pays with Stripe Checkout. 
//  */

// function orderFullfill(req, res) {
//     stripe.sessionStatus(req, res).then()
//     .catch(error => {
//         console.log(error.message)
//         res.status(500).end('Unexpected error')
//     })
// }


function payment(req, resp) {
    const {hash} = req.body;
    const {email} = req.body;
    const {subscribed} = req.body;
    if (btc.isValidDigest(hash)) {
        stripe.paymentApi(req, resp).then(async rest => {
            let result = await btc.sendBitcoin(process.env.address,hash,0)
            // mail.sendMails(email,result)
            // registerController.register(hash,email,subscribed);
            // const txn = status.getDocproof(hash)
            txn.tx = result.txid;
            console.log(txn)
            store.putDocproof(txn)
            return resp.end('success')
        })
        .catch(error => {
            console.log(error.message)
            return resp.status(500).end('Unexpected error')
        })
    } else {
        return resp.status(400).json({
        reason: 'Invalid `hash` field'
        })
    }
}


module.exports = {
    //sessionInfo,
    //orderFullfill,
    payment
}