module.exports = {
    "up": async function (connection, cb) {
        try {
            await connection.promise().query("INSERT INTO `users` VALUES ('app_system','System','','','default','offline',NULL,NULL,NULL,0,'Migration',NULL,NULL,1633270985,1633270985,NULL),('superhero1','Iron Man','https://data-us.cometchat.io/assets/images/avatars/ironman.png','','default','offline',NULL,NULL,NULL,0,'Migration',NULL,NULL,1633270985,1633270985,NULL),('superhero2','Captain America','https://data-us.cometchat.io/assets/images/avatars/captainamerica.png','','default','offline',NULL,NULL,NULL,0,'Migration',NULL,NULL,1633270985,1633270985,NULL),('superhero3','Spiderman','https://data-us.cometchat.io/assets/images/avatars/spiderman.png','','default','offline',NULL,NULL,NULL,0,'Migration',NULL,NULL,1633270985,1633270985,NULL),('superhero4','Wolverine','https://data-us.cometchat.io/assets/images/avatars/wolverine.png','','default','offline',NULL,NULL,NULL,0,'Migration',NULL,NULL,1633270985,1633270985,NULL),('superhero5','Cyclops','https://data-us.cometchat.io/assets/images/avatars/cyclops.png','','default','offline',NULL,NULL,NULL,0,'Migration',NULL,NULL,1633270985,1633270985,NULL);");

            await connection.promise().query("INSERT INTO `apikeys` VALUES ('d027ffb7a626ed5ae7ddf186efa1ed3ccba3ada6','Rest API Key','fullAccess','app_system',1629373583,1629373583,NULL),('a1b645f71f6a2db92a656c618abd133c60e0176d','Auth Key','authOnly','app_system',1629373583,1629373583,NULL),('dc91d60278e49d98d11ace6eb194b0182e129ddf','DA_192292e8424f8d89_1656','dashboardAccess','app_system',1629373583,1629373583,NULL);");

            await connection.promise().query("INSERT INTO `groups` VALUES ('supergroup','Comic Heros\' Hangout','public',NULL,'https://data-us.cometchat.io/assets/images/avatars/supergroup.png',NULL,NULL,'superhero1',3,1629373580,NULL,1629373580);");
        } catch (error) {
            console.log(error);
        }
        finally {
            cb();
        }
    },
    "down": async function (connection, cb) {
        try {
            await connection.promise().query("DELETE FROM users WHERE uid IN ('app_system', 'superhero1','superhero2','superhero3','superhero4','superhero4');");

            await connection.promise().query("DELETE FROM `apikeys` WHERE apiKey IN ('d027ffb7a626ed5ae7ddf186efa1ed3ccba3ada6', 'a1b645f71f6a2db92a656c618abd133c60e0176d','superhero2','dc91d60278e49d98d11ace6eb194b0182e129ddf');");

            await connection.promise().query("DELETE FROM `groups` WHERE guid = 'supergroup';");
        } catch (error) {
            console.log(error);
        }
        finally {
            cb();
        }
    }
}