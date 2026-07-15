module.exports = (sequelize, DataTypes) => {
  const bulkUploadError = sequelize.define(
    "bulkUploadError",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      bulkUploadRecordId: {
        type: DataTypes.UUID,
        field: "bulk_upload_record_id",
        allowNull: false,
      },

      field: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "field",
      },

      errorMessage: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: "error_message",
      },
    },
    {
      freezeTableName: true,
      tableName: "bulkUploadError",
      paranoid: true,
      timestamps: true,
      underscored: true,
    }
  );

  bulkUploadError.associate = (models) => {
    bulkUploadError.belongsTo(models.bulkUploadRecord, {
      foreignKey: "bulkUploadRecordId",
      as: "bulkUploadRecord",
    });
  };

  return bulkUploadError;
};