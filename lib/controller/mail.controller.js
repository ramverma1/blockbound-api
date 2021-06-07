"use strict";
const nodemailer = require("nodemailer");


async function sendMails(to_email, text) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.USER, // generated ethereal user
      pass: process.env.PASS, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.FROM, // sender address
    to: to_email, // list of receivers
    subject: "Blockbound transaction confimation", // Subject line
    text: test, // plain text body
    html: '<h1> Success </h1>'
  });
}

module.exports = { sendMails }