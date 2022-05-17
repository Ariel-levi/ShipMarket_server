const nodemailer = require("nodemailer");

const contactEmail = (_bodyData) => {
  return `
    <!DOCTYPE html>
    <html dir="ltr" lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          body {
            font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
            right: inherit;
          }
          h2 {
            color: rgb(146, 146, 146);
            font-size: 2.5em;
          }
          .text {
            border: 2px dashed rgb(146, 146, 146);
            padding: 20px;
            border-radius: 23px;
          }
        </style>
      </head>
      <body>
        <h2>hellow ${_bodyData.name} welcome to ure site</h2>
        <div class="text">
          <h4>msg :</h4>
          <p>
          hii ${_bodyData.name} , AriShop is hery hepy for you to be part of the family 😁, 
          </p>
        </div>
      </body>
    </html>
  `;
};

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
    html: contactEmail(_bodyData),
    // text: `
    //     email: ${_bodyData.email} \n
    //     name: ${_bodyData.name} \n
    //     message: ${_bodyData.message}\n
    //     `,
  };
  await sendOutlookMail(mailOptions);
};

// exports.sendEmail = (_bodyData = {}) => {
//   // need to open in outlook new accout
//   let transporter = nodemailer.createTransport({
//     host: "smtp-mail.outlook.com", // hostname
//     secureConnection: false, // TLS requires secureConnection to be false
//     port: 587, // port for secure SMTP
//     tls: { ciphers: "SSLv3" },
//     auth: {
//       user: "deliverproject2022@outlook.co.il",
//       pass: "EmailDelivery2022",
//     },
//   });
//   let mailOptions = {
//     from: "deliverproject2022@outlook.co.il",
//     replyTo: _bodyData.email,
//     // to: 'deliverproject2022@gmail.com',
//     to: _bodyData.email,
//     subject: _bodyData.subject,
//     text: `

//         name: ${_bodyData.name} \n
//         message: ${_bodyData.message}\n

//         `,
//   };

//   transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//       console.log("err", error);
//       return false;
//     } else {
//       console.log("Email sent: " + info.response);
//       return true;
//     }
//   });
// };
