const router = require("express").Router();
const { register, login } = require("../controller/authController");
const { registerSchema, loginSchema } = require("../validator/authValidator");
const validator = require("../middleware/validator");
const limiter = require("../middleware/limiter");

router.post("/register", validator(registerSchema), limiter, register);
router.post("/login", validator(loginSchema), limiter, login);

module.exports = router;
