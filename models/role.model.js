'use strict';

module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define('role', {
        role: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        description: {
            type: DataTypes.STRING(255)
        },
        metadata: {
            type: DataTypes.JSON
        },
        createdBy: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        updatedBy: {
            type: DataTypes.STRING(100),
        },
        updatedAt: {
            type: DataTypes.INTEGER(11)
        }
    }, {
        timestamps: false,
        indexes: [
            {
                name: 'roles_name_index',
                fields: ['name']
            },
            {
                name: 'roles_createdby_index',
                fields: ['createdBy']
            },
            {
                name: 'roles_updatedby_index',
                fields: ['updatedBy']
            },
            {
                name: 'roles_createdat_index',
                fields: ['createdAt']
            },
            {
                name: 'roles_updatedat_index',
                fields: ['updatedAt']
            }
        ]
    });
    Role.associate = function (models) {

    };
    return Role;
};