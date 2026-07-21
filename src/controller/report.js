/* eslint-disable max-len */

const {
  exportMeetings,
  fetchMeetingReport,
} = require("../service/report");

const response =
  require("../../utils/response");

exports.exportMeetings = async (
  req,
  res
) => {

  const filePath =
    await exportMeetings(
      req.query
    );

  return res.download(
    filePath,
    "meetings.xlsx"
  );

};

exports.getMeetingReport =
async (
  req,
  res
) => {

  const result =
    await fetchMeetingReport(
      req.query
    );

  return response.ok(
    res,
    result
  );

};