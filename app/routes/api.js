var User = require('../models/user');
var StockItem = require('../models/stock');
var Contact = require('../models/contact');
var jwt = require('jsonwebtoken');
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

    router.post('/stock', function(req, res) {
        var stock = new StockItem();
        stock.name = req.body.name;
        stock.price = req.body.price;
        stock.description = req.body.description;
        stock.model = req.body.model;
        stock.category = req.body.category;
        stock.media = req.body.media;
        console.log(req.body);
        if (req.body.name == null || req.body.name == "" || req.body.category == null || req.body.category == "" || req.body.price == null || req.body.price == "" || req.body.media.length == 0) {
            res.json({ success: false, message: "Missing Info" });
        } else {
            stock.save(function(err) {
                if (err) {
                    res.json({ success: false, message: err });
                } else {
                    console.log("Saving Stock Item");
                    res.json({ success: true, message: "item added to Stock" });
                }
            });

        };

    })

    router.post('/query', function(req, res) {
        if (req.body.user) {

            var sendText = '<h1>' + req.body.item + '</h1><br><p>' + req.body.query + '</p>' +
                '<br><label>Name: ' + req.body.user.username + ' </label>' +
                '<br><label>Email: ' + req.body.user.email + ' </label>' +
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
            } else {
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

    router.get('/stockmanagement', function(req, res) {
        StockItem.find({}, function(err, items) {
            if (err) throw err;
            if (!items) {
                res.json({ success: false, message: "Items not found" })
            } else {
                res.json({ success: true, items: items });
            }

        })
    });
    router.get('/getstockmanagement/:_id', function(req, res) {
        var getItem = req.params._id;
        StockItem.findOne({ _id: getItem }, function(err, item) {
            if (err) throw err;
            if (!item) {
                res.json({ success: false, message: "No StockItem found" });
            } else {
                res.json({ success: true, item: item });
            }
        })
    })

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

    router.delete('/managestock/:_id', function(req, res) {
        var deleteItem = req.params._id;
        User.findOne({ username: req.decoded.username }, function(err, mainuser) {
            if (err) throw err;
            if (!mainuser) {
                res.json({ success: false, message: "No User found" })
            } else {
                if (mainuser.permission !== 'admin') {
                    res.json({ success: false, message: "Permision Denied" })
                } else {
                    StockItem.findOneAndRemove({ _id: deleteItem }, function(err, item) {
                        if (err) throw err;
                        res.json({ success: true });
                    })
                }
            }
        })
    })



    router.put('/edit', function(req, res) {
        var edituser = req.body.username;
        User.findOne({ username: req.decoded.username }, function(err, mainuser) {
            if (err) throw err;
            if (!mainuser) {
                res.json({ success: false, message: "No User found" })
            } else {
                if (mainuser.permission === 'admin' || mainuser.permission === 'moderator') {
                    User.findOne({ username: edituser }, function(err, user) {
                        if (err) throw err;
                        if (!user) {
                            res.json({ success: false, message: "No User found" })
                        } else {
                            user.name = req.body.name;
                            user.username = req.body.username;
                            user.email = req.body.email;
                            user.permission = req.body.email;
                            User.findOneAndUpdate({ _id: req.body._id }, user, { upsert: true }, function(err, user) {
                                if (err) throw err;
                                if (!user) {
                                    res.json({ success: false, message: "No User found" })
                                } else {
                                    res.json({ success: true, message: user })
                                }
                            });
                        }
                    })
                } else {
                    res.json({ success: false, message: "Permision Denied" })
                }
            }
        })

    })

    router.put('/editstock', function(req, res) {
        var editItem = req.body;
        User.findOne({ username: req.decoded.username }, function(err, mainuser) {
            if (err) throw err;
            if (!mainuser) {
                res.json({ success: false, message: "No User found" })
            } else {
                if (mainuser.permission === 'admin' || mainuser.permission === 'moderator') {
                    StockItem.findOne({ _id: editItem._id }, function(err, stock) {
                        if (err) throw err;
                        if (!stock) {
                            res.json({ success: false, message: "No item found" });
                        } else {
                            stock.name = req.body.name;
                            stock.model = req.body.model;
                            stock.price = req.body.price;
                            stock.category = req.body.category;
                            stock.description = req.body.description;
                            stock.media = req.body.media;
                            stock.sold = req.body.sold;
                            StockItem.findOneAndUpdate({ _id: req.body._id }, stock, { upsert: true }, function(err, item) {
                                if (err) throw err;
                                if (!item) {
                                    res.json({ success: false, message: "No Item found" })
                                } else {
                                    res.json({ success: true, message: item })
                                }
                            });
                        }
                    })
                } else {
                    res.json({ success: false, message: "Permision Denied" })
                }
            }
        })

    })

    router.post('/contact', function(req, res) {
        User.findOne({ username: req.decoded.username }, function(err, mainuser) {
            if (err) throw err;
            if (!mainuser) {
                res.json({ success: false, message: "No User found" })
            } else {
                if (mainuser.permission === 'admin' || mainuser.permission === 'moderator') {
                    if (req.body.name == null || req.body.email == "" || req.body.email == null || req.body.maincellnumber == "" || req.body.maincellnumber == null || req.body.altcellnumber == "" || req.body.altcellnumber == null) {
                        res.json({ success: false, message: "Missing Info" });
                    } else {
                        Contact.findOne({ _id: "5e86f1412c3d3e1114b8ec31" }, function(err, contact) {
                            if (err) throw err;
                            if (!contact) {
                                res.json({ success: false, message: "No item found" });
                            } else {
                                contact.name = req.body.name;
                                contact.email = req.body.email;
                                contact.maincellnumber = req.body.maincellnumber;
                                contact.altcellnumber = req.body.altcellnumber;
                                contact.address = req.body.address;
                                contact.bank = req.body.bank;
                                contact.bankbranch = req.body.bankbranch;
                                contact.bankaccount = req.body.bankaccount;
                                Contact.findOneAndUpdate({ _id: "5e86f1412c3d3e1114b8ec31" }, contact, { upsert: true }, function(err, item) {
                                    if (err) throw err;
                                    if (!item) {
                                        res.json({ success: false, message: "No Contact found" })
                                    } else {
                                        res.json({ success: true, message: item })
                                    }
                                });
                            }
                        })

                    };

                } else {
                    res.json({ success: false, message: "Permission Denied" })
                }
            }
        })
    })

    router.get('/getcontacts', function(req, res) {
        Contact.findOne({ _id: "5e86f1412c3d3e1114b8ec31" }, function(err, contact) {
            if (err) throw err;
            if (!contact) {
                res.json({ success: false, message: "No item found" });
            } else {
                res.json({ success: true, contact: contact });
            }
        })
    });

    return router;
};