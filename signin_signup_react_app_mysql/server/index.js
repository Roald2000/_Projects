import express from 'express';
import cors from 'cors';
import mysql from 'mysql';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.SERVER_HOST_NAME,
    user: process.env.SERVER_HOST_USERNAME,
    password: process.env.SERVER_HOST_PASSWORD,
    database: process.env.SERVER_HOST_DATABASE,
});

app.post('/register', (req, res, next) => {
    const { username, password } = req.body;
    if (username && password) {
        db.query('SELECT username FROM users_tbl WHERE username = ?', [username], (err, data) => {
            if (err) res.status(500).send(err);
            if (data.length !== 0) {
                res.status(409).send({ message: 'Username Taken' });
            } else {
                next();
            }
        });
    } else {
        res.status(404).send({ message: 'Username & Password required!' });
    }
}, (req, res) => {
    const { username, password } = req.body;
    db.query('INSERT INTO users_tbl(username,password) VALUES(?)', [username, password], (insert_error, data) => {
        if (insert_error) res.status(500).send({ error: insert_error });
        res.status(201).send({ message: 'Registration Success!' });
    });

});

app.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    if (username && password) {
        db.query("SELECT username FROM users_tbl WHERE username = ? LIMIT 1", [username], (error_check, response_check) => {
            if (error_check) res.status(500).send({ error: error_check });
            if (response_check.length !== 0) {
                next();
            } else {
                res.status(404).send({ message: `${username} does not exist.` });
            }
        });
    } else {
        res.status(404).send({ message: 'Username & Password required!' });
    }
}, (req, res, next) => {
    const { username, password } = req.body;
    db.query("SELECT username,password FROM users_tbl WHERE username = ? AND password = ? LIMIT 1", [username, password], (error_validation, response_validation) => {
        if (error_validation) res.status(500).send({ error: error_validation });
        if (response_validation.length !== 0) {
            next();
        } else {
            res.status(404).send({ message: `Incorrect Password for ${username}` })
        }
    });
}, (req, res) => {
    const { username } = req.body;
    res.status(200).send({ message: `${username} logged in succesfully!` });
})



app.listen(process.env.SERVER_PORT_ID, () => {
    console.log(`Server Running @ PORT:${process.env.SERVER_PORT_ID}`);
})