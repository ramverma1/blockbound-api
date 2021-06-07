
const config = require('config')
const Transaction = require('../../models/transactions.model')



/**
 * Perform a document registration.
 */
const register = async (hash, email, subscribed) => {

    const docproof = await getDocproof(hash)

    if (docproof) {
        return existingRegistration(hash)
    } else {
        
        //const paymentAddress = incomingHDPrivateKey.derive(randomPath).privateKey.toAddress()
        const paymentAddress =  process.env.address;

        const registration = await newRegistration(hash, paymentAddress, email, subscribed)

        let res = await addLatestUnconfirmed(registration)

        return paymentDetails(hash, paymentAddress)
    }
}

/**
 * Add LatestUnconfirmed document detail 
 */
async function addLatestUnconfirmed(registration) {

    return new Promise((resolve, reject) => {
        try {
            let transaction = new Transaction(
                {
                    digest: registration.digest,
                    payment_address: registration.payment_address,
                    pending: registration.pending,
                    timestamp: registration.timestamp,
                    feePerKilobyte: registration.feePerKilobyte,
                    tx: "",
                    txstamp: "",
                    blockstamp: "",
                    fee: registration.fee
                }
            );
        
            transaction.save(function (err) {
                if (err) {
                    return resolve();
                }
                return resolve()
            })
        } catch (error) {
            resolve('[]')
        }
    })
}


/**
 * Get a document detail using hash
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
 * Reply body if a document is already registered.
 */
function existingRegistration (hash) {
    return {
      'success': false,
      'reason': 'existing',
      'digest': hash
    }
  }
  
  /**
   * A new document registration.
   */
  async function newRegistration (hash, address, email, subscribed) {
    
    //const feePerKilobyte = await core.notary.lookupFeePerKb()
    //const fee = core.notary.estimateFee()
    const feePerKilobyte = 111326
    const fee = {}

    return {
      digest: hash,
      payment_address: address.toString(),
      pending: true,
      timestamp: new Date(),
      feePerKilobyte: feePerKilobyte,
      fee: fee,
      email: email,
      subscribed: subscribed
    }
  }
  
  /**
   * Reply body for a new registration.
   */
  function paymentDetails (hash, address) {
    return {
      success: 'true',
      digest: hash,
      pay_address: address.toString(),
      price: 25000
      //price: chains.documentPrice()
    }
  }

module.exports = register