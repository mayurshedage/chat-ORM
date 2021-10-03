module.exports = {
    "up": async function (connection, cb) {
        try {
            await connection.promise().query("CREATE TABLE IF NOT EXISTS `users` (`uid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,"
                + " `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,"
                + " `avatar` varchar(3000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,"
                + " `link` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,"
                + " `role` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,"
                + " `status` enum('available','busy','away','offline','invisible') COLLATE utf8mb4_unicode_ci NOT NULL"
                + "  DEFAULT 'offline',"
                + " `lastActiveAt` int DEFAULT NULL,"
                + " `statusMessage` text COLLATE utf8mb4_unicode_ci,"
                + " `metadata` json DEFAULT NULL,"
                + " `credits` int NOT NULL DEFAULT '0',"
                + " `createdBy` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,"
                + " `updatedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,"
                + " `deletedBy` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,"
                + " `createdAt` int NOT NULL,"
                + " `updatedAt` int DEFAULT NULL,"
                + " `deletedAt` int DEFAULT NULL,"
                + " PRIMARY KEY (`uid`),"
                + " KEY `users_name_index` (`name`),"
                + " KEY `users_role_index` (`role`),"
                + " KEY `users_status_index` (`status`),"
                + " KEY `users_credits_index` (`credits`),"
                + " KEY `users_lastactiveat_index` (`lastActiveAt`),"
                + " KEY `users_createdat_index` (`createdAt`),"
                + " KEY `users_updatedat_index` (`updatedAt`),"
                + " KEY `users_deletedat_index` (`deletedAt`),"
                + " KEY `users_createdby_index` (`createdBy`),"
                + " KEY `users_updatedby_index` (`updatedBy`),"
                + " KEY `users_deletedby_index` (`deletedBy`),"
                + " KEY `users_status_name_uid_updatedat_index` (`status`,`name`,`uid`,`updatedAt`),"
                + " FULLTEXT KEY `users_name_ft_idx` (`name`)"
                + " ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
            );
            await connection.promise().query(
                "INSERT INTO `users` VALUES ('app_system','System','','','default','offline',NULL,NULL,NULL,0,'Migration',NULL,NULL,1633270985,1633270985,NULL),('superhero1','Iron Man','https://data-us.cometchat.io/assets/images/avatars/ironman.png','','default','offline',NULL,NULL,NULL,0,'Migration',NULL,NULL,1633270985,1633270985,NULL),('superhero2','Captain America','https://data-us.cometchat.io/assets/images/avatars/captainamerica.png','','default','offline',NULL,NULL,NULL,0,'Migration',NULL,NULL,1633270985,1633270985,NULL),('superhero3','Spiderman','https://data-us.cometchat.io/assets/images/avatars/spiderman.png','','default','offline',NULL,NULL,NULL,0,'Migration',NULL,NULL,1633270985,1633270985,NULL),('superhero4','Wolverine','https://data-us.cometchat.io/assets/images/avatars/wolverine.png','','default','offline',NULL,NULL,NULL,0,'Migration',NULL,NULL,1633270985,1633270985,NULL),('superhero5','Cyclops','https://data-us.cometchat.io/assets/images/avatars/cyclops.png','','default','offline',NULL,NULL,NULL,0,'Migration',NULL,NULL,1633270985,1633270985,NULL);"
            );
        } catch (error) {
            console.log(error);
        }
        finally {
            cb();
        }
    },
    "down": "DROP TABLE `users`;"
}