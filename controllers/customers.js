const formatDate = require('./utils').formatDate;
const reformatDate = require('./utils').reformatDate;

function getCompanyDeliveries(){
    return new Promise((resolve, reject) => {
        let query = `SELECT d.id, cp.name, d.destination FROM deliveries d JOIN customers c ON d.customer_id = c.id JOIN companies cp ON c.company_id = cp.id WHERE c.company_id IS NOT NULL;`;
        db.query(query, (err, response) => {
            if(err){
                reject(err);
            }
            resolve(response);
        })
    })
}

function getCustomerDeliveries(){
    return new Promise((resolve, reject) => {
        let query = `SELECT d.id, CONCAT(c.firstname, ' ', c.lastname) as name, d.destination FROM deliveries d JOIN customers c ON d.customer_id = c.id WHERE c.company_id IS NULL;`;
        db.query(query, (err, response) => {
            if(err){
                reject(err);
            }
            resolve(response);
        })
    })
}

module.exports = {
    getCustomers: (req, res, next) => {
        let query = `SELECT c.id, c.firstname, c.lastname, c.company_id, cp.name, c.cnp, c.email, c.phone, c.location, c.feedback FROM customers c LEFT JOIN companies cp ON c.company_id = cp.id;`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            let customers = [];
            response.forEach(customer => {
                customers.push({
                    id: customer.id,
                    firstname: customer.firstname ? customer.firstname : '-',
                    lastname: customer.lastname ? customer.lastname : '-',
                    companyID: customer.company_id,
                    company: customer.name,
                    cnp: customer.cnp,
                    email: customer.email,
                    phone: customer.phone,
                    location: customer.location,
                    feedback: customer.feedback ? customer.feedback : '-'
                })
            })
            res.status(200).send(customers);
            next();
        });
    },

    getCompanies: (req, res, next) => {
        let query = `SELECT id, name FROM companies;`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            let companies = [{ label: 'Select company', value: '' }];
            response.forEach(company => {
                companies.push({
                    label: company.name, value: company.id
                })
            })
            res.status(200).send(companies);
            next();
        });
    },

    addCustomer: (req, res, next) => {
        let {firstname, lastname, company, cnp, email, phone, location, feedback} = req.body;
        let query;
        if(company && feedback){
            query = `INSERT INTO customers (company_id, email, phone, location, feedback) VALUES 
                    (${company}, '${email}', '${phone}', '${location}', '${feedback}');`;
        } else if(company){
            query = `INSERT INTO customers (company_id, email, phone, location) VALUES 
                    (${company}, '${email}', '${phone}', '${location}');`;
        } else if(firstname && feedback){
            query = `INSERT INTO customers (firstname, lastname, cnp, email, phone, location, feedback) VALUES 
                    ('${firstname}', '${lastname}', '${cnp}', '${email}', '${phone}', '${location}', '${feedback}');`;
        } else {
            query = `INSERT INTO customers (firstname, lastname, cnp, email, phone, location) VALUES 
                    ('${firstname}', '${lastname}', '${cnp}', '${email}', '${phone}', '${location}');`;
        }
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            res.status(200).send();
            next();
        });
    },

    deleteCustomer: (req, res, next) => {
        let query = `DELETE FROM customers WHERE id = ${req.query.id};`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            res.status(200).send();
            next();
        });
    },

    addCompany: (req, res, next) => {
        let {name, regCode, address, domain} = req.body;
        let query = `INSERT INTO companies (name, registration_code, address, domain) VALUES 
                    ('${name}', '${regCode}', '${address}', '${domain}');`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            res.status(200).send();
            next();
        });
    },

    getCompany: (req, res, next) => {
        let query = `SELECT * FROM companies WHERE id = ${req.query.id};`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            let company = {
                id: response[0].id,
                name: response[0].name,
                regCode: response[0].registration_code,
                address: response[0].address,
                domain: response[0].domain
            }
            res.status(200).send(company);
            next();
        });
    },

    editCompany: (req, res, next) => {
        let {id, name, regCode, address, domain} = req.body;
        let query = `UPDATE companies SET name = '${name}', registration_code = '${regCode}', address = '${address}', domain = '${domain}' WHERE id = ${id};`;
        db.query(query, (err, response) => {
            if(err) {
                res.status(500).send(err);
                throw err;
            }
            res.status(200).send();
            next();
        });
    },

    getDeliveries: async (req, res, next) => {
        let companyDeliveries = await getCompanyDeliveries();
        let customerDeliveries = await getCustomerDeliveries();
        res.status(200).send({companyDeliveries, customerDeliveries});
    },

    getDeliveryContents: (req, res, next) => {
        let query = `SELECT name FROM delivery_contents WHERE delivery_id = ${req.query.id};`;
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