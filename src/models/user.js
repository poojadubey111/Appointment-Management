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

    // manager -> appointments
    user.hasMany(models.appointment, {
      foreignKey: "managerId",
      as: "createdAppointments",
    });

    // developer -> appointments
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

   user.hasMany(models.blockedUser, {
    foreignKey: "userId",
    as: "blockedUserRecords",
});

user.hasMany(models.blockedUser, {
    foreignKey: "blockedUserId",
    as: "blockedByRecords",
});

    // bulk upload
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