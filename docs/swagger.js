const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Appointment Management API",
      version: "1.0.0",
      description: "Appointment Management System APIs",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {},
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [__filename],
};

module.exports = swaggerJsDoc(options);

/**
 * @swagger
 * tags:
 *   - name: Permission
 *     description: Permission Management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePermissionRequest:
 *       type: object
 *       required:
 *         - actionName
 *         - baseUrl
 *         - path
 *         - method
 *       properties:
 *         actionName:
 *           type: string
 *           example: Create Appointment
 *         baseUrl:
 *           type: string
 *           example: /appointment
 *         path:
 *           type: string
 *           example: /
 *         method:
 *           type: string
 *           enum:
 *             - GET
 *             - POST
 *             - PUT
 *             - PATCH
 *             - DELETE
 *           example: POST
 *         description:
 *           type: string
 *           example: Allows user to create appointment
 *
 *     UpdatePermissionRequest:
 *       type: object
 *       properties:
 *         actionName:
 *           type: string
 *           example: Update Appointment
 *         baseUrl:
 *           type: string
 *           example: /appointment
 *         path:
 *           type: string
 *           example: /{id}
 *         method:
 *           type: string
 *           enum:
 *             - GET
 *             - POST
 *             - PUT
 *             - PATCH
 *             - DELETE
 *           example: PUT
 *         description:
 *           type: string
 *           example: Allows user to update appointment
 */

/**
 * @swagger
 * /permission:
 *   post:
 *     summary: Create Permission
 *     description: Create a new permission.
 *     tags:
 *       - Permission
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePermissionRequest'
 *     responses:
 *       201:
 *         description: Permission created successfully.
 *       400:
 *         description: Permission already exists.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

/**
 * @swagger
 * /permission:
 *   get:
 *     summary: Get All Permissions
 *     description: Returns paginated list of permissions.
 *     tags:
 *       - Permission
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Permissions fetched successfully.
 *       401:
 *         description: Unauthorized.
 */

/**
 * @swagger
 * /permission/{id}:
 *   get:
 *     summary: Get Permission By ID
 *     description: Fetch a permission by its ID.
 *     tags:
 *       - Permission
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Permission ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Permission fetched successfully.
 *       404:
 *         description: Permission not found.
 */

/**
 * @swagger
 * /permission/{id}:
 *   put:
 *     summary: Update Permission
 *     description: Update an existing permission.
 *     tags:
 *       - Permission
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Permission ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePermissionRequest'
 *     responses:
 *       200:
 *         description: Permission updated successfully.
 *       400:
 *         description: Permission already exists.
 *       404:
 *         description: Permission not found.
 *       401:
 *         description: Unauthorized.
 */

/**
 * @swagger
 * /permission/{id}:
 *   delete:
 *     summary: Delete Permission
 *     description: Delete a permission by ID.
 *     tags:
 *       - Permission
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Permission ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Permission deleted successfully.
 *       404:
 *         description: Permission not found.
 *       401:
 *         description: Unauthorized.
 */

/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: Appointment Management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateAppointmentRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - meetingDate
 *         - startTime
 *         - endTime
 *         - developerIds
 *       properties:
 *         title:
 *           type: string
 *           example: Sprint Planning
 *         description:
 *           type: string
 *           example: Sprint planning meeting
 *         meetingDate:
 *           type: string
 *           format: date
 *           example: "2026-07-25"
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2026-07-25T10:00:00.000Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: "2026-07-25T11:00:00.000Z"
 *         developerIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           example:
 *             - "b4e8e6d8-2cf3-49ed-88ed-4375880857d9"
 *             - "6dbb7397-5f5d-48f8-8d70-a8a1c89a4f6d"
 *         status:
 *           type: string
 *           enum:
 *             - scheduled
 *             - completed
 *             - cancelled
 *           example: scheduled
 */

/**
 * @swagger
 * /appointment:
 *   post:
 *     summary: Create Appointment
 *     tags:
 *       - Appointment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAppointmentRequest'
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         description: Validation Error
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /appointment:
 *   get:
 *     summary: Get All Appointments
 *     tags:
 *       - Appointment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Appointment list fetched successfully
 */

/**
 * @swagger
 * /appointment/{id}:
 *   get:
 *     summary: Get Appointment By Id
 *     tags:
 *       - Appointment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Appointment fetched successfully
 *       404:
 *         description: Appointment not found
 */

/**
 * @swagger
 * /appointment/{id}:
 *   delete:
 *     summary: Delete Appointment
 *     tags:
 *       - Appointment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 *       404:
 *         description: Appointment not found
 */

