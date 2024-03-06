const express = require('express');
const redis = require('redis');

const app = express();
const port = 3000;

const client = redis.createClient({
    host: 'redis-demo-karthik.redis.cache.windows.net',
    port: 6379,
    password: 'r7X4oyXOB3euMeEq6Ts19ako6ef8zfRbLAzCaHyvGZQ='
});

// Middleware to parse JSON bodies
app.use(express.json());

// Function to set a value in Redis
function setValue(key, value) {
    return new Promise((resolve, reject) => {
        client.set(key, value, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Function to get a value from Redis
function getValue(key) {
    return new Promise((resolve, reject) => {
        client.get(key, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Route to set a value in Redis
app.post('/set', async (req, res) => {
    const { key, value } = req.body;
    try {
        await setValue(key, value);
        console.log(`Value '${value}' set for key '${key}' in Redis`);
        res.send('Value set successfully in Redis');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error setting value in Redis');
    }
});

// Route to get a value from Redis
app.get('/get/:key', async (req, res) => {
    const { key } = req.params;
    try {
        const result = await getValue(key);
        console.log(`Value for key '${key}' in Redis: ${result}`);
        res.send(`Value for key '${key}' in Redis: ${result}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error getting value from Redis');
    }
});

// Start the server
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
