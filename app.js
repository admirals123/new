// const express = require('express');
// const redis = require('redis');

// const app = express();
// const port = 4000;

// const client = redis.createClient({
//     host: 'ca-aks-devna-cac-redis.redis.cache.windows.net',
//     port: 6379,
//     password: 'on8OMU8A7XsDFjZPPz4ioHrqfv66u9CBVAzCaNhUtN0='
// });

// // Middleware to parse JSON bodies
// app.use(express.json());

// // Function to set a value in Redis
// function setValue(key, value) {
//     return new Promise((resolve, reject) => {
//         client.set(key, value, (err, result) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// }

// // Function to get a value from Redis
// function getValue(key) {
//     return new Promise((resolve, reject) => {
//         client.get(key, (err, result) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// }

// // Route to set a value in Redis
// app.post('/set', async (req, res) => {
//     const { key, value } = req.body;
//     try {
//         await setValue(key, value);
//         console.log(`Value '${value}' set for key '${key}' in Redis`);
//         res.send('Value set successfully in Redis');
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error setting value in Redis');
//     }
// });

// // Route to get a value from Redis
// app.get('/get/:key', async (req, res) => {
//     const { key } = req.params;
//     try {
//         const result = await getValue(key);
//         console.log(`Value for key '${key}' in Redis: ${result}`);
//         res.send(`Value for key '${key}' in Redis: ${result}`);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Error getting value from Redis');
//     }
// });

// Start the server
// const server = app.listen(port, () => {
//     console.log(`Server listening on port ${port}`);
// });
















// const express = require('express');
// const redis = require("redis");

// // Environment variables for cache
// const cacheHostName = "ca-aks-devna-cac-redis.redis.cache.windows.net";
// const cachePassword = "on8OMU8A7XsDFjZPPz4ioHrqfv66u9CBVAzCaNhUtN0=";

// if(!cacheHostName) throw Error("AZURE_CACHE_FOR_REDIS_HOST_NAME is empty")
// if(!cachePassword) throw Error("AZURE_CACHE_FOR_REDIS_ACCESS_KEY is empty")

// async function testCache() {

//     // Connection configuration
//     const cacheConnection = redis.createClient({
//         // rediss for TLS
//         url: `rediss://${cacheHostName}:6379`,
//         password: cachePassword
//     });

//     // Connect to Redis
//     await cacheConnection.connect();

//     // PING command
//     console.log("\nCache command: PING");
//     console.log("Cache response : " + await cacheConnection.ping());

//     // GET
//     console.log("\nCache command: GET Message");
//     console.log("Cache response : " + await cacheConnection.get("Message"));

//     // SET
//     console.log("\nCache command: SET Message");
//     console.log("Cache response : " + await cacheConnection.set("Message",
//         "Hello! The cache is working from Node.js!"));

//     // GET again
//     console.log("\nCache command: GET Message");
//     console.log("Cache response : " + await cacheConnection.get("Message"));

//     // Client list, useful to see if connection list is growing...
//     console.log("\nCache command: CLIENT LIST");
//     console.log("Cache response : " + await cacheConnection.sendCommand(["CLIENT", "LIST"]));

//     // Disconnect
//     cacheConnection.disconnect()

//     return "Done"
// }

// testCache().then((result) => console.log(result)).catch(ex => console.log(ex));
















const express = require('express');

const app = express();
app.use(express.json());
const redis = require("redis");
// const client = redis.createClient({
//    host: "ca-aks-devna-cac-redis.privatelink.redis.cache.windows.net",
//    port: 6379
// });

const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: 6379,
    password: process.env.REDIS_PASSWORD
});


const PORT = 3000;

app.get('/status', async (request, response) => {
   const status = {
      'Status': 'RunningNewVersion'
   };

   response.send(status);
});

//add a method that connects to an Azure redis instance
app.get('/redis', async (request, response) => {
   await client.connect();
   client.set("name4", "Azure Redis Cached", redis.print);
   const keys = await client.sendCommand(["keys", "*"]);

   for (let key of keys) {
      let value = await client.get(key);
      console.log(`Key: ${key}, Value: ${value}`);
   }
   response.send(keys);
   // Close the connection
   client.quit((err, res) => {
      console.log('Connection closed');
});
});

app.listen(3000, () => {
   console.log("Server Listening on PORT:", 3000);
});
