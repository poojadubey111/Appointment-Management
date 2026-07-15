module.exports = (sequelize, DataTypes) => {
  const blockedUser = sequelize.define(
    "blockedUser",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      userId: {
        type: DataTypes.UUID,
        field: "user_id",
        allowNull: false,
      },

      blockedUserId: {
        type: DataTypes.UUID,
        field: "blocked_user_id",
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      tableName: "blockedUser",
      paranoid: true,
      timestamps: true,
      underscored: true,

      indexes: [
        {
          unique: true,
          fields: ["user_id", "blocked_user_id"],
        },
      ],
    }
  );

  blockedUser.associate = (models) => {
    blockedUser.belongsTo(models.user, {
      foreignKey: "userId",
      as: "user",
    });

    blockedUser.belongsTo(models.user, {
      foreignKey: "blockedUserId",
      as: "blockedUser",
    });
  };

  return blockedUser;
};