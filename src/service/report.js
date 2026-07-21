/* eslint-disable max-len */

const { sequelize } = require("../models");
const { QueryTypes } = require("sequelize");
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");

const commonFunctions =
  require("../../utils/commonFunctions");

const handleSuccess =
  require("../../utils/successHandler");

const {
  appointmentStatus,
  appointmentResponseStatus,
} = require("../../utils/enums");
exports.exportMeetings = async (query) => {

  const where = commonFunctions.buildQueryFilters(
    query,
    [
      "status",
    ],
    [
      "title",
      "description",
    ]
  );

  if (query.fromDate || query.toDate) {

    where.meetingDate = {};

    if (query.fromDate) {
      where.meetingDate[Op.gte] =
        query.fromDate;
    }

    if (query.toDate) {
      where.meetingDate[Op.lte] =
        query.toDate;
    }

  }

  const appointments =
    await commonFunctions.findAllWithoutPagination(
      "appointment",
      {

        condition: where,

        attributes: [
          "title",
          "description",
          "meetingDate",
          "startTime",
          "endTime",
          "status",
        ],

        include: [

          {
            association: "manager",

            attributes: [
              "firstName",
              "lastName",
              "email",
            ],
          },

          {
            association: "developers",

            attributes: [
              "firstName",
              "lastName",
              "email",
            ],

            through: {

              attributes: [
                "responseStatus",
              ],

            },

          },

        ],

      }
    );

  const rows = [];

  appointments.forEach(
    (appointment) => {

      appointment.developers.forEach(
        (developer) => {

          rows.push({

            Title:
              appointment.title,

            Description:
              appointment.description,

            MeetingDate:
              appointment.meetingDate,

            StartTime:
              appointment.startTime,

            EndTime:
              appointment.endTime,

            Status:
              appointment.status,

            Manager:
              `${appointment.manager.firstName} ${appointment.manager.lastName}`,

            Developer:
              `${developer.firstName} ${developer.lastName}`,

            DeveloperEmail:
              developer.email,

            Response:
              developer.appointmentAttendee.responseStatus,

          });

        }
      );

    }
  );

  const workbook =
    XLSX.utils.book_new();

  const worksheet =
    XLSX.utils.json_to_sheet(rows);

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Meetings"
  );

  const exportDir = path.join(
  process.cwd(),
  "public",
  "exports"
);

if (!fs.existsSync(exportDir)) {
  fs.mkdirSync(exportDir, {
    recursive: true,
  });
}

const filePath = path.join(
  exportDir,
  `meetings-${Date.now()}.xlsx`
);

XLSX.writeFile(
  workbook,
  filePath
);

return filePath;

};
exports.fetchMeetingReport = async (query) => {

  const appointmentWhere = {};

  if (query.fromDate || query.toDate) {

    appointmentWhere.meetingDate = {};

    if (query.fromDate) {
      appointmentWhere.meetingDate[Op.gte] =
        query.fromDate;
    }

    if (query.toDate) {
      appointmentWhere.meetingDate[Op.lte] =
        query.toDate;
    }

  }

  const [report] = await sequelize.query(
  `
    SELECT
      COUNT(DISTINCT CASE WHEN a.status = 'scheduled' THEN a.id END) AS scheduled,
      COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) AS completed,
      COUNT(DISTINCT CASE WHEN a.status = 'cancelled' THEN a.id END) AS cancelled,

      COUNT(CASE
              WHEN aa.response_status = 'accepted'
              THEN 1
            END) AS attended,

      COUNT(CASE
              WHEN aa.response_status = 'declined'
              THEN 1
            END) AS declined

    FROM appointment a

    LEFT JOIN "appointmentAttendee" aa
      ON aa.appointment_id = a.id

    WHERE
      (:fromDate IS NULL OR a.meeting_date >= :fromDate)
      AND
      (:toDate IS NULL OR a.meeting_date <= :toDate)
  `,
  {
    replacements: {
      fromDate: query.fromDate || null,
      toDate: query.toDate || null,
    },
    type: QueryTypes.SELECT,
  }
);
return handleSuccess(
  "Meeting report fetched successfully.",
  report
);

};