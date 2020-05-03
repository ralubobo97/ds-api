const validateToken = require('../utils').validateToken;
const controller = require('../controllers/services');

module.exports = (router) => {
    router.post('/services/addService', controller.addService);
    router.get('/services/getServices', controller.getServices);
    router.get('/services/getService', controller.getService);
    router.post('/services/editService', controller.editService);
    router.delete('/services/deleteService', controller.deleteService);
    router.get('/services/getForecasts', controller.getForecasts);
}