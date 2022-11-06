const { attachCookieToResponse } = require("../utils/jwt");
const User = require("../models/users");
const { validateLogin, validateRegister } = require("../middleware/validator");

const login = async (req, res) => {
  try {
    //validating the user request using joi
    const { error, value } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({
        message: `${error}`,
      });
    }
    const { username, password } = value;

    const savedUser = await User.findOne({ username });
    console.log(savedUser);
    if (!savedUser) {
      return res.status(404).json({
        message: "No user with this username",
      });
    }
    const passwordVerified = await savedUser.comparePassword(password);
    if (!passwordVerified) {
      return res.status(401).json({
        message: "Wrong Password",
      });
    }
    //assigning jwt token
    console.info("Attached cookie to response", req.cookie);
    const user = {
      username: savedUser.username,
      userId: savedUser._id,
    };
    const token = {
      userId: user.userId,
      username: user.username,
    };
    attachCookieToResponse(res, token);
    res.status(200).json(user);
    // res.redirect(`/api/v1/${user.userId}`);
  } catch (error) {
    res = {
      err: {
        code: error,
        msg: `${error}`,
      },
    };
  }
};
const register = async (req, res) => {
  try {
    //validating username using joi package
    const { error, value } = validateRegister(req.body);
    if (error) {
      return res.status(400).json({
        message: `${error}`,
      });
    }
    const { username, password } = value;
    // const uname = details.username;
    const savedUser = await User.findOne({
      username,
    });
    if (savedUser) {
      return res.status(409).json({
        msg: "user exists",
      });
    }

    //creating a user in db
    const user = await User.create({
      username,
      password,
    });
    const token = {
      userId: user.userId,
      username: user.username,
    };
    attachCookieToResponse(res, token);
    res.status(201).json({
      user: token,
    });
  } catch (error) {
    console.error(
      `Error while registering data: ${JSON.stringify(req.body)}`,
      error
    );
    //using an err object so that frontend can look for an err key in response object to spot an error
    res.status(400).json({
      err: {
        code: error,
        message: `${error}`,
      },
    });
  }
};
module.exports = { login, register };
