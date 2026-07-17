const { appointmentStatus } = require("../../utils/enums");

module.exports = (sequelize, DataTypes) => {
  const appointment = sequelize.define(
    "appointment",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },

      title: {
        type: DataTypes.STRING,
        field: "title",
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        field: "description",
        allowNull: true,
      },

      managerId: {
        type: DataTypes.UUID,
        field: "manager_id",
        allowNull: false,
      },

      meetingDate: {
        type: DataTypes.DATEONLY,
        field: "meeting_date",
        allowNull: false,
      },
      startTime: {
        type: DataTypes.DATE,
        field: "start_time",
        allowNull: false,
      },

      endTime: {
        type: DataTypes.DATE,
        field: "end_time",
        allowNull: false,
      },


      status: {
        type: DataTypes.ENUM(...Object.values(appointmentStatus)
        ),
        field: "status",
        defaultValue: "scheduled",
      },
    },
    {
      freezeTableName: true,
      tableName: "appointment",
      paranoid: true,
      timestamps: true,
      underscored: true,
    }
  );

  appointment.associate = (models) => {

    // Appointment belongs to Manager
    appointment.belongsTo(models.user, {
      foreignKey: "managerId",
      as: "manager",
    });

    // Appointment has many attendees
    appointment.hasMany(models.appointmentAttendee, {
      foreignKey: "appointmentId",
      as: "attendees",
    });

    // Appointment belongs to many developers
    appointment.belongsToMany(models.user, {
      through: models.appointmentAttendee,
      foreignKey: "appointmentId",
      otherKey: "developerId",
      as: "developers",
    });

  };

  return appointment;
};