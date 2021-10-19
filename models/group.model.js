'use strict';

module.exports = (
    sequelize, DataTypes
) => {
    const Group = sequelize.define('group', {
        guid: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM,
            values: ['public', 'password', 'private'],
            allowNull: false,
            defaultValue: 'private'
        },
        password: {
            type: DataTypes.STRING(255)
        },
        icon: {
            type: DataTypes.STRING(3000)
        },
        description: {
            type: DataTypes.STRING(255)
        },
        metadata: {
            type: DataTypes.JSON
        },
        owner: {
            type: DataTypes.STRING(100),
            defaultValue: 'app_system'
        },
        membersCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        createdAt: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        updatedBy: {
            type: DataTypes.STRING(100)
        },
        updatedAt: {
            type: DataTypes.INTEGER(11)
        }
    }, {
        timestamps: false,
        indexes: [
            {
                name: 'groups_name_index',
                fields: ['name']
            },
            {
                name: 'groups_type_index',
                fields: ['type']
            },
            {
                name: 'groups_owner_index',
                fields: ['owner']
            },
            {
                name: 'users_createdat_index',
                fields: ['createdAt']
            },
            {
                name: 'groups_updatedat_index',
                fields: ['updatedAt']
            },
            {
                name: 'groups_updatedby_index',
                fields: ['updatedBy']
            }
        ]
    });
    Group.associate = function (models) {
        Group.belongsTo(models.user, {
            foreignKey: { name: 'owner' },
            targetKey: 'uid',
            onDelete: 'set null',
            onUpdate: 'cascade'
        });
        Group.hasMany(models.group_tag, { foreignKey: 'guid' });
    };
    return Group;
};