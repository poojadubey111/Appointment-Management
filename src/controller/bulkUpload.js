/* eslint-disable max-len */

const fs = require("fs");
const path = require("path");
const {
  uploadBulkUsers,
  fetchBulkUploadHistory,
  downloadBulkUploadFile,
} = require("../service/bulkUpload");

const response = require("../../utils/response");

exports.uploadBulkUsers = async (req, res) => {

  const result = await uploadBulkUsers(
    req.file,
    req.user.id
  );

  return response.created(res, result);

};

exports.getBulkUploadHistory = async (req, res) => {

  const result = await fetchBulkUploadHistory(
    req.query
  );

  return response.ok(res, result);

};

exports.downloadBulkUploadFile = async (req, res) => {

  const file = await downloadBulkUploadFile(req.params.id);

  const absolutePath = path.join(
    process.cwd(),
    "public",
    file.filePath.replace(/^\/+/, "")
  );

  if (!fs.existsSync(absolutePath)) {
    throw new NoDataFoundError(
      "Uploaded file not found on server."
    );
  }

  return res.download(
    absolutePath,
    file.originalFileName
  );

};