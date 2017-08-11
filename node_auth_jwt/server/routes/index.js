const userController = require('../controllers').user;
const authController = require('../controllers').auth;

module.exports = (app) => {

    // register
    app.post('/api/user', userController.create);

    // login
    app.post('/api/login', authController.login);
    
    // test route
    app.get('/api', (req, res) => res.status(200).send({
        message: 'My API'
    }))

    // everything below this use will need to have auth
    app.use(authController.authorize);

    // get user list, will add admin check to this eventually
    app.get('/api/users', userController.list);
}