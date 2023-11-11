var fs = require("fs");
var Handlebars = require('handlebars');

const build = (template, data) => {
    const html = fs.readFileSync(`app/mailtemplates/${template}.html`, 'utf8');
    return Handlebars.compile(html)(data);
}

const createMail = (TYPE, data, subtitle = null) => {
    switch (TYPE) {
        case 'OFFWORK':
            return {
                mail_subject: `[DUYỆT ĐƠN XIN NGHỈ PHÉP] ${data.full_name}`,
                mail_content: build('offwork', data)
            }
        case 'PAYMENTSLIP':
            return {
                mail_subject: subtitle ? subtitle : `[PHIẾU CHI ĐỊNH KỲ THÁNG] ${data.paymentslip_code}`,
                mail_content: build('paymentslip', data)
            }
        case 'RECEIVESLIP':
            return {
                mail_subject: subtitle ? subtitle : `[PHIẾU THU ĐỊNH KỲ THÁNG] ${data.receiveslip_code}`,
                mail_content: build('receiveslip', data)
            }
    }
}


module.exports = {
    createMail,
}