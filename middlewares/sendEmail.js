const nodemailer = require("nodemailer");
const { ContactEmail } = require("../emails/contactEmail");
const {
  NewStoreEmailActive,
  NewStoreEmailPending,
} = require("../emails/newStoreEmail");

// need to open in outlook new accout
const transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  tls: { ciphers: "SSLv3" },
  auth: {
    user: "deliverproject2022@outlook.co.il",
    pass: "EmailDelivery2022",
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
    from: "deliverproject2022@outlook.co.il",
    replyTo: _bodyData.email,
    to: "deliverproject2022@gmail.com",
    subject: _bodyData.subject,
    html: ContactEmail(_bodyData),
  };
  await sendOutlookMail(mailOptions);
};

exports.sendNewStoreEmail = async (_bodyData = {}) => {
  let mailOptions = {
    from: "deliverproject2022@outlook.co.il",
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
