require('dotenv').config();

module.exports = (app, req, res, next) => {
    const url = req.url;
    const routePath = url.split("?").shift();
    const routeScope = req['apiType'] === 'client' ? 'sdk' : 'admin';

    if (req.query.debug == 1 && req.query.debugCode == process.env.DEBUG_HASH) {
        req['debug'] = 1;
    }
    req['requestOwner'] = routeScope === 'sdk' ? 'SDK' : 'API';

    require('./' + routePath.split('/')[1] + '/' + routeScope + '/' + routePath.split('/')[2].slice(0, -1) + '.route')(app);

    next();
}