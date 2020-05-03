const formatDate = require('./utils').formatDate;
const reformatDate = require('./utils').reformatDate;

module.exports = {
    addService: (req, res, next) => {
        let { name, type, startDate, endDate } = req.body;
        let dateFormat = '%d.%m.%Y';
        let query = `INSERT INTO services (name, type, start_date, end_date) VALUES 
                    ('${name}', '${type}', STR_TO_DATE('${startDate}', '${dateFormat}'), STR_TO_DATE('${endDate}', '${dateFormat}'));`;
        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            res.status(200).send();
            next();
        });
    },

    getServices: (req, res, next) => {
        let query = `SELECT id, name, type, start_date + INTERVAL 1 DAY as start_date, end_date + INTERVAL 1 DAY as end_date FROM services;`;
        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            let services = [];
            response.forEach(service => {
                services.push({
                    id: service.id,
                    name: service.name,
                    type: service.type,
                    startDate: formatDate(new Date(service.start_date)),
                    endDate: formatDate(new Date(service.end_date))
                });
            });
            res.status(200).send(services);
            next();
        });
    },

    getService: (req, res, next) => {
        let query = `SELECT id, name, type, start_date + INTERVAL 1 DAY as start_date, end_date + INTERVAL 1 DAY as end_date FROM services WHERE id = ${req.query.id};`;
        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            let service = {
                id: response[0].id,
                name: response[0].name,
                type: response[0].type,
                startDate: formatDate(new Date(response[0].start_date)),
                endDate: formatDate(new Date(response[0].end_date))
            }
            res.status(200).send(service);
            next();
        });
    },

    editService: (req, res, next) => {
        let { id, name, type, startDate, endDate } = req.body;
        let dateFormat = '%d.%m.%Y';
        let query = `UPDATE services SET name = '${name}', type = '${type}', start_date = STR_TO_DATE('${startDate}', '${dateFormat}'), 
                    end_date = STR_TO_DATE('${endDate}', '${dateFormat}') WHERE id = ${id};`;
        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            res.status(200).send();
            next();
        });
    },

    deleteService: (req, res, next) => {
        let query = `DELETE FROM services WHERE id = ${req.query.id};`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            res.status(200).send();
            next();
        });
    },

    getForecasts: (req, res, next) => {
        let query = `SELECT * FROM services ORDER BY popularity ASC LIMIT 3;`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            let forecasts = [];
            response.forEach(forecast => {
                forecasts.push({
                    id: forecast.id,
                    name: forecast.name,
                    type: forecast.type,
                    startDate: formatDate(new Date(forecast.start_date)),
                    endDate: formatDate(new Date(forecast.end_date)),
                    popularity: forecast.popularity
                })
            })
            res.status(200).send(forecasts);
            next();
        });
    }
}