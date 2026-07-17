/* eslint-disable max-len */

const db = require("../models");
const { Op } = require("sequelize");
const commonFunctions = require("../../utils/commonFunctions");
const handleSuccess = require("../../utils/successHandler");

const {
    BadRequestError,
    NoDataFoundError,
} = require("../../utils/customError");

exports.createAppointment = async (body, userId) => {

    if (new Date(body.startTime) >= new Date(body.endTime)) {
        throw new BadRequestError(
            "Start time must be earlier than end time."
        );
    }

    const uniqueDeveloperIds = new Set(body.developerIds);

    if (uniqueDeveloperIds.size !== body.developerIds.length) {
        throw new BadRequestError(
            "Duplicate developers are not allowed."
        );
    }

    const developers =
        await commonFunctions.findAllWithoutPagination(
            "user",
            {
                condition: {
                    id: {
                        [Op.in]: body.developerIds,
                    },
                },
            }
        );

    if (developers.length !== body.developerIds.length) {
        throw new BadRequestError(
            "One or more developers not found."
        );
    }

    const existingAppointment =
        await commonFunctions.findOne(
            "appointment",
            {
                condition: {
                    managerId: userId,
                    meetingDate: body.meetingDate,
                    startTime: {
                        [Op.lt]: body.endTime,
                    },
                    endTime: {
                        [Op.gt]: body.startTime,
                    },
                },
            }
        );

    if (existingAppointment) {
        throw new BadRequestError(
            "Manager already has an appointment during this time."
        );
    }

    const conflictingDevelopers =
        await commonFunctions.findAllWithoutPagination(
            "appointmentAttendee",
            {
                condition: {
                    developerId: {
                        [Op.in]: body.developerIds,
                    },
                },
                include: [
                    {
                        association: "appointment",
                        where: {
                            meetingDate: body.meetingDate,
                            startTime: {
                                [Op.lt]: body.endTime,
                            },
                            endTime: {
                                [Op.gt]: body.startTime,
                            },
                        },
                    },
                ],
            }
        );

    if (conflictingDevelopers.length) {
        throw new BadRequestError(
            "One or more developers already have an appointment during this time."
        );
    }
    const appointment = await commonFunctions.create(
        "appointment",
        {
            title: body.title,
            description: body.description,
            managerId: userId,
            meetingDate: body.meetingDate,
            startTime: body.startTime,
            endTime: body.endTime,
            status: body.status || "scheduled",
        }
    );

    await Promise.all(
        body.developerIds.map((developerId) =>
            commonFunctions.create(
                "appointmentAttendee",
                {
                    appointmentId: appointment.id,
                    developerId,
                    responseStatus: "pending",
                }
            )
        )
    );

    return handleSuccess(
        "Appointment created successfully.",
        appointment
    );
};

exports.fetchAppointmentDetails = async (query) => {

    const {
        page,
        limit,
        offset,
    } = commonFunctions.getPagination(query);

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
        await commonFunctions.findAll(
            "appointment",
            {
                condition: where,
                attributes: [
                    "id",
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
                            "id",
                            "firstName",
                            "lastName",
                            "email",
                        ],
                    },
                    {
                        association: "developers",
                        attributes: [
                            "id",
                            "firstName",
                            "lastName",
                            "email",
                        ],
                        through: {
                            attributes: [
                                "responseStatus",
                                "respondedAt",
                            ],
                        },
                    },
                ],
                limit,
                offset,
                order: commonFunctions.buildSort(
                    query,
                    [
                        "meetingDate",
                        "createdAt",
                        "title",
                    ],
                      false
                ),
                // order: [["meetingDate", "ASC"]],
            }
        );

    return handleSuccess(
        "Appointments fetched successfully.",
        commonFunctions.paginatedResponse({
            page,
            limit,
            result: appointments,
        })
    );
};

exports.fetchAppointmentById = async (id) => {

    const appointment = await commonFunctions.findByPk(
        "appointment",
        id,
        {
            attributes: [
                "id",
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
                        "id",
                        "firstName",
                        "lastName",
                        "email",
                    ],
                },
                {
                    association: "developers",
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "email",
                    ],
                    through: {
                        attributes: [
                            "responseStatus",
                            "respondedAt",
                        ],
                    },
                },
            ],
        }
    );

    if (!appointment) {
        throw new NoDataFoundError(
            "Appointment not found."
        );
    }

    const acceptedDevelopers = [];
    const declinedDevelopers = [];
    const pendingDevelopers = [];

    appointment.developers.forEach((developer) => {

        const attendee = developer.appointmentAttendee;

        if (attendee.responseStatus === "accepted") {
            acceptedDevelopers.push(developer);
        } else if (attendee.responseStatus === "declined") {
            declinedDevelopers.push(developer);
        } else {
            pendingDevelopers.push(developer);
        }

    });

    const response = {
        id: appointment.id,
        title: appointment.title,
        description: appointment.description,
        meetingDate: appointment.meetingDate,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        status: appointment.status,
        manager: appointment.manager,
        acceptedDevelopers,
        declinedDevelopers,
        pendingDevelopers,
    };

    return handleSuccess(
        "Appointment fetched successfully.",
        response
    );
};

// exports.updateAppointmentById = async (id, body) => {

//     const appointment = await commonFunctions.findByPk(
//         "appointment",
//         id
//     );

