'use strict';

module.exports = (
    sequelize, DataTypes
) => {
    const GroupTag = sequelize.define('group_tag', {
        guid: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        tag: {
            type: DataTypes.STRING(100),
            allowNull: false,
            primaryKey: true
        },
        addedAt: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
        }
    }, {
        timestamps: false,
        indexes: [
            {
                name: 'guid',
                fields: ['guid']
            },
            {
                name: 'tag',
                fields: ['tag']
            },
            {
                name: 'addedAt',
                fields: ['addedAt']
            }
        ]
    });
    GroupTag.associate = function (models) {
        GroupTag.belongsTo(models.group, {
            foreignKey: { name: 'guid', allowNull: false },
            targetKey: 'guid',
            onDelete: 'cascade',
            onUpdate: 'restrict'
        });
    };
    return GroupTag;
};