const Redis = require('ioredis');
const redis = new Redis({
    maxRetriesPerRequest: 0,
    retryStrategy: function (times) {

    },
    reconnectOnError: function (err) {
        console.log('err.message');
        return "error";
    }
});

module.exports = redis;