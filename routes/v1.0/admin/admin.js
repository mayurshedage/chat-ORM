const { configureCurrentInstance } = require('../../../helpers/global.helper');

module.exports = async (app, req, res, currentRoute) => {
    const adminRoutes = ['apikey', 'group', 'role', 'user'];

    if (adminRoutes.indexOf(currentRoute) != -1) {
        await configureCurrentInstance(req, res, () => {
            require('./' + currentRoute + '.route')(app)
        });
    }
}