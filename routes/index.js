const auth = require('./auth');
const employees = require('./employees');
const competitors = require('./competitors');
const services = require('./services');
const customers = require('./customers');
const bills = require('./bills');

module.exports = (router) => {
    bills(router);
    auth(router);
    employees(router);
    competitors(router);
    services(router);
    customers(router);
    return router;
}