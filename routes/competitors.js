const validateToken = require('../utils').validateToken;
const controller = require('../controllers/competitors');

module.exports = (router) => {
    router.get('/competitors/getCompetitors', controller.getCompetitors);
    router.post('/competitors/addCompetitor', controller.addCompetitor);
    router.delete('/competitors/deleteCompetitor', controller.deleteCompetitor);
    router.post('/competitors/editCompetitor', controller.editCompetitor);
}