var User = require('../models/user');
var jwt = require('jsonwebtoken');
var Models = require('../routes/AppModels');
var FunctionHeaders = require('../models/FunctionHeaders');
var ApiModels = {};
if(Models.length > 0){
    Models.forEach(model =>{
        ApiModels[model.Name] = require (model.path);
    })
}

var secret = 'RuanBokke';

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aureussales@gmail.com',
        pass: 'xrnpycehrvdiodip'
    }
});

/*var mailOptions = {
    from: 'aureussales@gmail.com',
    to: 'ruan15viljoen@gmail.com',
    subject: 'Test Aures Sales',
    text: 'That was easy!'
};*/



module.exports = function(router) {

    //User Registrtion


    router.post('/users', function(req, res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.email = req.body.email;
        user.name = req.body.name;
        console.log(req.body);
        if (req.body.username == null || req.body.username == "" || req.body.password == null || req.body.password == "" || req.body.email == null || req.body.email == "" || req.body.name == "" || req.body.name == null) {
            res.json({ success: false, message: "Missing Info" });
            console.log("2");
        } else {
            user.save(function(err) {
                if (err) {
                    console.log("3");
                    if (err.errors !== null) {
                        console.log("4");
                        if (err.errors.name) {
                            res.json({ success: false, message: err.errors.name.message });
                            console.log("5");
                        } else if (err.errors.password) {
                            res.json({ success: false, message: err.errors.password.message });
                        } else {
                            console.log("6");
                            if (err.code == 11000) {
                                if (err.errmsg.includes("username")) {
                                    res.json({ success: false, message: "Username already Taken" });
                                } else if (err.errmsg.includes("email")) {
                                    res.json({ success: false, message: "Email already Taken" });
                                } else {
                                    res.json({ success: false, message: err.errmsg });
                                }
                            } else {
                                console.log("7");
                                res.json({ success: false, message: err });
                            }
                        }
                    } else if (err) {
                        console.log("3.1");
                        if (err.code == 11000) {
                            res.json({ success: false, message: "Username or email already taken" });
                        } else {
                            console.log("3.2");
                            console.log(err);
                            res.json({ success: false, message: err });
                        }
                    }
                } else {
                    console.log("3");
                    console.log("Sendeing back message");
                    res.json({ success: true, message: "Account Created" });
                }
            });

        }
    });

    

    router.post('/query', function(req, res) {
        if (req.body.user) {

            var sendText = '<h1>' + req.body.item + '</h1><br><p>' + req.body.query + '</p>' +
                '<br><label>Name: ' + req.body.user.username + ' </label>' +
                '<br><label>Email: ' + req.body.queryemail + ' </label>' +
                '<br><label>Cell Number: ' + req.body.cellnumber + ' </label>';

            console.log(req.body.email);
            var mailOptions = {
                from: 'aureussales@gmail.com',
                to: req.body.email,
                subject: 'Aures Sales',
                html: sendText
            }

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                    res.json({ success: false, error: error });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.json({ success: true, message: "Email has been sent" });
                }
            });
        } else {
            res.json({ succces: false, message: "Data is not Correct" });
        }


    });





    //User Get
    router.post('/authenticate', function(req, res) {
        User.findOne({ username: req.body.username }).select('email username password').exec(function(err, user) {
            if (err) throw err;

            if (!user) {
                res.json({ succces: false, message: "Could not authenticate user" })
            } else if (user) {
                if (req.body.password) {
                    var validPassword = user.comparePassword(req.body.password);
                } else {
                    res.json({ succces: false, message: "No password Provided" });
                }
                if (!validPassword) {
                    res.json({ succces: false, message: "Could not authenticate Password" })
                } else {
                    var token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
                    res.json({ succces: true, message: "user Authenticat", token: token });
                }
            }
        })
    });

    router.post('/checkusername', function(req, res) {
        User.findOne({ username: req.body.username }).select('username').exec(function(err, user) {
            if (err) throw err;
            if (user) {
                res.json({ succces: false, message: "That Username is already Taken" });
            } else {
                res.json({ succces: true, message: "Valid Username" });
            }

        })
    });

    router.post('/checkemail', function(req, res) {
        User.findOne({ email: req.body.email }).select('email').exec(function(err, user) {
            if (err) throw err;
            if (user) {
                res.json({ succces: false, message: "That Email is already taken" });
            } else {
                res.json({ succces: true, message: "Valid Email" });
            }

        })
    });

    router.use(function(req, res, next) {

        var token = req.body.token || req.body.query || req.headers['x-access-token'];
        if (token) {
            console.log(token);
            jwt.verify(token, secret, function(err, decoded) {
                if (err) {
                    res.send({ succces: false, message: "Token Invalide" });
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
        } else {
            if (req._parsedOriginalUrl.pathname == "/api/stockmanagement") {
                next();
            } else if (req._parsedOriginalUrl.pathname.includes("getstockmanagement")) {
                next();
            } else if (req._parsedOriginalUrl.pathname == "/api/getcontacts") {
                console.log(req._parsedOriginalUrl.pathname);
                next();
            } else if (req._parsedOriginalUrl.pathname == "/api/homepagedata") {
                console.log(req._parsedOriginalUrl.pathname);
                next();
            }  else {
                res.json({ succces: false, message: "No Token Provided" });
            }

        }

    })

    router.post('/me', function(req, res) {
        res.send(req.decoded);
    })

    router.get('/permission', function(req, res) {
        User.findOne({ username: req.decoded.username }, function(err, user) {
            if (err) throw err;

            if (!user) {
                res.json({ success: false, message: "No User found" })
            } else {
                res.json({ success: true, permission: user.permission });
            }
        })
    })

    router.get('/usersmanagement', function(req, res) {
        User.find({}, function(err, users) {
            if (err) throw err;
            console.log(users);
            User.findOne({ username: req.decoded.username }, function(err, mainuser) {
                if (err) throw err;
                if (!mainuser) {
                    res.json({ success: false, message: "No User found" })
                } else {
                    if (mainuser.permission === 'admin' || mainuser.permission === 'moderator') {
                        if (!users) {
                            res.json({ success: false, message: "users not found" })
                        } else {
                            res.json({ success: true, users: users, permission: mainuser.permission });
                        }

                    } else {
                        res.json({ success: false, message: "Permission Denied" })
                    }
                }
            })
        })
    })

    router.get('/homepagedata', function(req, res) {
        StockItem.find({}, function(err, items) {
            if (err) throw err;
            if (!items) {
                res.json({ success: false, message: "Items not found" })
            } else {
                items.forEach(function(item){
                    item.media = item.media[item.displaynumber];
                })
                res.json({ success: true, items: items });
            }

        })
    });

    router.delete('/management/:username', function(req, res) {
        var deleteUser = req.params.username;
        User.findOne({ username: req.decoded.username }, function(err, mainuser) {
            if (err) throw err;
            if (!mainuser) {
                res.json({ success: false, message: "No User found" });
            } else {
                if (mainuser.permission !== 'admin') {
                    res.json({ success: false, message: "Permision Denied" })
                } else {
                    User.findOneAndRemove({ username: deleteUser }, function(err, user) {
                        if (err) throw err;
                        res.json({ success: true });
                    })
                }
            }
        })
    })

    router.get('/entity/:entity', function(req, res) {

        FunctionHeaders.find({}, function(err, items) {
            if (err) throw err;
            if (!items) {
                res.json({ success: false, message: "Items not found" })
            } else {
                res.json({ success: true, items: items });
            }

        })
    });

    return router;
};