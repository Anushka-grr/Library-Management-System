const jwt = require("jsonwebtoken");
const { JWT_key, JWT_LIFETIME } = require("../utils/index");

const createJWT = (payload) => {
  return jwt.sign(payload, JWT_key, {
    expiresIn: JWT_LIFETIME,
  });
};
/**
 * @param1 Res : Express response object
 * @param2 Token : Object containing {userId,name}
 */
const attachCookieToResponse = (res, token) => {
  const JWT_token = createJWT(token);
  const date = new Date(Date.now() + 1000 * 60 * 60 * 48); // Get current dateTime and add one day to it.
  console.log(JWT_token, date);
  res.cookie("token", JWT_token, {
    // Flags the cookie to be accessible only by the web server.
    httpOnly: true,
    // Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie.
    // expires: date,
    expiresIn: "7d",
    // Indicates if the cookie should be signed.
    signed: true,
  });
};

const isTokenValid = (token) => jwt.verify(token, JWT_key);

module.exports = { createJWT, isTokenValid, attachCookieToResponse };
