require('dotenv').config();

module.exports = (app) => {
    let version = 'v1.0';

    app.use(`/${version}`, (req, res, next) => {
        require('./' + version + '/apps/app.route')(app);

        const url = req.url;
        const hostName = req.headers.host;
        const routePath = url.split('?').shift();

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
                chat: 'admin',
                chatclient: 'sdk'
            }
            if (
                req.query.debug &&
                req.query.debug == process.env.DEBUG_HASH
            ) {
                req['debug'] = 1;
            }

            if (
                routes.hasOwnProperty(subdomainPrefix) &&
                routePath != '/'
            ) {
                req['requestOwner'] = routes[subdomainPrefix] == 'admin' ? 'API' : 'SDK';
                const currentRoute = routePath.split('/')[2].slice(0, -1);

                try {
                    require('./' + version + '/' + routes[subdomainPrefix] + '/' + routes[subdomainPrefix])(app, currentRoute);
                    next();
                } catch (error) {
                    throw new Error('Request URL not found');
                }
            }
        } else {
            throw new Error('Request URL not found');
        }
    });
}