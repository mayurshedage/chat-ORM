const redis = require('../libraries/redisClient');

const rateLimiter = ({ timeLimit, allowedHits }) => {
    return async (req, res, next) => {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const requests = await redis.incr(ip);

        let ttl;
        if (requests === 1) {
            await redis.expire(ip, timeLimit)
            ttl = timeLimit
        } else {
            ttl = await redis.ttl(ip)
        }
        if (requests > allowedHits) {
            return res.status(503).json({
                error: 'ERR_RATE_LIMIT_EXCEEDED',
                callsPerMinutes: requests
            });
        } else {
            req.requests = requests;
            req.ttl = ttl;
            next();
        }
    }
}

module.exports = rateLimiter;