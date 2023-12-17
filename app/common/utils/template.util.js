var fs = require("fs");
var Handlebars = require("handlebars");

const build = (template, data) => {
  const html = fs.readFileSync(`app/templates/mail/${template}.html`, "utf8");
  return Handlebars.compile(html)(data);
};

const propsMail = (mail_subject, type = "", data) => ({
  mail_subject,
  mail_content: build(type.toLowerCase(), data),
});

const createMail = (TYPE, data, subtitle = null) => {
  switch (TYPE) {
    case "OFFWORK":
      return propsMail(
        `[DUYỆT ĐƠN XIN NGHỈ PHÉP] ${data.full_name}`,
        TYPE,
        data,
      );
    case "PAYMENTSLIP":
      return propsMail(
        subtitle ?? `[PHIẾU CHI] ${data.paymentslip_code}`,
        TYPE,
        data,
      );
    case "PAYMENTSLIPMONTHLY":
      return propsMail(
        subtitle ?? `[PHIẾU CHI ĐỊNH KỲ THÁNG] ${data.paymentslip_code}`,
        "paymentslip",
        data,
      );
    case "RECEIVESLIP":
      return propsMail(
        subtitle ?? `[PHIẾU THU] ${data.receiveslip_code}`,
        TYPE,
        data,
      );
  }
};

module.exports = {
  createMail,
};