/**
 * @swagger
 * tags:
 *   name: Role Permission
 *   description: Role Permission Management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateRolePermissionRequest:
 *       type: object
 *       required:
 *         - roleId
 *         - permissionId
 *       properties:
 *         roleId:
 *           type: string
 *           format: uuid
 *           example: "45142a4b-8a42-4783-9d7d-9d6e3d8c2c41"
 *         permissionId:
 *           type: string
 *           format: uuid
 *           example: "7d2b4b6b-a56f-4b3d-8b15-65ddc4e98c21"
 */

/**
 * @swagger
 * /role-permission:
 *   post:
 *     summary: Assign Permission to Role
 *     tags:
 *       - Role Permission
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRolePermissionRequest'
 *     responses:
 *       201:
 *         description: Role permission created successfully.
 *       400:
 *         description: Role permission already exists.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

/**
 * @swagger
 * /role-permission:
 *   get:
 *     summary: Get Role Permissions
 *     tags:
 *       - Role Permission
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Role permissions fetched successfully.
 *       401:
 *         description: Unauthorized.
 */

/**
 * @swagger
 * /role-permission/{id}:
 *   delete:
 *     summary: Delete Role Permission
 *     tags:
 *       - Role Permission
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Role Permission ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Role permission deleted successfully.
 *       404:
 *         description: Role permission not found.
 *       401:
 *         description: Unauthorized.
 */

/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: Appointment Management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateAppointmentRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - meetingDate
 *         - startTime
 *         - endTime
 *         - developerIds
 *       properties:
 *         title:
 *           type: string
 *           example: Sprint Planning
 *         description:
 *           type: string
 *           example: Sprint Planning Discussion
 *         meetingDate:
 *           type: string
 *           format: date
 *           example: "2026-07-20"
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2026-07-20T10:00:00.000Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: "2026-07-20T11:00:00.000Z"
 *         developerIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           example:
 *             - "b4e8e6d8-2cf3-49ed-88ed-4375880857d9"
 *             - "3cb3f58d-cc4a-4d68-bf67-82e6e7980d78"
 *         status:
 *           type: string
 *           enum:
 *             - scheduled
 *             - completed
 *             - cancelled
 *           example: scheduled
 */

/**
 * @swagger
 * /appointment:
 *   post:
 *     summary: Create Appointment
 *     description: Create a new appointment with one or more developers.
 *     tags:
 *       - Appointment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAppointmentRequest'
 *     responses:
 *       201:
 *         description: Appointment created successfully.
 *       400:
 *         description: Invalid request or validation failed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: You cannot schedule appointment with this user.
 */

/**
 * @swagger
 * /appointment:
 *   get:
 *     summary: Get All Appointments
 *     description: Returns a paginated list of appointments.
 *     tags:
 *       - Appointment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - scheduled
 *             - completed
 *             - cancelled
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-07-01"
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-07-31"
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: meetingDate
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *     responses:
 *       200:
 *         description: Appointments fetched successfully.
 *       401:
 *         description: Unauthorized.
 */

/**
 * @swagger
 * /appointment/{id}:
 *   get:
 *     summary: Get Appointment By ID
 *     description: Returns appointment details along with manager and accepted, declined and pending developers.
 *     tags:
 *       - Appointment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Appointment ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Appointment fetched successfully.
 *       404:
 *         description: Appointment not found.
 */

/**
 * @swagger
 * /appointment/{id}:
 *   delete:
 *     summary: Delete Appointment
 *     description: Delete an appointment by ID.
 *     tags:
 *       - Appointment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Appointment ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Appointment deleted successfully.
 *       404:
 *         description: Appointment not found.
 *       401:
 *         description: Unauthorized.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RespondAppointmentRequest:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum:
 *             - accepted
 *             - declined
 *           example: accepted
 */
/**
 * @swagger
 * tags:
 *   - name: Appointment Attendee
 *     description: Appointment Attendee APIs
 */

/**
 * @swagger
 * /appointment-attendee/respond/{id}:
 *   patch:
 *     summary: Respond to Appointment
 *     description: Developer can accept or decline an appointment invitation before the meeting starts.
 *     tags:
 *       - Appointment Attendee
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Appointment ID
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RespondAppointmentRequest'
 *     responses:
 *       200:
 *         description: Appointment response submitted successfully.
 *       400:
 *         description: Invalid request, appointment already responded, appointment started, cancelled or completed.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Appointment not found.
 */
/**
 * @swagger
 * tags:
 *   - name: Blocked User
 *     description: Blocked User Management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BlockUserRequest:
 *       type: object
 *       required:
 *         - blockedUserId
 *       properties:
 *         blockedUserId:
 *           type: string
 *           format: uuid
 *           example: "3cb3f58d-cc4a-4d68-bf67-82e6e7980d78"
 */

