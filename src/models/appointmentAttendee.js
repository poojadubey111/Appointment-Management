const { appointmentResponseStatus } = require("../../utils/enums");

module.exports = (sequelize, DataTypes) => {
  const appointmentAttendee = sequelize.define(
    "appointmentAttendee",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      appointmentId: {
        type: DataTypes.UUID,
        field: "appointment_id",
        allowNull: false,
      },

      developerId: {
        type: DataTypes.UUID,
        field: "developer_id",
        allowNull: false,
      },

      responseStatus: {
        type: DataTypes.ENUM(...Object.values(appointmentResponseStatus)
        ),
        field: "response_status",
        defaultValue: "pending",
      },

      respondedAt: {
        type: DataTypes.DATE,
        field: "responded_at",
        allowNull: true,
      },
    },
    {
      freezeTableName: true,
      tableName: "appointmentAttendee",
      paranoid: true,
      timestamps: true,
      underscored: true,

      indexes: [
        {
          unique: true,
          fields: ["appointment_id", "developer_id"],
        },
      ],
    }
  );

  appointmentAttendee.associate = (models) => {

    appointmentAttendee.belongsTo(models.appointment, {
      foreignKey: "appointmentId",
      as: "appointment",
    });

    appointmentAttendee.belongsTo(models.user, {
      foreignKey: "developerId",
      as: "developer",
    });

  };

  return appointmentAttendee;
};