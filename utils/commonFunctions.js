/* eslint-disable no-return-await */

const { Op } = require("sequelize");
const { body } = require("express-validator");
const db = require("../src/models");

exports.create = async (
  model,
  body,
  isBulk = false,
  transaction = null
) => {
  const options = transaction ? { transaction } : {};

  return isBulk
    ? await db[model].bulkCreate(body, options)
    : await db[model].create(body, options);
};


exports.findOrCreate = async (
  model,
  condition,
  body = {},
  transaction = null
) => {
  const options = {
    where: condition,
    defaults: body,
  };

  if (transaction) {
    options.transaction = transaction;
  }

  return await db[model].findOrCreate(options);
};

exports.findOne = async (model, options = {}) => {
  const {
    condition,
    include,
    attributes,
    order,
    raw = false,
    paranoid,
  } = options;

  return await db[model].findOne({
    ...(condition && { where: condition }),
    ...(include && { include }),
    ...(attributes && { attributes }),
    ...(order && { order }),
    ...(paranoid !== undefined && { paranoid }),
    raw,
  });
};

exports.findByPk = async (model, id, options = {}) => {
  const {
    include,
    attributes,
    paranoid,
  } = options;

  return await db[model].findByPk(id, {
    ...(include && { include }),
    ...(attributes && { attributes }),
    ...(paranoid !== undefined && { paranoid }),
  });
};

exports.findAll = async (model, options = {}) => {
  const {
    condition,
    include,
    attributes,
    group,
    order,
    limit,
    offset,
    transaction,
    raw = false,
    distinct = true,
    subQuery,
    paranoid,
  } = options;

  return await db[model].findAndCountAll({
    ...(condition && { where: condition }),
    ...(include && { include }),
    ...(attributes && { attributes }),
    ...(group && { group }),
    ...(order && { order }),
    ...(limit !== undefined && { limit }),
    ...(offset !== undefined && { offset }),
    ...(transaction && { transaction }),
    ...(paranoid !== undefined && { paranoid }),
    ...(subQuery === false && { subQuery }),
      logging: console.log, 
    distinct,
    raw,
  });
};

exports.findAllWithoutPagination = async (
  model,
  options = {}
) => {
  const {
    condition,
    include,
    attributes,
    group,
    order,
    transaction,
    raw = false,
    paranoid,
  } = options;

  return await db[model].findAll({
    ...(condition && { where: condition }),
    ...(include && { include }),
    ...(attributes && { attributes }),
    ...(group && { group }),
    ...(order && { order }),
    ...(transaction && { transaction }),
    ...(paranoid !== undefined && { paranoid }),
    raw,
  });
};

exports.update = async (
  model,
  condition,
  body,
  returning = false,
  individualHooks = true,
  transaction = null
) => {
  return await db[model].update(body, {
    where: condition,
    returning,
    individualHooks,
    transaction,
  });
};

exports.destroy = async (
  model,
  condition,
  force = false,
  transaction = null
) => {
  return await db[model].destroy({
    where: condition,
    force,
    transaction,
  });
};

exports.count = async (model, options = {}) => {
  const { condition } = options;

  return await db[model].count({
    where: condition,
  });
};


exports.increment = async (
  model,
  fields,
  condition
) => {
  return await db[model].increment(fields, {
    where: condition,
  });
};

exports.errorWrapper =
  (fn) =>
  (...args) =>
    fn(...args).catch(args[2]);

exports.getPagination = ({ page = 1, limit = 10 }) => {
  page = Number(page);
  limit = Number(limit);

  if (page < 1) page = 1;
  if (limit < 1) limit = 10;

  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset,
  };
};

exports.paginatedResponse = ({
  page,
  limit,
  result,
  fetchAll = false,
}) => {
  if (fetchAll) {
    return {
      totalCount: result.count,
      responses: result.rows,
    };
  }

  return {
    page: Number(page),
    limit: Number(limit),
    totalCount: result.count,
    totalPages: Math.ceil(result.count / limit),
    responses: result.rows,
  };
};

exports.createSearchFilter = (
  fields = [],
  search = ""
) => {
  if (!search) {
    return {};
  }

  return {
    [Op.or]: fields.map((field) => ({
      [field]: {
        [Op.iLike]: `%${search}%`,
      },
    })),
  };
};

