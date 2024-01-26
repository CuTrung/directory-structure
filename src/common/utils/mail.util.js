const nodemailer = require("nodemailer");

const send = async (mail) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    ignoreTLS: false,
    secure: false,
    auth: {
      user: MAIL_SMTP_USER,
      pass: MAIL_SMTP_PASSWORD,
    },
  });

  let options = {
    from: MAIL_FROM,
    to: mail.to,
    subject: mail.subject,
    html: mail.html,
  };

  if (mail.cc) {
    options.cc = mail.cc;
  }

  if (mail.replyTo) {
    options.replyTo = mail.replyTo;
  }

  transporter.sendMail(options);
};

module.exports = {
  send,
};
