module.exports = {
    "up": async function (connection, cb) {
        try {
            await connection.promise().query("INSERT INTO `apikeys` VALUES ('d027ffb7a626ed5ae7ddf186efa1ed3ccba3ada6','Rest API Key','fullAccess','app_system',1629373583,1629373583,NULL),('a1b645f71f6a2db92a656c618abd133c60e0176d','Auth Key','authOnly','app_system',1629373583,1629373583,NULL),('dc91d60278e49d98d11ace6eb194b0182e129ddf','DA_192292e8424f8d89_1656','dashboardAccess','app_system',1629373583,1629373583,NULL);")
        } catch (error) {
            console.log(error);
        }
        finally {
            cb();
        }
    },
    "down": async function (connection, cb) {
        try {
            await connection.promise().query("DELETE FROM `apikeys` WHERE apiKey IN ('d027ffb7a626ed5ae7ddf186efa1ed3ccba3ada6', 'a1b645f71f6a2db92a656c618abd133c60e0176d','superhero2','dc91d60278e49d98d11ace6eb194b0182e129ddf');")
        } catch (error) {
            console.log(error);
        }
        finally {
            cb();
        }
    }
}