var path = require('path');
var fs = require('fs');

var settings = function(port) {
	if (port === 443) {
		return {
			ssl: {
				ca: fs.readFileSync(path.join(__dirname, './certificates/production.bundle')).toString(),
				cert: fs.readFileSync(path.join(__dirname, './certificates/production.crt')).toString(),
				key: fs.readFileSync(path.join(__dirname, './certificates/production.key')).toString()
			},
			url: 'http://localhost',
			mongoUri: "mongodb+srv://Administrator:"+encodeURIComponent("Bokke@2020")+"@127.0.0.1/test?retryWrites=true&w=majority"
		}
	} else {
		return {
			mongoUri: "mongodb+srv://ruanviljoen:"+encodeURIComponent("Bokke@2020")+"@aureus-eap1b.mongodb.net/test?retryWrites=true&w=majority"
		};
	}
}

module.exports = settings;