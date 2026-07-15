module.exports = (sequelize, DataTypes) => {
  const rolePermission = sequelize.define(
    'rolePermission',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      roleId: {
        type: DataTypes.UUID,
        field: 'role_id',
        allowNull: false,
      },

      permissionId: {
        type: DataTypes.UUID,
        field: 'permission_id',
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      tableName: 'rolePermission',
      paranoid: true,
      timestamps: true,
      underscored: true,

      indexes: [
        {
          unique: true,
          fields: ['role_id', 'permission_id'],
        },
      ],
    }
  );

  rolePermission.associate = (models) => {
    rolePermission.belongsTo(models.role, {
      foreignKey: 'roleId',
      as: 'role',
    });

    rolePermission.belongsTo(models.permission, {
      foreignKey: 'permissionId',
      as: 'permission',
    });
  };

  return rolePermission;
};