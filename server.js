var express = require('express');
var app = express();

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const bodyParser = require('body-parser');
app.use(bodyParser.json());


const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const bcrypt = require('bcryptjs');

const {
    User,
    Project
} = require('./models/user');

const config = require('./config');


app.use(express.static('public'));

// ---------------- RUN/CLOSE SERVER -----------------------------------------------------
let server = undefined;

function runServer(urlToUse) {
    console.log(urlToUse);
    return new Promise((resolve, reject) => {
        mongoose.connect(urlToUse, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(config.PORT, () => {
                console.log(`Listening on localhost:${config.PORT}`);
                resolve();
            }).on('error', err => {
                mongoose.disconnect();
                reject(err);
            });
        });
    });
}

if (require.main === module) {
    console.log('Im running server');
    runServer(config.DATABASE_URL).catch(err => console.error(err));
}

function closeServer() {
    return mongoose.disconnect().then(() => new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    }));
}


//responding user registration
app.post('/register', (req, res) => {
    console.log(req.body.username, req.body.password);
    User
        .find({
            username: req.body.username
        }, (err, item) => {
            //if anything in server is wrong, return message
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                })
            }
            if (item) {
                //if there's no error, test if username input does not exist in db
                console.log(item, req.body.username);

                //if registration fails, alert the reason
                if ((item.length != 0) && (item[0].username == req.body.username)) {
                    return res.status(400).json({
                        message: `registration is failed because username ${req.body.username} is already exist`
                    });
                }
                //if the input username is unique, register the user into db
                else {

                    let username = req.body.username;
                    username = username.trim();
                    let password = req.body.password;
                    password = password.trim();
                    bcrypt.genSalt(10, (err, salt) => {
                        if (err) {
                            return res.status(500).json({
                                message: 'Internal server error'
                            });
                        }

                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) {
                                return res.status(500).json({
                                    message: 'Internal server error'
                                });
                            }

                            User.create({
                                username: username,
                                password: hash
                            }, (err, item) => {
                                if (err) {
                                    return res.status(500).json({
                                        message: 'Internal Server Error'
                                    });
                                }
                                if (item) {
                                    console.log(`User \`${username}\` created.`);
                                    return res.json(item);
                                }
                            });
                        });
                    });
                };
            }
        });
});

//responding user login
app.post('/signin', (req, res) => {
    User
        .findOne({
            username: req.body.username
        }, (err, items) => {
            if (err) {
                return res.status(500).json({
                    message: "Internal server error"
                })
            }
            if (!items) {
                //check if username exists in db
                console.log(items, req.body.username);
                console.error('Invalid username and password combination');
                return res.status(401).json({
                    message: 'Invalid username and password combination'
                });
                //when client.js receives username and password, use the username to GET request of notes in db
                //send the whole object to client
            } else {
                items.validatePassword(req.body.password, (err, isValid) => {
                    if (err) {
                        alert('Invalid username and password combination')
                    }
                    if (!isValid) {
                        return res.status(401).json({
                            message: 'Invalid username and password combination'
                        });
                    } else {
                        console.log('login successful');
                        console.log(items)
                        var logInTime = new Date();
                        console.log("User logged in: " + req.body.username + ' at ' + logInTime);
                        return res.status(200).json(items)
                    }
                });
            };
        });
});

//responding to get users
//url '/users' method GET
app.get('/users', (req, res) => {
    User
        .find()
        .then(data => {
            console.log(data);
            return res.status(200).json(data);
        })
        .catch(() => {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error'
            });
        });
})

//Retrieve a user's project(s)
app.get('/user/project/all/:user', (req, res) => {
    console.log('this is get user', req.params.user)
    Project
        .find({
            projectOwner: req.params.user
        }, (err, items) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
            if (items) {
                console.log(req.params.user, items)
                return res.status(200).json(items);
            }
        });
});

//Retrieve user project detail
app.get('/user/project/:projectId', (req, res) => {
    console.log('this is get user', req.params.user)
    Project
        .find({
            _id: req.params.projectId
        }, (err, items) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
            if (items) {
                console.log(req.params.user, items)
                return res.status(200).json(items);
            }
        });
});


//Save notes in db
app.post('/user/project', (req, res) => {
    Project
        .create({
            projectName: req.body.projectName,
            projectPredeccesor: req.body.projectPredeccesor,
            projectDuration: req.body.projectDuration,
            projectStart: req.body.projectStart,
            projectEnd: req.body.projectEnd,
            projectStatus: req.body.projectStatus,
            projectOwner: req.body.projectOwner
        }, (err, item) => {
            if (err) {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
            if (item) {
                console.log(`A new project is created. project is ${item}`);
                return res.status(200).json(item);
            }
        });
});

//app.get('/user/notes/', (req, res) => {
//    Note
//        .find()
//        .then((note) => {
//            return res.status(200).json(note);
//        })
//        .catch(function () {
//            console.error(err);
//            res.status(500).json({
//                message: 'Internal Server Error'
//            });
//        });
//})



app.get('/user/notes/a/:id', function (req, res) {
    //    console.log(req.params.id, "testing");
    Note
        .findById(req.params.id)
        .then(note => {
            console.log(note);
            return res.status(200).json(note);
        })
        .catch(function (note) {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error'
            });
        });
});

app.put('/user/notes/b/:id', (req, res) => {
    let toUpdate = {};
    let updateableFields = ['title', 'body', 'type'];
    updateableFields.forEach(function (field) {
        if (field in req.body) {
            toUpdate[field] = req.body[field];
        }
    });
    Note
        .findByIdAndUpdate(req.params.id, {
            $set: toUpdate
        })
        .then(function (note) {
            return res.status(204).json(note);
        })
        .catch(function (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        });
});

app.delete('/user/notes/c/:id', (req, res) => {
    console.log(req.params.id);
    Note
        .findByIdAndRemove(req.params.id)
        .then(() => {
            return res.status(204).end();
        })
        .catch(function () {
            console.error(err);
            res.status(500).json({
                message: 'Internal Server Error'
            });
        });
});





//Get a note app.get('/user/notes/:id', (req, res) => {
//
//})


exports.app = app;
exports.runServer = runServer;
exports.closeServer = closeServer;
