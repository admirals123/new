const express = require('express');
const redis = require("redis");
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Function to decrypt the encrypted connection string
function decryptConnectionString(encryptedString, key) {
    const decipher = crypto.createDecipher('aes-256-cbc', key);
    let decrypted = decipher.update(encryptedString, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

// Retrieve the encrypted connection string and encryption key from environment variables
const encryptedConnectionString = process.env.ENCRYPTED_CONNECTION_STRING;
const encryptionKey = process.env.ENCRYPTION_KEY;

// Decrypt the connection string
const connectionString = decryptConnectionString(encryptedConnectionString, encryptionKey);

// Create Redis client
const client = redis.createClient(connectionString, { tls: { servername: "your-redis-host" } });

// Retrieve data from Redis
async function retrieveDataFromRedis() {
    const keys = await client.sendCommand(["keys", "*"]);
    const data = {};
    for (let key of keys) {
        let value = await client.get(key);
        data[key] = value;
    }
    console.log("Data from Redis:", data);
    return data;
}

// Route to retrieve data from Redis
app.get('/retrieve', async (req, res) => {
    try {
        const data = await retrieveDataFromRedis();
        res.json(data);
    } catch (error) {
        console.error("Error retrieving data from Redis:", error);
        res.status(500).send("Error retrieving data from Redis");
    }
});

// Route to add data to Redis
app.post('/redis', async (req, res) => {
    const { key, value } = req.body;
    if (!key || !value) {
        return res.status(400).send('Key and value are required');
    }
    client.set(key, value, redis.print);
    res.send('Data added successfully');
});

app.listen(4000, () => {
    console.log("Server Listening on PORT:", 4000);
});
