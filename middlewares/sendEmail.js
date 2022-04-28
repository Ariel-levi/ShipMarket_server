const nodemailer = require('nodemailer');

exports.sendEmail = (_bodyData = {}) => {
    // need to open in outlook new accout
    let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: { ciphers: 'SSLv3' },
        auth: {
            user: 'ronennt@gmail.com',
            pass: '2468xvxv'
        }
    });
    let mailOptions = {
        from: 'ronennt@gmail.com',
        replyTo: _bodyData.email,
        to: 'ronennt@gmail.com',
        subject: _bodyData.subject,
        text: `
       
        name: ${_bodyData.name} \n
        message: ${_bodyData.message}\n 
        
        `
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log("err", error);
            return false
        }
        else {
            console.log('Email sent: ' + info.response);
            return true
        }
    });
}