exports.buildQueryFilters = (
  query = {},
  filterFields = [],
  searchFields = []
) => {
  const where = {};

  filterFields.forEach((field) => {
    const value = query[field];

    if (
      value === undefined ||
      value === null ||
      value === ""
    ) {
      return;
    }

    // comma separated values
    if (
      typeof value === "string" &&
      value.includes(",")
    ) {
      where[field] = {
        [Op.in]: value
          .split(",")
          .map((v) => v.trim()),
      };
    } else {
      where[field] = value;
    }
  });

  if (query.search && searchFields.length) {
    where[Op.or] = searchFields.map((field) => ({
      [field]: {
        [Op.iLike]: `%${query.search}%`,
      },
    }));
  }

  return where;
};


const DEFAULT_SORT = [
  ["createdAt", "DESC"],
];


exports.buildSort = (
  query,
  allowedFields = [],
  useDefault = true
) => {
  const { sort } = query;

  let orders = [];

  if (sort) {
    orders = sort
      .split(",")
      .map((item) => {
        let [field, direction] =
          item.split(":");

        direction =
          direction?.toUpperCase() === "ASC"
            ? "ASC"
            : "DESC";

        if (
          allowedFields.length &&
          !allowedFields.includes(field)
        ) {
          return null;
        }

        return [field, direction];
      })
      .filter(Boolean);
  }

  if (!useDefault) {
    return orders;
  }

  return orders.length
    ? [...orders, ...DEFAULT_SORT]
    : DEFAULT_SORT;
};

exports.stringField = (
  field,
  label,
  optional = false,
  min = 1,
  max = 255
) => {
  let validator = body(field)
    .trim()
    .isString()
    .withMessage(`${label} must be a string`);

  if (optional) {
    validator = validator.optional();
  } else {
    validator = validator.notEmpty().withMessage(`${label} is required`);
  }

  return validator
    .isLength({ min, max })
    .withMessage(
      `${label} must be between ${min} and ${max} characters`
    );
};

exports.emailField = (
  field,
  label,
  optional = false
) => {
  let validator = body(field)
    .trim()
    .isEmail()
    .withMessage(`Please provide a valid ${label}`);

  return optional
    ? validator.optional()
    : validator.notEmpty().withMessage(`${label} is required`);
};

exports.passwordField = (
  field = "password",
  optional = false
) => {
  let validator = body(field)
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/
    )
    .withMessage(
      "Password must contain uppercase, lowercase, number and special character"
    );

  return optional
    ? validator.optional()
    : validator.notEmpty().withMessage("Password is required");
};

exports.uuidField = (
  field,
  label,
  optional = false
) => {
  let validator = body(field)
    .isUUID()
    .withMessage(`${label} must be a valid UUID`);

  return optional
    ? validator.optional()
    : validator.notEmpty().withMessage(`${label} is required`);
};

exports.uuidArrayField = (
  field,
  label,
  optional = false
) => {
  let validator = body(field)
    .isArray({ min: 1 })
    .withMessage(`${label} must be a non-empty array`);

  if (optional) {
    validator = validator.optional();
  }

  return [
    validator,
    body(`${field}.*`)
      .isUUID()
      .withMessage(`Each ${label} must be a valid UUID`),
  ];
};

exports.booleanField = (
  field,
  label,
  optional = false
) => {
  let validator = body(field)
    .isBoolean()
    .withMessage(`${label} must be boolean`);

  return optional
    ? validator.optional()
    : validator.notEmpty().withMessage(`${label} is required`);
};

exports.dateField = (
  field,
  label,
  optional = false
) => {
  let validator = body(field)
    .isISO8601()
    .withMessage(`${label} must be a valid date`);

  return optional
    ? validator.optional()
    : validator.notEmpty().withMessage(`${label} is required`);
};

exports.enumField = (
  field,
  label,
  values = [],
  optional = false
) => {
  let validator = body(field)
    .isIn(values)
    .withMessage(`${label} is invalid`);

  return optional
    ? validator.optional()
    : validator.notEmpty().withMessage(`${label} is required`);
};
