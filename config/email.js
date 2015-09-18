var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    //service: 'Gmail',
    host: "thsr1.supercp.com",
    secure: true,
    port: 465,
    auth: {
      user: "projects@madtec.co",
      pass: "psw"
    }
  });
  module.exports = transporter;
