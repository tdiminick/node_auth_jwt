const User = require('../models/').User;
const env       = process.env.NODE_ENV || 'development';
const config    = require(`${__dirname}/../config/config.json`)[env];
const bCrypt = require("bCrypt-nodejs");

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

module.exports = {
    login(req, res) {
        // make sure there is a username
        if (!req.body.username){
            res.status(400)
                .send("Authentication Failed. Username or password wrong.");
        }
        User.findOne({
            where: {
                username: req.body.username
            }
        }).then(user => {
            // if no user returned or password doesn't match, return fail
            
            if(!user || 
                !bCrypt.compareSync(req.body.password, user.password)) {
                res.status(400)
                    .send("Authentication Failed. Username or password wrong.");
            } else {
                // get token
                console.log("user ", user);
                console.log("user.dataValues ", user.dataValues);
                // can save anything I need in here
                // will be available behind auth endpoints
                var payload = {
                    username: user.username,
                    created: user.createdAt,
                    modified: user.modifiedAt
                }
                var token = jwt.sign(payload, config.secret, {
                    expiresIn: "24h"
                });

                // send token for client to respond with
                res.status(200).send(token);
            }
        })
    },
    authorize(req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        if (token) {
            // verify token
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    res.status(400).send("Failed Token Auth");
                } else {
                    req.decoded = decoded;
                    next();
                }
            })
        } else {
            // no token
            res.status(403).send("No token provided");
        }
    }
}