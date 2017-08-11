const User = require('../models/').User;
const env       = process.env.NODE_ENV || 'development';
const config    = require(`${__dirname}/../config/config.json`)[env];

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

module.exports = {
    create(req, res) {
        return User.create({
            username: req.body.username,
            password: req.body.password
        })
        .then(user => res.status(201).send(user))
        .catch(error => res.status(400).send(error))
    },
    list(req, res) {
        return User
            .all()
            .then(users => res.status(200).send(users))
            .catch(error => res.status(400).send(error));
    },
    authenticate(req, res) {
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
            if(!user || user.password != req.body.password) {
                res.status(400)
                    .send("Authentication Failed. Username or password wrong.");
            } else {
                var token = jwt.sign(user.dataValues, config.secret, {
                    expiresIn: "24h"
                });

                res.status(200).send(token);
            }
        })
    },
    authToken(req, res, next) {
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