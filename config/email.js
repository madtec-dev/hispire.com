var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    //service: 'Gmail',
    host: "thsr1.supercp.com",
    secure: true,
    port: 465,
    auth: {
      user: "projects@hispire.com",
      pass: "psw"
    }
  });
  module.exports = transporter;
