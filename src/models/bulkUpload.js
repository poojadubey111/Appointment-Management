module.exports = (sequelize, DataTypes) => {
  const bulkUpload = sequelize.define(
    "bulkUpload",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      uploadedBy: {
        type: DataTypes.UUID,
        field: "uploaded_by",
        allowNull: false,
      },

      fileName: {
        type: DataTypes.STRING,
        field: "file_name",
        allowNull: false,
      },

      originalFileName: {
        type: DataTypes.STRING,
        field: "original_file_name",
        allowNull: false,
      },

      filePath: {
        type: DataTypes.TEXT,
        field: "file_path",
        allowNull: false,
      },

      totalRecords: {
        type: DataTypes.INTEGER,
        field: "total_records",
        defaultValue: 0,
      },

      successCount: {
        type: DataTypes.INTEGER,
        field: "success_count",
        defaultValue: 0,
      },

      errorCount: {
        type: DataTypes.INTEGER,
        field: "error_count",
        defaultValue: 0,
      },

      status: {
        type: DataTypes.ENUM(
          "processing",
          "completed",
          "failed"
        ),
        field: "status",
        defaultValue: "processing",
      },

      version: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      freezeTableName: true,
      tableName: "bulkUpload",
      paranoid: true,
      timestamps: true,
      underscored: true,
    }
  );

  bulkUpload.associate = (models) => {
    bulkUpload.belongsTo(models.user, {
      foreignKey: "uploadedBy",
      as: "uploadedByUser",
    });

    bulkUpload.hasMany(models.bulkUploadRecord, {
      foreignKey: "bulkUploadId",
      as: "records",
    });
  };

  return bulkUpload;
};