//     if (!appointment) {
//         throw new NoDataFoundError(
//             "Appointment not found."
//         );
//     }

//     const meetingDate =
//         body.meetingDate || appointment.meetingDate;

//     const startTime =
//         body.startTime || appointment.startTime;

//     const endTime =
//         body.endTime || appointment.endTime;

//     if (new Date(startTime) >= new Date(endTime)) {
//         throw new BadRequestError(
//             "Start time must be earlier than end time."
//         );
//     }

//     // Validate developers to be added
//     if (body.addDeveloperIds?.length) {

//         const uniqueDeveloperIds = new Set(
//             body.addDeveloperIds
//         );

//         if (
//             uniqueDeveloperIds.size !==
//             body.addDeveloperIds.length
//         ) {
//             throw new BadRequestError(
//                 "Duplicate developers are not allowed."
//             );
//         }

//         const developers =
//             await commonFunctions.findAllWithoutPagination(
//                 "user",
//                 {
//                     condition: {
//                         id: {
//                             [Op.in]: body.addDeveloperIds,
//                         },
//                     },
//                 }
//             );

//         if (
//             developers.length !==
//             body.addDeveloperIds.length
//         ) {
//             throw new BadRequestError(
//                 "One or more developers not found."
//             );
//         }

//         const conflictingDevelopers =
//             await commonFunctions.findAllWithoutPagination(
//                 "appointmentAttendee",
//                 {
//                     condition: {
//                         developerId: {
//                             [Op.in]: body.addDeveloperIds,
//                         },
//                     },
//                     include: [
//                         {
//                             association: "appointment",
//                             where: {
//                                 id: {
//                                     [Op.ne]: id,
//                                 },
//                                 meetingDate,
//                                 startTime: {
//                                     [Op.lt]: endTime,
//                                 },
//                                 endTime: {
//                                     [Op.gt]: startTime,
//                                 },
//                             },
//                         },
//                     ],
//                 }
//             );

//         if (conflictingDevelopers.length) {
//             throw new BadRequestError(
//                 "One or more developers already have an appointment during this time."
//             );
//         }
//     }

//     // Validate manager conflict
//     const existingAppointment =
//         await commonFunctions.findOne(
//             "appointment",
//             {
//                 condition: {
//                     id: {
//                         [Op.ne]: id,
//                     },
//                     managerId: appointment.managerId,
//                     meetingDate,
//                     startTime: {
//                         [Op.lt]: endTime,
//                     },
//                     endTime: {
//                         [Op.gt]: startTime,
//                     },
//                 },
//             }
//         );

//     if (existingAppointment) {
//         throw new BadRequestError(
//             "Manager already has an appointment during this time."
//         );
//     }

//     // Update appointment details
//     await appointment.update({
//         title:
//             body.title ?? appointment.title,
//         description:
//             body.description ??
//             appointment.description,
//         meetingDate,
//         startTime,
//         endTime,
//         status:
//             body.status ??
//             appointment.status,
//     });

//     // Add Developers
//     if (body.addDeveloperIds?.length) {

//         const existingAttendees =
//             await commonFunctions.findAllWithoutPagination(
//                 "appointmentAttendee",
//                 {
//                     condition: {
//                         appointmentId: id,
//                     },
//                 }
//             );

//         const existingDeveloperIds =
//             existingAttendees.map(
//                 (attendee) =>
//                     attendee.developerId
//             );

//         const developersToAdd =
//             body.addDeveloperIds.filter(
//                 (developerId) =>
//                     !existingDeveloperIds.includes(
//                         developerId
//                     )
//             );

//         if (developersToAdd.length) {

//             await Promise.all(
//                 developersToAdd.map(
//                     (developerId) =>
//                         commonFunctions.create(
//                             "appointmentAttendee",
//                             {
//                                 appointmentId: id,
//                                 developerId,
//                                 responseStatus:
//                                     "pending",
//                             }
//                         )
//                 )
//             );
//         }
//     }

//     // Remove Developers
//     if (body.removeDeveloperIds?.length) {

//         const attendees =
//             await commonFunctions.findAllWithoutPagination(
//                 "appointmentAttendee",
//                 {
//                     condition: {
//                         appointmentId: id,
//                         developerId: {
//                             [Op.in]:
//                                 body.removeDeveloperIds,
//                         },
//                     },
//                 }
//             );

//         if (
//             attendees.length !==
//             body.removeDeveloperIds.length
//         ) {
//             throw new BadRequestError(
//                 "One or more developers are not assigned to this appointment."
//             );
//         }

//         await commonFunctions.destroy(
//             "appointmentAttendee",
//             {
//                 appointmentId: id,
//                 developerId: {
//                     [Op.in]:
//                         body.removeDeveloperIds,
//                 },
//             }
//         );
//     }

//     return handleSuccess(
//         "Appointment updated successfully.",
//         appointment
//     );
// };
exports.deleteAppointmentById = async (id) => {

    const appointment = await commonFunctions.findByPk(
        "appointment",
        id
    );

    if (!appointment) {
        throw new NoDataFoundError(
            "Appointment not found."
        );
    }

    await db.appointmentAttendee.destroy({
        where: {
            appointmentId: id,
        },
    });

    await appointment.destroy();

    return handleSuccess(
        "Appointment deleted successfully."
    );
};