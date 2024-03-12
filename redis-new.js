const express = require('express');
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
const redis = require("redis");

const app = express();
app.use(express.json());

const keyVaultName = "<your-keyvault-name>";
const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;

// Initialize Azure credentials using managed identity
const credential = new DefaultAzureCredential();

// Create a KeyVault client using the managed identity credentials
const secretClient = new SecretClient(keyVaultUrl, credential);

// Function to retrieve Redis connection string from KeyVault
async function getRedisConnectionString() {
    const secretName = "redis-connection-string";
    const secret = await secretClient.getSecret(secretName);
    return secret.value;
}

const PORT = 3000;

app.get('/status', async (request, response) => {
    const status = {
        'Status': 'RunningNewVersion'
    };
    response.send(status);
});

// Add a method that connects to the Azure Redis instance
app.get('/redis', async (request, response) => {
    try {
        // Retrieve Redis connection string from KeyVault
        const redisConnectionString = await getRedisConnectionString();

        // Create Redis client using the retrieved connection string
        const client = redis.createClient({
            host: redisConnectionString.host,
            port: redisConnectionString.port,
            password: redisConnectionString.password
        });

        // Set a value in Redis cache
        client.set("name4", "Azure Redis Cached", redis.print);

        // Retrieve keys from Redis cache
        client.keys("*", (err, keys) => {
            if (err) throw err;
            // Log each key-value pair
            keys.forEach(async key => {
                const value = await new Promise((resolve, reject) => {
                    client.get(key, (err, value) => {
                        if (err) reject(err);
                        resolve(value);
                    });
                });
                console.log(`Key: ${key}, Value: ${value}`);
            });
            // Send keys as response
            response.send(keys);
            // Close the Redis client connection
            client.quit((err, res) => {
                if (err) console.error('Error closing Redis connection:', err);
                else console.log('Redis connection closed');
            });
        });
    } catch (error) {
        console.error("Error retrieving Redis connection string from KeyVault:", error);
        response.status(500).send("Internal Server Error");
    }
});

app.listen(PORT, () => {
    console.log("Server listening on PORT:", PORT);
});
