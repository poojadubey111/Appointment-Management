/* eslint-disable max-len */
/* eslint-disable max-lines-per-function */

const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "first_name",
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "last_name",
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        field: "email",
        validate: {
          isEmail: {
            msg: "Please provide a valid email address.",
          },
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
        field: "password",
        validate: {
          is: {
            args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
            msg: "Password must contain uppercase, lowercase, number and special character.",
          },
        },
      },

      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "role_id",
        references: {
          model: "role",
          key: "id",
        },
      },

      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: "is_active",
      },
    },
    {
      freezeTableName: true,
      tableName: "user",
      paranoid: true,
      timestamps: true,
      underscored: true,
    }
  );

  user.associate = (models) => {

    // Manager -> Appointments
    user.hasMany(models.appointment, {
      foreignKey: "managerId",
      as: "createdAppointments",
    });

    // Developer -> Appointments
    user.belongsToMany(models.appointment, {
      through: models.appointmentAttendee,
      foreignKey: "developerId",
      otherKey: "appointmentId",
      as: "appointments",
    });

    user.belongsTo(models.role, {
      foreignKey: "roleId",
      as: "role",
    });

    // Blocked Users
    user.belongsToMany(models.user, {
      through: models.blockedUser,
      foreignKey: "userId",
      otherKey: "blockedUserId",
      as: "blockedUsers",
    });

    // Users who blocked me
    user.belongsToMany(models.user, {
      through: models.blockedUser,
      foreignKey: "blockedUserId",
      otherKey: "userId",
      as: "blockedByUsers",
    });

    // Bulk Upload
    user.hasMany(models.bulkUpload, {
      foreignKey: "uploadedBy",
      as: "bulkUploads",
    });

  };

  user.beforeCreate(async (user) => {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  user.beforeUpdate(async (user) => {
    if (user.changed("password")) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    user.version += 1;
  });

  user.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  return user;
};