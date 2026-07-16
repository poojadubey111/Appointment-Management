const { validate: isUUID } = require('uuid');

module.exports = (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).send('Id is required');
  }

  if (!isUUID(id)) {
    return res.status(400).send('Invalid id, must be a valid UUID');
  }

  next();
};
