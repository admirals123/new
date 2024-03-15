const express = require('express');
const { SecretClient } = require("@azure/keyvault-secrets");
const { ManagedIdentityCredential } = require("@azure/identity");
const redis = require("redis");

const app = express();
app.use(express.json());

// Azure Key Vault details
const keyVaultName = "your-key-vault-name";
const secretName = "your-redis-secret-name";
const secretVersion = "your-secret-version"; // Optional, if not specified, latest version will be used

// Create a Managed Identity Credential
const credential = new ManagedIdentityCredential();

// Create a SecretClient to get Redis access keys from Azure Key Vault
const keyVaultUrl = `https://${keyVaultName}.vault.azure.net`;
const secretClient = new SecretClient(keyVaultUrl, credential);

// Retrieve Redis access key from Azure Key Vault
async function getRedisAccessKey() {
    const secret = await secretClient.getSecret(secretName, { version: secretVersion });
    return secret.value;
}

// Connect to Redis using Managed Identity and retrieve data
async function retrieveDataFromRedis() {
    const redisAccessKey = await getRedisAccessKey();
    const client = redis.createClient({
        // Connect to Redis using the access key obtained from Key Vault
        password: redisAccessKey
    });

    const data = {};
    await client.connect();
    const keys = await client.sendCommand(["keys", "*"]);
    for (let key of keys) {
        let value = await client.get(key);
        data[key] = value;
    }
    console.log("Data from Redis:", data);
    client.quit();
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

app.listen(4000, () => {
    console.log("Server Listening on PORT:", 4000);
});