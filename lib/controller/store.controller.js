const { request } = require('express');
const { reject } = require('lodash');
const Transaction = require('../../models/transactions.model');

/**
 * Get LatestUnconfirmed document details.
 */

function getLatestUnconfirmed() {
	return getConfirmed('latest-unconfirmed')
}

/**
 * Get LatestConfirmed document details.
 */

function getLatestConfirmed() {
	return getConfirmed('latest-confirmed')
}

/**
 * Get Confirmed documents 
 * @param {*} key 
 */
function getConfirmed(key) {
	return new Promise((resolve, reject) => {
		try {
			let result = [];
			Transaction.find(function (err, latestConfirmed) {
				if (err) resolve('Failed to retrieve confirmed transactions list' + err);
				if(key === 'latest-confirmed')
					result = latestConfirmed.filter(res => res.pending === false && res.blockstamp !== null);
				else
					result = latestConfirmed.filter(res => res.pending === true);
				resolve(result);
			})
		} catch (error) {
			resolve('[]')
		}
	})
}

/**
 * Perform a document registration.
 */
function putDocproof(transaction){
	return new Promise((resolve, reject) => {
		try {
			Transaction.findByIdAndUpdate( { _id: transaction.id }, { $set: transaction }, { new : true }, function (err, product) {
				if (err) resolve();
				resolve();
			});
			
		} catch (error) {
			resolve('[]')
		}
	})
}

 
module.exports = {
	getLatestConfirmed,
	getLatestUnconfirmed,
	putDocproof
}
