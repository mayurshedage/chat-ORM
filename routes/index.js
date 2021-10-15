require('dotenv').config();

module.exports = (app, req) => {
    const url = req.url;
    const hostName = req.headers.host;
    const routePath = url.split('?').shift();

    require('./v1.0/apps/app.route')(app);

    let explodedHttpHost = hostName.split('.');
    let mainDomainParts = explodedHttpHost.slice(-2);
    let mainDomain = mainDomainParts.join('.')
    let allowedMainDomians = process.env.ALLOWED_API_DOMAINS.split(',');

    if (mainDomain.indexOf(allowedMainDomians)) {
        let subdomain = explodedHttpHost[0];

        if (explodedHttpHost.length == 4) {
            subdomain = explodedHttpHost[1];
        }

        let subdomainPrefix = subdomain.split('-')[0];
        let routes = {
            api: 'admin',
            apiclient: 'sdk'
        }
        if (req.query.debug && req.query.debug == process.env.DEBUG_HASH) {
            req['debug'] = 1;
        }

        if (routes.hasOwnProperty(subdomainPrefix)) {
            require('./' + routePath.split('/')[1] + '/' + routes[subdomainPrefix] + '/' + routes[subdomainPrefix])(app, routePath.split('/')[2].slice(0, -1), req);
        }
    } else {
        throw new Error('Request URL not found');
    }
}