const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadPath = path.join(
  process.cwd(),
  "public",
  "uploads"
);

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadPath);
  },

  filename(req, file, cb) {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    ".csv",
    ".xlsx",
    ".xls",
  ];

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  if (allowedTypes.includes(extension)) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Only CSV and Excel files are allowed."
    )
  );
};

module.exports = multer({
  storage,
  fileFilter,
});