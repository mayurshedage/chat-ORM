module.exports = {
    "up": async function (connection, cb) {
        try {
            await connection.promise().query("INSERT INTO `users` VALUES ('app_system','System','','','default','offline',NULL,NULL,NULL,0,'Migration',NULL,NULL,1633270985,1633270985,NULL),('superhero1','Iron Man','https://data-us.cometchat.io/assets/images/avatars/ironman.png','','default','offline',NULL,NULL,NULL,0,'Migration',NULL,NULL,1633270985,1633270985,NULL),('superhero2','Captain America','https://data-us.cometchat.io/assets/images/avatars/captainamerica.png','','default','offline',NULL,NULL,NULL,0,'Migration',NULL,NULL,1633270985,1633270985,NULL),('superhero3','Spiderman','https://data-us.cometchat.io/assets/images/avatars/spiderman.png','','default','offline',NULL,NULL,NULL,0,'Migration',NULL,NULL,1633270985,1633270985,NULL),('superhero4','Wolverine','https://data-us.cometchat.io/assets/images/avatars/wolverine.png','','default','offline',NULL,NULL,NULL,0,'Migration',NULL,NULL,1633270985,1633270985,NULL),('superhero5','Cyclops','https://data-us.cometchat.io/assets/images/avatars/cyclops.png','','default','offline',NULL,NULL,NULL,0,'Migration',NULL,NULL,1633270985,1633270985,NULL);")
        } catch (error) {
            console.log(error);
        }
        finally {
            cb();
        }
    },
    "down": async function (connection, cb) {
        try {
            await connection.promise().query("DELETE FROM users WHERE uid IN ('app_system', 'superhero1','superhero2','superhero3','superhero4','superhero4');")
        } catch (error) {
            console.log(error);
        }
        finally {
            cb();
        }
    }
}