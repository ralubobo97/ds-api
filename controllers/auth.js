const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config').jwtConfig;

module.exports = {
    login: (req, res, next) => {
        let email = req.body.email;
        let password = req.body.password;

        let query1 = `SELECT id, surname, firstname, password FROM users WHERE email = '${email}'`;
        db.query(query1, (err, response) => {
            if(err){
                res.status(500).send('Login failed!');
                throw err;
            }
            let hashPassword = response[0].password;
            const match = bcrypt.compareSync(password, hashPassword);
            if(match){
                const payload = {
                    id: response[0].id,
                    surname: response[0].surname,
                    firstname: response[0].firstname,
                    email
                };
                
                const options = {
                    expiresIn: jwtConfig.expiresIn,
                    issuer: jwtConfig.jwtIssuer
                };

                const secret = jwtConfig.jwtSecret;
                const token = jwt.sign(payload, secret, options);

                res.status(200).send(JSON.stringify(token));
                next();
            } else {
                res.status(401).send('Email and password are incorrect!');
                next();
            }
        })
    }
}