var nodemailer = require('nodemailer');


var Mail = {};
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aureussales@gmail.com',
        pass: 'xrnpycehrvdiodip'
    }
});


var mailOptions = {
    from: 'aureussales@gmail.com',
    to: 'ruan15viljoen@gmail.com',
    subject: 'Aures Sales',
    text: 'That was easy!'
};

Mail.SendMail = function(options,func) {
    transporter.sendMail(options, function(error, info) {
        if (error) {
            console.log(error);
        } else {
        	func(){
        		return true;
        	}
            console.log('Email sent: ' + info.response);
        }
    });
};



module.exports = Mail;