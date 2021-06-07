const store = require('../../lib/controller/store.controller')

/**
 * Get unconfirmed document details.
 */

 function unconfirmed(req, res) {
  store.getLatestUnconfirmed().then(results => {
    res.set('Content-Type', 'application/json')
    res.send(results)
  })
}

/**
 * Get confirmed document details.
 */

function confirmed(req, res) {
  store.getLatestConfirmed().then(results => {
    res.set('Content-Type', 'application/json')
    res.send(results)
  })
}

module.exports = {
  unconfirmed,
  confirmed
}
