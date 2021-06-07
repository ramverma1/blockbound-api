
const config = require('config')
const packageFile = require('../../package.json')

// parse config
const social = config.get('social')
const defaultChain = config.get('app.defaultChain')
const defaultNetwork = config.get('app.defaultNetwork')
const isTestnet = defaultNetwork === 'testnet'

// GET /api

let configMap = {
  apiVersion: 1,
  brand: "Proof of Existence",
  defaultChain: "btc",
  defaultNetwork: "mainnet",
  description: "Written forever.. Instant & Secure Proof of Existence for Any Document..",
  docproofPrice: {amount: 0.00025, code: "BTC"},
  email: "love@proofofexistence.com",
  isTestnet: false,
  keywords: ["blockchain", "notary", "proof of existence", "bitcoin", "p2p", "anonymous", "secure", "permanent"],
  logo: "/theme/logo.svg",
  slogan: "Written forever.",
  social: {twitter: "proofxstence", telegram: "EEP3LAyL8WvklWGsQ29F4g", github: "proofofexistence"},
  tagline: "Instant & Secure Proof of Existence for Any Document.",
  title: "Proof of Existence",
  version: packageFile.version,
}

/**
 * Get version details.
 */

const version = (req, res, next) =>
  res.send({
    apiVersion: 1.0,
    name: packageFile.name,
    version: packageFile.version
  })


/**
 * Get config info details.
 */

async function configInfo (req, res, next) {
  const docproofPrice = {amount: 0.00025, code: "BTC"};
  res.send({
    apiVersion: 1.0,
    version: packageFile.version,
    social,
    isTestnet,
    defaultChain,
    defaultNetwork,
    docproofPrice,
    ...config.get('app.site')
  })
}

const catch404 = (req, res) =>
  res.status(404)        // HTTP status 404: NotFound
      .send('Not found')

module.exports = {
    configInfo,
    version,
    catch404
  }
  