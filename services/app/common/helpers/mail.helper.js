const nodemailer = require('nodemailer');
const config = require('../../../config/config')
const smtpTransport = require('nodemailer-smtp-transport');

const send = async (mail) => {
    console.log(config.mail)
    const transporter = nodemailer.createTransport(smtpTransport({
        host: config.mail.MAIL_SMTP_SERVER,
        port: config.mail.MAIL_SMTP_PORT,
        ignoreTLS: false,
        secure: false,
        auth: {
            user: config.mail.MAIL_SMTP_USER,
            pass: config.mail.MAIL_SMTP_PASSWORD
        },
    }));
    let options = {
        from: config.mail.MAIL_FROM,
        to: mail.to,
        subject: mail.subject,
        html: mail.html
    };

    if (mail.cc) {
        options.cc = mail.cc;
    }

    if (mail.replyTo) {
        options.replyTo = mail.replyTo;
    }
    try {
        await transporter.sendMail(options);
    } catch (error) {
        throw error;
    }
};


module.exports = {
    send
}