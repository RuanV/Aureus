var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var router = express.Router();
var appRoutes = require('./app/routes/api')(router);
var path = require('path');
var passport = require('passport');

app.use(morgan('dev'));
app.use(bodyParser.json({limit: '20mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '20mb', extended: true }));
app.use(express.static(__dirname + '/front'));
app.use('/api',appRoutes);


mongoose.connect("mongodb://localhost:27017", function(err) {
    if (err) {
        console.log("Not Connected to the Database");
        throw err;
    } else {
        console.log("Connected to MOngoDB");
    }
});


app.get('*',function(req,res){
	res.sendFile(path.join(__dirname + '/front/app/views/index.html'));
})

app.listen(port, function() {
    console.log("Running on " + port + " check Browser");
});