const redis = require('../libraries/redisClient');
const AppResponse = require('../helpers/response.helper');

const rateLimiter = ({ timeLimit, allowedHits }) => {
    return async (req, res, next) => {
        let response = new Object({
            req: req,
            res: res
        });
        let debug = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        const requests = await redis.incr(ip);

        let ttl;
        try {
            if (requests === 1) {
                await redis.expire(ip, timeLimit)
                ttl = timeLimit
            } else {
                ttl = await redis.ttl(ip)
            }
            if (requests > allowedHits) {
                response['error'] = {
                    code: 'ERR_TOO_MANY_REQUESTS',
                    params: {
                        maxAllowedRequests: allowedHits,
                        retryAfter: ttl
                    }
                }
            } else {
                return next();
            }
        } catch (error) {
            response['error'] = {
                code: errorCode,
                params: []
            }
            debug['mw:rateLimitter:validate:error'] = error;
        }
        response['debugTrace'] = debug;

        AppResponse.send(response);
    }
}

module.exports = rateLimiter;