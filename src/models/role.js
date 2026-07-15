module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define(
    "role",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.STRING,
        field: 'name',
        allowNull: false,
      },
        description: {
        type: DataTypes.STRING,
        field: 'description',
      },
    },
    {
      freezeTableName: true,
      tableName: "role",
      paranoid: true,
      timestamps: true,
      underscored: true,
    }
  );

  role.associate = (models) => {

    role.hasMany(models.user, {
      foreignKey: "roleId",
      as: "users",
    });
    role.belongsToMany(models.permission, {
      through: models.rolePermission,
      foreignKey: "roleId",
      otherKey: "permissionId",
      as: "permissions",
    });

};
  return role;
};