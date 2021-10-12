'use strict';

module.exports = (sequelize, DataTypes) => {
    const Setting = sequelize.define('setting', {
        key: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        value: {
            type: DataTypes.JSON,
            allowNull: false
        },
        readOnly: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: '0'
        },
        isHidden: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: '0'
        },
        updatedAt: {
            type: DataTypes.INTEGER(11)
        }
    }, {
        timestamps: false,
        indexes: [
            {
                name: 'settings_updatedat_index',
                fields: ['updatedAt']
            }
        ]
    });
    Setting.associate = function (models) {

    };
    return Setting;
};