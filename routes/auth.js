const controller = require('../controllers/auth');

module.exports = (router) => {
    router.post('/auth/login', controller.login);
}