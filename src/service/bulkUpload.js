/* eslint-disable max-len */

const XLSX = require("xlsx");
const path = require("path");

const commonFunctions =
  require("../../utils/commonFunctions");

const handleSuccess =
  require("../../utils/successHandler");

const {
  BadRequestError,
  NoDataFoundError,
} = require("../../utils/customError");

exports.uploadBulkUsers = async (
  file,
  uploadedBy
) => {

  if (!file) {
    throw new BadRequestError(
      "Please upload a file."
    );
  }

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (
    ![
      ".xlsx",
      ".xls",
      ".csv",
    ].includes(extension)
  ) {
    throw new BadRequestError(
      "Only CSV and Excel files are allowed."
    );
  }

  const workbook =
    XLSX.readFile(file.path);

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  const rows =
    XLSX.utils.sheet_to_json(sheet);

  if (!rows.length) {
    throw new BadRequestError(
      "Uploaded file is empty."
    );
  }

  const bulkUpload =
    await commonFunctions.create(
      "bulkUpload",
      {

        uploadedBy,

        fileName:
          file.filename,

        originalFileName:
          file.originalname,

        filePath:
           `/uploads/${file.filename}`,

        totalRecords:
          rows.length,

        successCount: 0,

        errorCount: 0,

        status:
          "processing",

      }
    );

  let successCount = 0;

  let errorCount = 0;
  const uploadErrors = [];

    for (
    const [
      index,
      row,
    ] of rows.entries()
  ) {

    try {

      if (
        !row.firstName ||
        !row.lastName ||
        !row.email ||
        !row.password ||
        !row.roleId
      ) {

        const record =
          await commonFunctions.create(
            "bulkUploadRecord",
            {

              bulkUploadId:
                bulkUpload.id,

              rowNumber:
                index + 2,

              status:
                "FAILED",

            }
          );

        await commonFunctions.create(
          "bulkUploadError",
          {

            bulkUploadRecordId:
              record.id,

            field:
              "Required Fields",

            errorMessage:
              "Missing required fields.",

          }
        );
        uploadErrors.push({
          rowNumber: index + 2,
          field: "Required Fields",
          errorMessage: "Missing required fields.",
        });

        errorCount++;

        continue;

      }
            const existingUser =
        await commonFunctions.findOne(
          "user",
          {
            condition: {
              email:
                row.email,
            },
          }
        );

      if (existingUser) {

        const record =
          await commonFunctions.create(
            "bulkUploadRecord",
            {

              bulkUploadId:
                bulkUpload.id,

              rowNumber:
                index + 2,

              status:
                "FAILED",

            }
          );

        await commonFunctions.create(
          "bulkUploadError",
          {

            bulkUploadRecordId:
              record.id,

            field:
              "email",

            errorMessage:
              "Email already exists.",

          }
        );

        uploadErrors.push({
          rowNumber: index + 2,
          field: "email",
          errorMessage: "Email already exists.",
        });

        errorCount++;

        continue;

      }
            const role =
        await commonFunctions.findByPk(
          "role",
          row.roleId
        );

      if (!role) {

        const record =
          await commonFunctions.create(
            "bulkUploadRecord",
            {

              bulkUploadId:
                bulkUpload.id,

              rowNumber:
                index + 2,

              status:
                "FAILED",

            }
          );

        await commonFunctions.create(
          "bulkUploadError",
          {

            bulkUploadRecordId:
              record.id,

            field:
              "roleId",

            errorMessage:
              "Invalid role.",

          }
        );

        uploadErrors.push({
          rowNumber: index + 2,
          field: "roleId",
          errorMessage: "Invalid role.",
        });

        errorCount++;

        continue;

      }
            const createdUser =
        await commonFunctions.create(
          "user",
          {

            firstName:
              row.firstName,

            lastName:
              row.lastName,

            email:
              row.email,

            password:
              row.password,

            roleId:
              row.roleId,

          }
        );

      await commonFunctions.create(
        "bulkUploadRecord",
        {

          bulkUploadId:
            bulkUpload.id,

          rowNumber:
            index + 2,

          userId:
            createdUser.id,

          status:
            "SUCCESS",

        }
      );

      successCount++;
          } catch (error) {

      const record =
        await commonFunctions.create(
          "bulkUploadRecord",
          {

            bulkUploadId:
              bulkUpload.id,

            rowNumber:
              index + 2,

            status:
              "FAILED",

          }
        );

      await commonFunctions.create(
        "bulkUploadError",
        {

          bulkUploadRecordId:
            record.id,

          field:
            "System",

          errorMessage:
            error.message,

        }
      );

      uploadErrors.push({
        rowNumber: index + 2,
        field: "System",
        errorMessage: error.message,
      });

      errorCount++;

    }

  }
    await bulkUpload.update({

    successCount,

    errorCount,

    status:
      "completed",

  });

  return handleSuccess(

    "Users uploaded successfully.",

    {

      id:
        bulkUpload.id,

      totalRecords:
        rows.length,

      successCount,

      errorCount,
      errors: uploadErrors,

    }

  );

};
exports.downloadBulkUploadFile = async (id) => {

  const file =
    await commonFunctions.findByPk(
      "bulkUpload",
      id
    );

  if (!file) {
    throw new NoDataFoundError(
      "File not found."
    );
  }

  return file;
};


exports.fetchBulkUploadHistory = async (query) => {

  const {
    page,
    limit,
    offset,
  } = commonFunctions.getPagination(query);

  const uploads =
    await commonFunctions.findAll(
      "bulkUpload",
      {
        attributes: [
          "id",
          "fileName",
          "originalFileName",
          "successCount",
          "errorCount",
          "status",
          "createdAt",
        ],
           include: [
        {
          association: "records",
          attributes: [
            "id",
            "rowNumber",
            "status",
          ],
          include: [
            {
              association: "errors",
              attributes: [
                "field",
                "errorMessage",
              ],
            },
          ],
        },
      ],
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      }
    );

  return handleSuccess(
    "Bulk upload history fetched successfully.",
    commonFunctions.paginatedResponse({
      page,
      limit,
      result: uploads,
    })
  );
};