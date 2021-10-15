const { configureCurrentInstance } = require('../../../helpers/global.helper');

module.exports = async (app, currentRoute, req) => {
    const adminRoutes = ['apikey', 'group', 'role', 'user'];

    if (adminRoutes.indexOf(currentRoute) != -1) {
        await configureCurrentInstance(req, () => {
            require('./' + currentRoute + '.route')(app)
        });
    }
}