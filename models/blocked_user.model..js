'use strict';

module.exports = (sequelize, DataTypes) => {
    const BlockedUser = sequelize.define('blocked_user', {
        uid: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        blockedUid: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        blockedAt: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
    }, {
        timestamps: false,
        indexes: [
        ]
    });
    BlockedUser.associate = function (models) {
        BlockedUser.belongsTo(models.user, {
            foreignKey: { name: 'uid', allowNull: false },
            targetKey: 'uid',
            onDelete: 'cascade',
            onUpdate: 'restrict'
        });
        BlockedUser.belongsTo(models.user, {
            foreignKey: { name: 'blockedUid', allowNull: false },
            targetKey: 'uid',
            onDelete: 'cascade',
            onUpdate: 'restrict'
        });
    };
    return BlockedUser;
};