const nodemailer = require("nodemailer");
const { ContactEmail } = require("../emails/contactEmail");
const {
  NewStoreEmailActive,
  NewStoreEmailPending,
} = require("../emails/newStoreEmail");
const { VerifyEmailHtml } = require("../emails/verifyEmail");

// need to open in outlook new accout
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  tls: { ciphers: "SSLv3" },
  auth: {
    type: "OAuth2",
    user: process.env.SENDER_EMAIL_ADDRESS,
    accessToken: "ya29.Xx_XX0xxxxx-xX0X0XxXXxXxXXXxX0x",
  },
});

const sendOutlookMail = (_mailOptions) => {
  transporter.sendMail(_mailOptions, function (error, info) {
    if (error) {
      console.log("err", error);
      return false;
    } else {
      console.log("Email sent: " + info.response);
      return true;
    }
  });
};

exports.sendContactEmail = async (_bodyData = {}) => {
  let mailOptions = {
    from: process.env.SENDER_EMAIL_ADDRESS,
    replyTo: _bodyData.email,
    to: "deliverproject2022@gmail.com",
    subject: _bodyData.subject,
    html: ContactEmail(_bodyData),
  };
  await sendOutlookMail(mailOptions);
};

exports.sendNewStoreEmail = async (_bodyData = {}) => {
  let mailOptions = {
    from: process.env.SENDER_EMAIL_ADDRESS,
    replyTo: _bodyData.email,
    to: _bodyData.email,
    subject: "Your Store Is " + _bodyData.status,
    html:
      _bodyData.status === "active"
        ? NewStoreEmailActive(_bodyData)
        : NewStoreEmailPending(_bodyData),
  };
  await sendOutlookMail(mailOptions);
};

exports.verifyUserEmail = async (_user, _host) => {
  let mailOptions = {
    from: process.env.SENDER_EMAIL_ADDRESS,
    to: _user.email,
    subject: "Email Verification",
    html: VerifyEmailHtml(_user, _host),
  };
  await sendOutlookMail(mailOptions);
};
