module.exports = (sequelize, DataTypes) => {
  const permission = sequelize.define(
    'permission',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      actionName: {
        type: DataTypes.STRING,
        field: 'action_name',
        allowNull: false,
        unique: true,
      },

      baseUrl: {
        type: DataTypes.STRING,
        field: 'base_url',
        allowNull: false,
      },

      path: {
        type: DataTypes.STRING,
        field: 'path',
        allowNull: false,
      },

      method: {
        type: DataTypes.STRING,
        field: 'method',
        allowNull: false,
      },

      description: {
        type: DataTypes.STRING,
        field: 'description',
        allowNull: true,
      },

      version: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      freezeTableName: true,
      tableName: 'permission',
      paranoid: true,
      timestamps: true,
      underscored: true,
    }
  );

  permission.associate = (models) => {

    permission.belongsToMany(models.role, {
      through: models.rolePermission,
      foreignKey: 'permissionId',
      otherKey: 'roleId',
      as: 'roles',
    });

  };

  return permission;
};