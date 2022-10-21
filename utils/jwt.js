const jwt = require("jsonwebtoken");
const { JWT_key } = require("../utils/index");
const { createTokenUser } = require("./createTokenUser");

const createJWT = (payload) => {
  return jwt.sign(payload, JWT_key, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};
/**
 * @param1 Res : Express response object
 * @param2 Token : Object containing {userId,name}
 */
const attachCookieToResponse = (res, token) => {
  const JWT_token = createJWT(token);
  const date = new Date(Date.now() + 1000 * 60 * 60 * 24); // Get current dateTime and add one day to it.

  res.cookie("token", JWT_token, {
    // Flags the cookie to be accessible only by the web server.
    httpOnly: true,
    // Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie.
    expires: date,
    // Indicates if the cookie should be signed.
    signed: true,
  });
};

module.exports = { createJWT, attachCookieToResponse };
