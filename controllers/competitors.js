const formatDate = require('./utils').formatDate;
const reformatDate = require('./utils').reformatDate;

module.exports = {
    getCompetitors: (req, res, next) => {
        let query = `SELECT * FROM competitors;`;
        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            let competitors = [];
            response.forEach(competitor => {
                competitors.push({
                    id: competitor.id,
                    company: competitor.company,
                    service: competitor.service,
                    price: competitor.price,
                    startDate: formatDate(new Date(competitor.start_date)),
                    endDate: formatDate(new Date(competitor.end_date))
                });
            });
            res.status(200).send(competitors);
            next();
        });
    },

    addCompetitor: (req, res, next) => {
        let {company, service, price, startDate, endDate} = req.body;
        let dateFormat = '%d.%m.%Y';
        let query = `INSERT INTO competitors (company, service, price, start_date, end_date) VALUES 
                    ('${company}', '${service}', ${price}, STR_TO_DATE('${startDate}', '${dateFormat}'), STR_TO_DATE('${endDate}', '${dateFormat}'));`;
        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            res.status(200).send();
            next();
        });
    },

    deleteCompetitor: (req, res, next) => {
        let query = `DELETE FROM competitors WHERE id = ${req.query.id};`;
        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            res.status(200).send();
            next();
        });
    },

    editCompetitor: (req, res, next) => {
        let {id, company, service, price, startDate, endDate} = req.body;
        let dateFormat = '%d.%m.%Y';
        let query = `UPDATE competitors SET company = '${company}', service = '${service}', price = ${price}, 
                    start_date = STR_TO_DATE('${startDate}', '${dateFormat}'), end_date = STR_TO_DATE('${endDate}', '${dateFormat}') WHERE id = ${id};`;

        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            res.status(200).send();
            next();
        });
    }
}