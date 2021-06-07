const configureStripe = require('stripe');
const core = require('../core')
const status = require('./status.controller')

// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/account/apikeys
const stripe = configureStripe(process.env.STRIPE_KEY);

// const YOUR_DOMAIN = 'http://localhost:3000/checkout';

// // Find your endpoint's secret in your Dashboard's webhook settings
// const endpointSecret = 'whsec_...';

// /**
//  * Get a stripe checkout session Id.
//  */
// const sessionInfo = async (req) => {
//     const session = await stripe.checkout.sessions.create({
//         payment_method_types: ['card'],
//         line_items: [
//           {
//             price_data: {
//               currency: 'usd',
//               product_data: {
//                 name: 'Stubborn Attachments',
//                 images: ['https://i.imgur.com/EHyR2nP.png'],
//               },
//                unit_amount: 2000,
//             },
//             quantity: 1,
//           },
//         ],
//         mode: 'payment',
//         success_url: `${YOUR_DOMAIN}?success=true`,
//         cancel_url: `${YOUR_DOMAIN}?canceled=true`,
//     });
//     return ({ id: session.id });
// }


// /**
//  * fulfill orders after a customer pays with Stripe Checkout
//  * @param {*} req 
//  * @param {*} res 
//  */
// const sessionStatus = async (req, res) => {
//   const payload = req.body;
//   const sig = req.headers['stripe-signature'];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
//   } catch (err) {
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the checkout.session.completed event
//   switch (event.type) {
//     case 'checkout.session.completed': {
//       const session = event.data.object;
//       // Save an order in your database, marked as 'awaiting payment'
//       createOrder(session);

//       // Check if the order is paid (e.g., from a card payment)
//       //
//       // A delayed notification payment will have an `unpaid` status, as
//       // you're still waiting for funds to be transferred from the customer's
//       // account.
//       if (session.payment_status === 'paid') {
//         fulfillOrder(session);
//       }

//       break;
//     }

//     case 'checkout.session.async_payment_succeeded': {
//       const session = event.data.object;

//       // Fulfill the purchase...
//       fulfillOrder(session);

//       break;
//     }

//     case 'checkout.session.async_payment_failed': {
//       const session = event.data.object;

//       // Send an email to the customer asking them to retry their order
//       emailCustomerAboutFailedPayment(session);

//       break;
//     }
//   }

//   res.status(200); 

// }

// const fulfillOrder = (session) => {
//   // TODO: fill me in
//   console.log("Fulfilling order", session);
// }

// const createOrder = (session) => {
//   // TODO: fill me in
//   console.log("Creating order", session);
// }

// const emailCustomerAboutFailedPayment = (session) => {
//   // TODO: fill me in
//   console.log("Emailing customer", session);
// }

/**
 * Callback function that executes after the request to the Stripe API succeeds or fails
 * @param {*} res 
 */
const postStripeCharge = (res,hash) => async (stripeErr, stripeRes) => {
  if (stripeErr) {
    console.log(stripeErr)
    res.status(500).send({ error: 'Stripe error' });
    // let docproof = await status.getDocproof(hash);
    // if(docproof){
    //   // createDocProof if doc is unconfirmed and updated properties - tx, pending, feePerKilobyte, fee, txstamp.
    //   console.log('DocProof : ',docproof);
    //   docproof = await core.notary.createDocproof(docproof)
      
    //   res.status(200).send({ success: docproof });
    // } else {
    //   res.status(500).send({error : 'Digest not exist'})
    // }
  } else {

    // let docproof = await status.getDocproof(hash);
    // if(docproof){
    //   // createDocProof if doc is unconfirmed and updated properties - tx, pending, feePerKilobyte, fee, txstamp.
    //   console.log('DocProof : ',docproof);
    //   docproof = await core.notary.createDocproof(docproof)
      
    //   res.status(200).send({ success: docproof });
    // } else {
    //   res.status(500).send({error : 'Digest not exist'})
    // }

    res.status(200).send({ success: true });
  }
}

/**
 * PaymentApi with Stripe library to create a official Stripe payment. 
 * @param {*} req 
 * @param {*} res 
 */
const paymentApi = async (req, res) => {
  let stripeReq = { amount: req.body.amount, currency: req.body.currency, description: req.body.description, source: req.body.source};
  let digest = req.body.hash;
  let result = await stripe.charges.create(stripeReq, postStripeCharge(res, digest));
  return result
}

module.exports = {
    //sessionInfo,
    //sessionStatus,
    paymentApi
}