const Redis = require('ioredis');

const redis = new Redis({
    maxRetriesPerRequest: 0,
    retryStrategy: function (times) {

    },
    reconnectOnError: function (err) {
        console.log('err.message');
        return false;
    }
});

redis.on('error', error => {
    console.error(`${process.env.CACHE_STORE} connection failed: ${error.message}`);
});

module.exports = redis;