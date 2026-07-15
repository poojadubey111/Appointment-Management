module.exports = (sequelize, DataTypes) => {
  const bulkUploadRecord = sequelize.define(
    "bulkUploadRecord",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      bulkUploadId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "bulk_upload_id",
      },

      rowNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "row_number",
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: "user_id",
      },

      status: {
        type: DataTypes.ENUM("SUCCESS", "FAILED"),
        defaultValue: "SUCCESS",
      },
    },
    {
      tableName: "bulkUploadRecord",
      freezeTableName: true,
      timestamps: true,
      paranoid: true,
      underscored: true,
    }
  );

  bulkUploadRecord.associate = (models) => {

    bulkUploadRecord.belongsTo(models.bulkUpload, {
      foreignKey: "bulkUploadId",
      as: "bulkUpload",
    });

    bulkUploadRecord.belongsTo(models.user, {
      foreignKey: "userId",
      as: "user",
    });

    bulkUploadRecord.hasMany(models.bulkUploadError, {
      foreignKey: "bulkUploadRecordId",
      as: "errors",
    });

  };

  return bulkUploadRecord;
};