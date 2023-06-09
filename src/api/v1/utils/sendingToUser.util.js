module.exports = {
    sendEmail: ({
        from,
        to,
        title,
        contentText = "",
        contentHtml = ""
    }) => {
        const { createTransport } = require('nodemailer');
        const user = process.env.EMAIL_OWNER;
        const transporter = createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            service: 'gmail',
            auth: {
                user,
                pass: process.env.APP_PASSWORD_EMAIL_OWNER
            }
        });

        const mailOptions = {
            from: from ?? user,
            to,
            subject: title ?? `Sending email from ${user}`,
            text: contentText,
            html: contentHtml,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    },
}