/**
 * @swagger
 * /blocked-user:
 *   post:
 *     summary: Block User
 *     description: Block another user. Blocked users cannot schedule appointments with each other.
 *     tags:
 *       - Blocked User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BlockUserRequest'
 *     responses:
 *       201:
 *         description: User blocked successfully.
 *       400:
 *         description: User already blocked or cannot block yourself.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 */

/**
 * @swagger
 * /blocked-user:
 *   get:
 *     summary: Get Blocked Users
 *     description: Fetch all users blocked by the logged-in user.
 *     tags:
 *       - Blocked User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Blocked users fetched successfully.
 *       401:
 *         description: Unauthorized.
 */

/**
 * @swagger
 * /blocked-user/{blockedUserId}:
 *   delete:
 *     summary: Unblock User
 *     description: Remove a user from the blocked users list.
 *     tags:
 *       - Blocked User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blockedUserId
 *         required: true
 *         description: Blocked User ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User unblocked successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Blocked user not found.
 */
/**
 * @swagger
 * tags:
 *   - name: Bulk Upload
 *     description: Bulk User Upload Management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     BulkUploadRequest:
 *       type: object
 *       required:
 *         - file
 *       properties:
 *         file:
 *           type: string
 *           format: binary
 */

/**
 * @swagger
 * /bulk-upload:
 *   post:
 *     summary: Upload Users in Bulk
 *     description: Upload CSV or Excel file to create multiple users.
 *     tags:
 *       - Bulk Upload
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/BulkUploadRequest'
 *     responses:
 *       201:
 *         description: Users uploaded successfully.
 *       400:
 *         description: Invalid file, empty file or validation failed.
 *       401:
 *         description: Unauthorized.
 */

/**
 * @swagger
 * /bulk-upload:
 *   get:
 *     summary: Get Bulk Upload History
 *     description: Returns paginated bulk upload history.
 *     tags:
 *       - Bulk Upload
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Bulk upload history fetched successfully.
 *       401:
 *         description: Unauthorized.
 */

/**
 * @swagger
 * /bulk-upload/{id}/download:
 *   get:
 *     summary: Download Uploaded File
 *     description: Download the original uploaded CSV or Excel file.
 *     tags:
 *       - Bulk Upload
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Bulk Upload ID
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: File downloaded successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: File not found.
 */

/**
 * @swagger
 * tags:
 *   - name: Reports
 *     description: Meeting Reports and Export APIs
 */

/**
 * @swagger
 * /report/meetings:
 *   get:
 *     summary: Get Meeting Report
 *     description: Returns meeting statistics such as scheduled, completed, cancelled, accepted and declined meetings.
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fromDate
 *         description: Filter report from this date.
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-07-01"
 *       - in: query
 *         name: toDate
 *         description: Filter report till this date.
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-07-31"
 *     responses:
 *       200:
 *         description: Meeting report fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

/**
 * @swagger
 * /report/meetings/export:
 *   get:
 *     summary: Export Meetings
 *     description: Export meeting details to an Excel (.xlsx) file.
 *     tags:
 *       - Reports
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by meeting title.
 *
 *       - in: query
 *         name: description
 *         schema:
 *           type: string
 *         description: Filter by meeting description.
 *
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *             - scheduled
 *             - completed
 *             - cancelled
 *         description: Filter by meeting status.
 *
 *       - in: query
 *         name: fromDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-07-01"
 *         description: Filter meetings from date.
 *
 *       - in: query
 *         name: toDate
 *         schema:
 *           type: string
 *           format: date
 *           example: "2026-07-31"
 *         description: Filter meetings till date.
 *
 *     responses:
 *       200:
 *         description: Excel file downloaded successfully.
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */
/**
 * @swagger
 * tags:
 *   - name: User
 *     description: User Management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *         - roleId
 *       properties:
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: Test@123
 *         roleId:
 *           type: string
 *           format: uuid
 *           example: "45142a4b-8a42-4783-9d7d-9d6e3d8c2c41"
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create User
 *     description: Create a new user.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully.
 *       400:
 *         description: Email already exists.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */

/**
 * @swagger
 * /user/users:
 *   get:
 *     summary: Get Developers
 *     description: Fetch active developers for appointment creation.
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: firstName
 *         schema:
 *           type: string
 *         description: Search by first name.
 *       - in: query
 *         name: lastName
 *         schema:
 *           type: string
 *         description: Search by last name.
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Search by email.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum:
 *             - firstName
 *             - lastName
 *             - createdAt
 *           example: firstName
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *           example: asc
 *     responses:
 *       200:
 *         description: Developers fetched successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 */