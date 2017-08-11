const userController = require('../controllers').user;

module.exports = (app) => {

    app.post('/authenticate', userController.authenticate);

    app.get('/api', (req, res) => res.status(200).send({
        message: 'My API'
    }))

    // everything below this use will need to have auth
    app.use(userController.authToken);

    app.post('/api/user', userController.create);
    app.get('/api/users', userController.list);
}