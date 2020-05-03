const validateToken = require('../utils').validateToken;
const controller = require('../controllers/customers');

module.exports = (router) => {
    router.post('/customers/addCustomer', controller.addCustomer);
    router.get('/customers/getCustomers', controller.getCustomers);
    router.delete('/customers/deleteCustomer', controller.deleteCustomer);
    router.get('/customers/getCompanies', controller.getCompanies);
    router.post('/customers/addCompany', controller.addCompany);
    router.get('/customers/getCompany', controller.getCompany);
    router.post('/customers/editCompany', controller.editCompany);
    router.get('/customers/getDeliveries', controller.getDeliveries);
    router.get('/customers/getDeliveryContents', controller.getDeliveryContents);
}