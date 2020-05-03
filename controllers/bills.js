const formatDate = require('./utils').formatDate;
const reformatDate = require('./utils').reformatDate;

function getCompanyBills(){
    return new Promise((resolve, reject) => {
        let query = `SELECT b.id, cp.name as companyName, s.name as serviceName, b.price, b.currency_rate, DATE_FORMAT(b.due_date, "%d.%m.%Y") as dueDate, b.paid FROM bills b JOIN customers c ON b.customer_id = c.id 
                    JOIN companies cp ON c.company_id = cp.id JOIN services s ON s.id = b.service_id WHERE c.company_id IS NOT NULL;`;

        db.query(query, (err, response) => {
            if(err){
                reject(err);
            }
            resolve(response);
        })
    })
}

function getCustomerBills(){
    return new Promise((resolve, reject) => {
        let query = `SELECT b.id, CONCAT(c.firstname, ' ', c.lastname) as customerName, s.name as serviceName, b.price, b.currency_rate, DATE_FORMAT(b.due_date, "%d.%m.%Y") as dueDate, b.paid FROM bills b 
                    JOIN customers c ON b.customer_id = c.id JOIN services s ON s.id = b.service_id WHERE c.company_id IS NULL;`;

        db.query(query, (err, response) => {
            if(err){
                reject(err);
            }
            resolve(response);
        })
    })
}

module.exports = {
    getBills: async (req, res, next) => {
        let companyBills = await getCompanyBills();
        let customerBills = await getCustomerBills();
        res.status(200).send({companyBills, customerBills});
    }
}