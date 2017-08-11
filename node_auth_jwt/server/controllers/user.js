const User = require('../models/').User;
const env       = process.env.NODE_ENV || 'development';
const config    = require(`${__dirname}/../config/config.json`)[env];
const bCrypt = require("bCrypt-nodejs");

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens

module.exports = {
    create(req, res) {
        // get password hash
        var pHash = bCrypt.hashSync(req.body.password);
        console.log("pHash ", pHash);

        // create user
        return User.create({
            username: req.body.username,
            password: pHash
        })
        .then(user => res.status(201).send(user))
        .catch(error => res.status(400).send(error))
    },
    list(req, res) {
        // this returns all users
        // need to make this admin only
        return User
            .all()
            .then(users => res.status(200).send(users))
            .catch(error => res.status(400).send(error));
    }
}