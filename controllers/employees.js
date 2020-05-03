const formatDate = require('./utils').formatDate;
const reformatDate = require('./utils').reformatDate;

module.exports = {
    getEmployees: (req, res, next) => {
        let query = `SELECT * FROM employees;`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            let employees = [];
            response.forEach(employee => {
                employees.push({
                    id: employee.id,
                    firstname: employee.firstname,
                    lastname: employee.lastname,
                    address: employee.address,
                    email: employee.email,
                    dailyAvailability: employee.daily_availability,
                    startHour: employee.start_hour,
                    endHour: employee.end_hour,
                    payment: employee.hourly_payment
                })
            })
            res.status(200).send(employees);
            next();
        });
    },

    getEmployee: (req, res, next) => {
        let query = `SELECT * FROM employees WHERE id = ${req.query.id};`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            let employee = {
                id: response[0].id,
                firstname: response[0].firstname,
                lastname: response[0].lastname,
                address: response[0].address,
                email: response[0].email,
                dailyAvailability: response[0].daily_availability,
                startHour: response[0].start_hour,
                endHour: response[0].end_hour,
                payment: response[0].hourly_payment
            }
            res.status(200).send(employee);
            next();
        });
    },

    addEmployee: (req, res, next) => {
        let {firstname, lastname, address, email, dailyAvailability, startHour, endHour, payment, contractValidity} = req.body;
        let query = `INSERT INTO employees (firstname, lastname, address, email, daily_availability, start_hour, end_hour, hourly_payment) VALUES 
                    ('${firstname}', '${lastname}', '${address}', '${email}', ${dailyAvailability}, ${startHour}, ${endHour}, ${Number(payment)});`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            let employeeID = response.insertId;
            let contractStart = new Date().toISOString().split('T')[0];
            let contractEnd = new Date(new Date(contractStart).setMonth(new Date(contractStart).getMonth() + contractValidity)).toISOString().split('T')[0];
            let dateFormat = '%Y-%m-%d';

            let query2 = `INSERT INTO contracts (employee_id, start_date, end_date) VALUES 
                         (${employeeID}, STR_TO_DATE('${contractStart}', '${dateFormat}'), STR_TO_DATE('${contractEnd}', '${dateFormat}'));`;

            db.query(query2, (error, resp) => {
                if(error) {
                    res.status(500).send(error);
                    throw error;
                }
                res.status(200).send();
                next();
            });
        });
        
    },

    editEmployee: (req, res, next) => {
        let {id, firstname, lastname, address, email, dailyAvailability, startHour, endHour, payment} = req.body;
        let query = `UPDATE employees SET firstname = '${firstname}', lastname = '${lastname}', address = '${address}', email = '${email}', 
                    daily_availability = ${dailyAvailability}, start_hour = ${startHour}, end_hour = ${endHour}, hourly_payment = '${Number(payment)}' WHERE id = ${id};`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            res.status(200).send();
            next();
        });
    },

    deleteEmployee: (req, res, next) => {
        let query = `DELETE FROM employees WHERE id = ${req.query.id};`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            res.status(200).send();
            next();
        });
    },

    getContracts: (req, res, next) => {
        let query = `SELECT c.id, c.start_date + INTERVAL 1 DAY as start_date, c.end_date + INTERVAL 1 DAY as end_date, CONCAT(e.firstname, ' ', e.lastname) as employeeName FROM contracts c JOIN employees e ON c.employee_id = e.id;`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            let contracts = [];
            response.forEach(contract => {
                contracts.push({
                    id: contract.id,
                    employeeName: contract.employeeName,
                    startDate: formatDate(new Date(contract.start_date)),
                    endDate: formatDate(new Date(contract.end_date))
                })
            })
            res.status(200).send(contracts);
            next();
        });
    },

    editContract: (req, res, next) => {
        let contract = req.body;
        let endDate = new Date(new Date(reformatDate(contract.endDate)).setMonth(new Date(reformatDate(contract.endDate)).getMonth() + contract.extraMonths)).toISOString().split('T')[0];
        let dateFormat = '%Y-%m-%d';
        let query = `UPDATE contracts SET end_date = STR_TO_DATE('${endDate}', '${dateFormat}') WHERE id = ${contract.id};`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            res.status(200).send();
            next();
        });
    },

    getMeetings: (req, res, next) => {
        let query = `SELECT id, name, location, hall, equipment, DATE_FORMAT(date, "%d.%m.%Y") as date, start_hour as startHour, end_hour as endHour FROM events;`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            res.status(200).send(response);
            next();
        });
    },

    addMeeting: (req, res, next) => {
        let {name, location, hall, equipment, date, startHour, endHour} = req.body;
        let dateFormat = '%d.%m.%Y';
        let query = `INSERT INTO events (name, location, hall, equipment, date, start_hour, end_hour) VALUES 
                    ('${name}', '${location}', '${hall}', '${equipment}', STR_TO_DATE('${date}', '${dateFormat}'), ${startHour}, ${endHour});`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            res.status(200).send();
            next();
        });
    },

    getAvailableParticipants: (req, res, next) => {
        let query = `SELECT id, CONCAT(firstname, ' ', lastname) as name, email FROM employees WHERE start_hour <= ${req.query.startHour} AND end_hour >= ${req.query.endHour};`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            res.status(200).send(response);
            next();
        });
    },

    addParticipants: (req, res, next) => {
        let {eventID, employees} = req.body;
        employees.forEach(employee => {
            let query = `INSERT INTO event_participants (event_id, employee_id) VALUES (${eventID}, ${employee.id});`;
            db.query(query, (err, response) => {
                if(err) {
                    res.status(500).send(err);
                    throw err;
                }
            });
        });
        res.status(200).send();
        next();
    },

    getParticipants: (req, res, next) => {
        let query = `SELECT CONCAT(e.firstname, ' ', e.lastname) as name, e.email FROM employees e JOIN event_participants ep ON e.id = ep.employee_id WHERE ep.event_id = ${req.query.id};`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            res.status(200).send(response);
            next();
        });
    }
}