const transporter = require("../config/mail.config");
const {
  verifyEmailTemplate,
  forgotPasswordTemplate,
  accountRecoveryTemplate,
} = require("../templates/auth.templates");

const sendVerifyEmail = async (to, otp) => {
  const template = verifyEmailTemplate(otp);
  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: template.subject,
    html: template.html,
  });
};

const sendForgotPasswordEmail = async (to, otp) => {
  const template = forgotPasswordTemplate(otp);
  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: template.subject,
    html: template.html,
  });
};

const sendAccountRecoveryEmail = async (to, otp) => {
  const template = accountRecoveryTemplate(otp);
  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: template.subject,
    html: template.html,
  });
};

module.exports = {
  sendVerifyEmail,
  sendForgotPasswordEmail,
  sendAccountRecoveryEmail,
};
