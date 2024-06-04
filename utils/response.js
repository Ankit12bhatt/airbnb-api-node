// response.js

const successResponse = (data = null, message = "Success") => ({
  success: true,
  message,
  data,
});

const errorResponse = (message = "Server Error") => ({
  success: false,
  message,
});
const log = (data = null) => {
  console.log(data);
};

module.exports = {
  successResponse,
  errorResponse,
  log,
};
