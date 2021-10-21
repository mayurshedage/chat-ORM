const { configureCurrentInstance } = require('../../../helpers/global.helper');

module.exports = async (app, currentRoute) => {
    app.use('', async (req, res, next) => {
        await configureCurrentInstance(req, res);
        next();
    }, (req, res, next) => {
        let debug = new Object();
        let response = new Object();
        let errorCode = 'ERR_BAD_ERROR_RESPONSE';

        const adminRoutes = ['role', 'user', 'group', 'apikey'];
        if (adminRoutes.indexOf(currentRoute) != -1) {
            try {
                require('./' + currentRoute + '/' + currentRoute + '.route')(app);
                next();
            } catch (error) {
                response['error'] = {
                    code: errorCode,
                    params: []
                }
                debug['route:admin:error'] = error;
                response['debugTrace'] = debug;

                console.log(response);
            }
        }
    });
}