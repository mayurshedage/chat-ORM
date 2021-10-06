module.exports = (app, req, res, next) => {
    const url = req.url;
    const routePath = url.split("?").shift();
    const routeScope = req['apiType'] === 'client' ? 'client' : 'admin';

    require('./' + routePath.split('/')[1] + '/' + routeScope + '/' + routePath.split('/')[2].slice(0, -1) + '.route')(app);

    next();
}