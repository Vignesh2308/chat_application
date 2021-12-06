const dotenv = require('dotenv')
const db = require('../database/index')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
dotenv.config()

exports.register = async (req, res, next) => {

    let validationErrors = []
    try {
        const { username, email, password, confirmPassword } = req.body;

        if (username === null || username === '') validationErrors.push({ username: 'username is mandatory' });
        if (email === null || email === '') validationErrors.push({ email: 'email is mandatory' });
        if (password === null || password === '') validationErrors.push({ password: 'password is mandatory' });
        if (password !== confirmPassword) validationErrors.push({ confirmPassword: "Password does not match" });

        if (validationErrors.length > 0) return res.status(422).send({ erros: validationErrors });

        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const id = uuid.v4();
            db.query(`SELECT * FROM USERS WHERE user_name = '${username}'`, (error, result, fields) => {
                console.log(result.length)
                if (result.length > 0) return res.status(422).send({ error: "username already exists" });
                // existingUser = JSON.parse(JSON.stringify(result[0]));
                db.query(`INSERT INTO USERS (id, user_name, email, password) VALUES ('${id}', '${username}','${email}', '${hashedPassword}')`, (error, result) => {
                    if (error) console.log(error);
                    // console.log("No of rows inserted: ", result.affectedRows)
                    return res.status(201).send({ message: "success" });
                })
            });
        }

    }
    catch (error) {
        res.status(500).send()
    }
}

exports.login = async (req, res, next) => {
    let validationErrors = []
    try {
        const { username, password } = req.body;
        if (username === null || username === '') validationErrors.push({ username: 'username is mandatory' });
        if (password === null || password === '') validationErrors.push({ password: 'password is mandatory' });

        if (validationErrors.length > 0) return res.status(422).send({ erros: validationErrors });
        else {
            db.query(`SELECT * FROM USERS WHERE user_name = '${username}'`, async (error, result, fields) => {

                if (result.length === 0) return res.status(422).send({ error: "user does not exists" });
                else {
                    const { user_name, password: hashedPassword, email } = JSON.parse(JSON.stringify(result[0]))
                    console.log(hashedPassword)
                    if (!await bcrypt.compare(password, hashedPassword)) {
                        return res.status(422).send({ success: "Wrong Password" });
                    }
                    else {
                        const user = { user_name, email }
                        const token = jwt.sign(user, process.env.AUTH_TOKEN)
                        return res.status(200).send({...user,token});
                    }
                }
            })
        }


    }
    catch (error) {
        res.status(500).send()
    }
}

exports.verifyUser = async(req, res, next)=>{
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(" ")[1];
        if(!token) return res.sendStatus(401)
        jwt.verify(token, process.env.AUTH_TOKEN, (error, user)=>{
            if(error) return res.sendStatus(403)
            req.user = user
            next()
        })
    }
    catch(error){
        res.status(500).send()
    }
}