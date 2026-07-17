/* eslint-disable max-len */

const db = require("../models");
const { Op } = require("sequelize");
const commonFunctions = require("../../utils/commonFunctions");
const handleSuccess = require("../../utils/successHandler");
const {
    appointmentStatus,
    appointmentResponseStatus,
} = require("../../utils/enums");

const {
    BadRequestError,
    NoDataFoundError,
} = require("../../utils/customError");
exports.respondAppointment = async (
    appointmentId,
    body,
    developerId
) => {

    const attendee =
        await commonFunctions.findOne(
            "appointmentAttendee",
            {
                condition: {
                    appointmentId,
                    developerId,
                },
                include: [
                    {
                        association: "appointment",
                    },
                ],
            }
        );

    if (!attendee) {
        throw new NoDataFoundError(
            "Appointment not found."
        );
    }

    if (
        attendee.appointment.status === appointmentStatus.CANCELLED ||
        attendee.appointment.status === appointmentStatus.COMPLETED
    ) {
        throw new BadRequestError(
            "You cannot respond to this appointment."
        );
    }

    if (new Date(attendee.appointment.startTime) <= new Date()) {
        throw new BadRequestError(
            "You cannot respond after the appointment has started."
        );
    }

    if (attendee.responseStatus !== "pending") {
        throw new BadRequestError(
            "You have already responded to this appointment."
        );
    }

 await attendee.update({
    responseStatus: body.status,
    respondedAt: new Date(),
});

await attendee.reload();

return handleSuccess(
    `Appointment ${body.status} successfully.`,
    attendee
);
};