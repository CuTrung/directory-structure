const ServiceResponse = require('../../../common/responses/service.response');
const mailchimpTransactional = require('@mailchimp/mailchimp_transactional')(process.env.MAILCHIMP_TRANSACTION_APIKEY);

const sendOneMail = async ({ from_email, mail_to, from_name, mail_subject, mail_reply, email_content }) => {
  try {
    const payload = {
      message: {
        html: email_content,
        subject: mail_subject,
        from_email: from_email,
        from_name: from_name,
        reply_to: mail_reply,
        to: [
          {
            email: mail_to,
          },
        ],
        global_merge_vars: [],
        merge_vars: [],
        track_opens: true,
        track_clicks: true,
      },
    };

    const response = await mailchimpTransactional.messages.send(payload);

    return new ServiceResponse(true, 'success', response);
  } catch (e) {
    logger.error(e.message, { function: 'MailChimpService.sendOneMail' });
    return new ServiceResponse(false, e.message);
  }
};

// sendOneMail({
//   from_email: 'shopdunk@nondev.tech',
//   mail_to: 'phidn.blackwind@gmail.com',
//   from_name: 'cskh',
//   mail_subject: 'CSKH',
//   mail_reply: 'shopdunk@nondev.tech',
//   email_content: 'Hello world'
// })

module.exports = {
  sendOneMail,
};
