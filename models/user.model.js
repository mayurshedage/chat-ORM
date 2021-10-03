'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('user', {
        uid: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING
        },
        link: {
            type: DataTypes.STRING
        },
        role: {
            type: DataTypes.BOOLEAN

        },
        status: {
            type: DataTypes.ENUM,
            values: ['available', 'busy', 'away', 'offline', 'invisible'],
            defaultValue: 'offline'
        },
        lastActiveAt: {
            type: DataTypes.INTEGER
        },
        statusMessage: {
            type: DataTypes.TEXT
        },
        credits: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        createdBy: {
            type: DataTypes.STRING
        },
        updatedBy: {
            type: DataTypes.STRING
        },
        deletedBy: {
            type: DataTypes.STRING
        },
        createdAt: {
            type: DataTypes.INTEGER
        },
        updatedAt: {
            type: DataTypes.INTEGER
        },
        deletedAt: {
            type: DataTypes.INTEGER
        },
    }, {
        timestamps: false
    });
    User.associate = function (models) {

    };
    return User;
};
