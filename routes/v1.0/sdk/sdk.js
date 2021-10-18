const { configureCurrentInstance } = require('../../../helpers/global.helper');

module.exports = async (app, req, res, currentRoute) => {
    let debug = new Object();
    let response = new Object();
    let errorCode = 'ERR_BAD_ERROR_RESPONSE';

    const adminRoutes = ['user', 'group'];

    if (adminRoutes.indexOf(currentRoute) != -1) {
        try {
            await configureCurrentInstance(req, res, () => {
                require('./' + currentRoute + '/' + currentRoute + '.route')(app)
            });
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
}