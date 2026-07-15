require("dotenv").config();

const app = require("./app");
const db = require("./src/models");

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Database Connected");

    await db.sequelize.sync();

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  } catch (err) {
    console.log(err);
  }
})();