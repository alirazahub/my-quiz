// server/index.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
require('dotenv').config({ path: '../.env.local' })


const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

const app = express();
const port = 5000;

// Set up MySQL connection
const db = mysql.createConnection({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
});

app.use(cors());
app.use(bodyParser.json());

// Get all questions from the database
app.get('/api/questions', (req, res) => {
  const sql = 'SELECT * FROM quiz_questions';
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: 'Failed to retrieve questions' });
    } else {
      res.json(result);
    }
  });
});
app.post('/api/submit', (req, res) => {
    const userAnswers = req.body.answers; // Array containing user-selected answers
    const sql = 'SELECT correctAnswer FROM quiz_questions';
    db.query(sql, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Failed to fetch answers' });
      } else {
        const correctAnswers = results.map((item) => item.correctAnswer);
        const score = userAnswers.reduce(
          (totalScore, answer, index) =>
            totalScore + (answer === correctAnswers[index] ? 1 : 0),
          0
        );
        res.json({ score });
      }
    });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
