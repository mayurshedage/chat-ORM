'use strict';

module.exports = (
    sequelize, DataTypes
) => {
    const APIKey = sequelize.define('apikey', {
        apiKey: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        scope: {
            type: DataTypes.STRING(50),
            defaultValue: 'authOnly'
        },
        createdBy: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.INTEGER(11)
        },
        deletedAt: {
            type: DataTypes.INTEGER(11)
        },
    }, {
        timestamps: false,
        indexes: [
            {
                name: 'apikeys_name_index',
                fields: ['name']
            },
            {
                name: 'apikeys_scope_index',
                fields: ['scope']
            },
            {
                name: 'apikeys_createdat_index',
                fields: ['createdAt']
            },
            {
                name: 'apikeys_createdby_index',
                fields: ['createdBy']
            }
        ]
    });
    APIKey.associate = function (models) {

    };
    return APIKey;
};