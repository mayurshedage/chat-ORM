'use strict';

module.exports = (sequelize, DataTypes) => {
    const GroupUser = sequelize.define('group_user', {
        uid: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        guid: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        scope: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['admin', 'participant', 'moderator'],
            defaultValue: 'participant'
        },
        isBanned: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
        joinedAt: {
            type: DataTypes.INTEGER(11)
        },
        deletedAt: {
            type: DataTypes.INTEGER(11)
        }
    }, {
        timestamps: false,
        indexes: [
            {
                name: 'group_user_uid_index',
                fields: ['uid']
            },
            {
                name: 'group_user_guid_index',
                fields: ['guid']
            },
            {
                name: 'group_user_scope_index',
                fields: ['scope']
            },
            {
                name: 'group_user_joinedat_index',
                fields: ['joinedat']
            },
            {
                name: 'group_user_isbanned_index',
                fields: ['isbanned']
            },
            {
                name: 'group_user_guid_uid_isbanned_index',
                fields: [`guid`, `uid`, `isBanned`]
            },
            {
                name: 'group_user_guid_uid_isbanned_joinedat_index',
                fields: [`guid`, `uid`, `isBanned`, `joinedAt`]
            }
        ]
    });
    GroupUser.associate = function (models) {
        GroupUser.belongsTo(models.group, {
            foreignKey: { name: 'guid', allowNull: false },
            targetKey: 'guid',
            onDelete: 'cascade',
            onUpdate: 'restrict'
        });
        GroupUser.belongsTo(models.user, {
            foreignKey: { name: 'uid', allowNull: false },
            targetKey: 'uid',
            onDelete: 'cascade',
            onUpdate: 'restrict'
        });
    };
    return GroupUser;
};