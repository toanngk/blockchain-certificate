const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to the database
const con = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: 'Aye12345',
    database: 'AccBlockchain'
});

con.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

// SignIn API
app.post('/signin', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM Users WHERE Username = ?';
    con.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }

        if (results.length === 0) {
            console.error('No user found with the provided username');
            res.status(401).send('Invalid username');
            return;
        }

        const user = results[0];

        if (password !== user.Password) {
            console.error('Password does not match');
            res.status(401).send('Invalid password');
            return;
        }

        // Include user role in the response
        res.status(200).send({ message: 'Sign in successful', user: { username: user.Username, role: user.Role } });
    });
});


// SignUp API
app.post('/signup', (req, res) => {
    const { username, fullName, password, role } = req.body;

    // Check if the username already exists
    const checkUserSql = 'SELECT * FROM Users WHERE Username = ?';
    con.query(checkUserSql, [username], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Error executing query');
            return;
        }

        if (results.length > 0) {
            console.error('User already exists');
            res.status(409).send('User already exists');
            return;
        }

        // Create a new user
        const createUserSql = 'INSERT INTO Users (Username, FullName, Password, Role) VALUES (?, ?, ?, ?)';
        con.query(createUserSql, [username, fullName, password, role], (err, result) => {
            if (err) {
                console.error('Error creating user:', err);
                res.status(500).send('Error creating user');
                return;
            }
            console.log('User created successfully');
            res.status(201).send('User created successfully');
        });
    });
});

// Server running
const server = app.listen(8888, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log('Server is listening at http://%s:%s', host, port);
});