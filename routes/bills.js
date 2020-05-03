const validateToken = require('../utils').validateToken;
const controller = require('../controllers/bills');

module.exports = (router) => {
    router.get('/bills/getBills', controller.getBills);
}