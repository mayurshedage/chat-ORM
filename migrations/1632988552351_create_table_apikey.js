module.exports = {
    'up': async function (connection, cb) {
        try {
            await connection.promise().query("CREATE TABLE `apikeys` ("
                + " `apiKey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,"
                + " `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,"
                + " `scope` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'authOnly',"
                + " `createdBy` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,"
                + " `createdAt` int NOT NULL,"
                + " `updatedAt` int DEFAULT NULL,"
                + " `deletedAt` int DEFAULT NULL,"
                + " PRIMARY KEY (`apiKey`),"
                + " KEY `apikeys_name_index` (`name`),"
                + " KEY `apikeys_scope_index` (`scope`),"
                + " KEY `apikeys_createdat_index` (`createdAt`),"
                + " KEY `apikeys_updatedat_index` (`updatedAt`),"
                + " KEY `apikeys_createdby_index` (`createdBy`)"
                + " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
            );

            await connection.promise().query(
                "INSERT INTO `apikeys` VALUES ('d027ffb7a626ed5ae7ddf186efa1ed3ccba3ada6','Rest API Key','fullAccess','app_system',1629373583,1629373583,NULL),('a1b645f71f6a2db92a656c618abd133c60e0176d','Auth Key','authOnly','app_system',1629373583,1629373583,NULL),('dc91d60278e49d98d11ace6eb194b0182e129ddf','DA_192292e8424f8d89_1656','dashboardAccess','app_system',1629373583,1629373583,NULL);"
            );
        } catch (error) {
            console.log(error);
        }
        finally {
            cb();
        }
    },
    'down': "DROP TABLE `apikeys`;"
}