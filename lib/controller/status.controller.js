
const config = require('config')
const core = require('../core')
const Transaction = require('../../models/transactions.model');
const request = require('request-promise-native')
const store = require('../../lib/controller/store.controller')

/**
 * Get a document status.
 */

const obtain = async (hash) => {

    const docproof = await getDocproof(hash);
    if (docproof) {
        //Wait for payment
        if (docproof.blockstamp === undefined || docproof.blockstamp === null) {
            // statusInBlockchain check for payment and upates property - blockstamp, pending and tx.
            const sib = await statusInBlockchain(hash)
            if (sib.success === true) {
                docproof.tx = sib.tx
                docproof.pending = false;
                docproof.blockstamp = new Date().toISOString()
                
                // updating values (tx, pending, blockstamp) in database
                await store.putDocproof(docproof)
                
                //return documentStatus({ digest: hash, payment_address: docproof.payment_address, pending: false, timestamp: docproof.timestamp, txstamp: docproof.txstamp, tx: sib.tx, blockstamp: 1 })
            }
        }
        return documentStatus(docproof)
    } else {
        // Not registered
        const sib = await statusInBlockchain(hash)
        if (sib.success === true) {
        // FIXME: Fill all the status
        return documentStatus({ digest: hash, pending: false, tx: sib.tx, blockstamp: 1 })
        } else {
        return missingStatus()
        }
    }
}


/**
 * Refresh a document status.
 */

const refresh = async (hash) => {
    
    let docproof = await getDocproof(hash);
    if (docproof) {
        //console.log('DocProof : ',docproof);
        if (docproof.pending === true) {
            
            // createDocProof if doc is unconfirmed and updated properties - tx, pending, feePerKilobyte, fee, txstamp.
            docproof = await core.notary.createDocproof(docproof)

        } else if (docproof.blockstamp === undefined || docproof.blockstamp === null) {
            //console.log('Document is registered but not confirmed');
            // confirmDocproof if blockstamp is undefined and updated properties - blockstamp
            docproof = await core.notary.confirmDocproof(docproof)
        
        }

        return documentStatus(docproof)
    } else {
        return missingStatus()
    }
}


/**
 * Get a document using hash
 */

async function getDocproof(hash) {

    return new Promise((resolve, reject) => {
        try {
            Transaction.findOne({ digest: hash }, function (err, latestConfirmed) {
                if (err) resolve(false);
                resolve(latestConfirmed);
            })
        } catch (error) {
            resolve('[]')
        }
    })
}


/**
 * Reply body for a document status.
 */

async function documentStatus(docproof) {

    // docproofPrice() used to get price information.
    //const price =  await core.notary.docproofPrice();

    return {
        digest: docproof.digest ? docproof.digest : '',
        payment_address: docproof.payment_address ? docproof.payment_address : '',
        pending: docproof.pending,
        network: config.get('app.defaultNetwork'),
        success: true,
        timestamp: docproof.timestamp ? core.util.formatDate(docproof.timestamp) : '',
        tx: docproof.tx ? docproof.tx : '',
        txstamp: docproof.txstamp ? core.util.formatDate(docproof.txstamp) : '',
        blockstamp: docproof.blockstamp ? core.util.formatDate(docproof.blockstamp) : '',
        price: 0
    }
}


/**
 * Reply body if a document has no status.
 */

function missingStatus() {
    return {
        success: false,
        reason: 'nonexistent'
    }
}

/**
 * Find the digest in the fullnode database
 */
async function statusInBlockchain (hash) {
    // NOTE: Search the hash in the BTC network only
    const urlr = 'https://api.smartbit.com.au/v1/blockchain/search'
  
    const doc = await request.get({
      url: urlr,
      strictSSL: true,
      json: true,
      qs: {q: hash}
    })
  
    if (doc.results[0] && doc.results[0].data && doc.results[0].data.txid) {
      return {
        success: true,
        tx: doc.results[0].data.txid
      }
    }
  
    return {
      success: false,
      reason: 'notfound'
    }
}
  

module.exports = {
    obtain,
    refresh,
    getDocproof
}
