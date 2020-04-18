const auth = require('./auth');
const employees = require('./employees');

module.exports = (router) => {
    auth(router);
    employees(router);
    return router;
}