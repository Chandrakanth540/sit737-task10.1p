const express = require('express');
const winston = require('winston');

const app = express();
const port = 8080;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-microservice' },
    transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// Middleware to validate input
const validateInput = (req, res, next) => {
    const { num1, num2 } = req.query;
    if (!num1 || !num2 || isNaN(num1) || isNaN(num2)) {
        logger.error('Invalid input parameters');
        return res.status(400).json({ error: 'Invalid input parameters. Please provide valid numbers.' });
    }
    req.num1 = parseFloat(num1);
    req.num2 = parseFloat(num2);
    next();
};

// Addition endpoint
app.get('/add', validateInput, (req, res) => {
    const result = req.num1 + req.num2;
    logger.info(`Addition: ${req.num1} + ${req.num2} = ${result}`);
    res.json({ result });
});

// Subtraction endpoint
app.get('/subtract', validateInput, (req, res) => {
    const result = req.num1 - req.num2;
    logger.info(`Subtraction: ${req.num1} - ${req.num2} = ${result}`);
    res.json({ result });
});

// Multiplication endpoint
app.get('/multiply', validateInput, (req, res) => {
    const result = req.num1 * req.num2;
    logger.info(`Multiplication: ${req.num1} * ${req.num2} = ${result}`);
    res.json({ result });
});

// Division endpoint
app.get('/divide', validateInput, (req, res) => {
    if (req.num2 === 0) {
        logger.error('Division by zero error');
        return res.status(400).json({ error: 'Cannot divide by zero.' });
    }
    const result = req.num1 / req.num2;
    logger.info(`Division: ${req.num1} / ${req.num2} = ${result}`);
    res.json({ result });
});

app.listen(port, () => {
    logger.info(`Calculator microservice running on http://localhost:${port}`);
});
