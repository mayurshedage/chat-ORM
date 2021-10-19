'use strict';

module.exports = (
    sequelize, DataTypes
) => {
    const Friend = sequelize.define('friend', {
        uid: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        fuid: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        status: {
            type: DataTypes.ENUM,
            allowNull: false,
            values: ['pending', 'accepted', 'blocked'],
            defaultValue: 'pending'
        },
        createdAt: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.INTEGER(11)
        },
    }, {
        timestamps: false,
        indexes: [
            {
                name: 'friends_uid_index',
                fields: ['uid']
            },
            {
                name: 'friends_fuid_index',
                fields: ['fuid']
            },
        ]
    });
    Friend.associate = function (models) {
        Friend.belongsTo(models.user, {
            foreignKey: { name: 'uid', allowNull: false },
            targetKey: 'uid',
            onDelete: 'cascade',
            onUpdate: 'restrict'
        });
        Friend.belongsTo(models.user, {
            foreignKey: { name: 'fuid', allowNull: false },
            targetKey: 'uid',
            onDelete: 'cascade',
            onUpdate: 'restrict'
        });
    };
    return Friend;
};