/* eslint-disable import/no-extraneous-dependencies */
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const swaggerUi = require("swagger-ui-express");
const config = require("./config/environmentConfig");
const router = require("./routes/indexRoute");
const swaggerDocument = require("./swagger.json");
const webhook = require("./utils/webhook");
require("./config/databaseConfig").databaseConnect();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/", webhook);

app.listen(config.PORT, () => {
  console.log(`Listing on port ${config.PORT}`);
});
