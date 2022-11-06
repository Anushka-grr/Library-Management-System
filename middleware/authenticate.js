const { isTokenValid } = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
  token = req.signedCookies.token;
  console.log("Request for authenticate user token ===>", token);
  if (!token) {
    return res.status(404).json({ message: "ERROR : NO TOKEN FOUND !!!" });
  }
  try {
    const user = isTokenValid(token);
    console.log("User authenticated user ===>", user);
    req.user = { userId: user.userId, username: user.username };
    next();
  } catch (error) {
    res.status(500).json({
      err: {
        code: "",
        message: `${error}`,
      },
    });
  }
};

module.exports = { authenticateUser };
