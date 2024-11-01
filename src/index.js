const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');

const PORT = process.env.PORT || 5000;
const webApplication = express();

// Connect to Mongodb
const DbUser = 'root';
const DbPORT = '27017';
const IpAddress = 'mongo';

mongoose.connect(`mongodb://${IpAddress}:${DbPORT}`)
.then(() => console.log('Connected to Database'))
.catch(err => console.log(`unable to connect to the db due to ${err}`));


// Connect to redis db
const REDIS_PORT = 6379;
const REDIS_HOST = 'redis';

const redisClient = redis.createClient(
    {
        url: `redis://${REDIS_HOST}:${REDIS_PORT}`
    }
);

redisClient.connect()
            .then( () => console.log('connected to db'))
            .catch(err => console.log(`unable to connect to redis due to ${err}`))

webApplication.get('/', (req, res) => {
    redisClient.set(
        'cashedProduct',
        'Product Sample'
    );
    res.send(`<h1>Simple Node.Js Application!</h1>`)
} );
webApplication.get('/cashedData', async (req, res) => {
    res.send(`<h1>${await redisClient.get('cashedProduct')}</h1>`)
});

webApplication.listen(PORT, () => console.log(`The app had been deployed on PORT: ${PORT}`));
