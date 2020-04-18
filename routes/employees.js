const validateToken = require('../utils').validateToken;
const controller = require('../controllers/employees');

module.exports = (router) => {
    router.post('/employees/addEmployee', controller.addEmployee);
    router.get('/employees/getEmployees', controller.getEmployees);
    router.get('/employees/getEmployee', controller.getEmployee);
    router.post('/employees/editEmployee', controller.editEmployee);
    router.delete('/employees/deleteEmployee', controller.deleteEmployee);
    router.get('/employees/getContracts', controller.getContracts);
    router.post('/employees/editContract', controller.editContract);
}