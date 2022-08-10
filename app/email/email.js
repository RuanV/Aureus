var nodemailer = require('nodemailer');


var Mail = {};
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ruan15viljoen@gmail.com',
        pass: 'iwamysrksipftygg'
    }
});


var mailOptions = {
    from: 'ruan15viljoen@gmail.com',
    to: 'ruan15viljoen@gmail.com',
    subject: 'Real Estate',
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