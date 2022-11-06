//todo get user => if password matches,i.e.,login
const { attachCookieToResponse } = require("../utils/jwt");
const User = require("../models/users");
const validator = require("validator");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
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
    console.log(savedUser, user);
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
    console.info("Running register function for user", req.user);
    //validating username using validator package
    const { username, password } = req.body;
    // const uname = details.username;

    //TODO: https://www.npmjs.com/package/joi Use joi for validation instead of manual validations.
    if (!username || !password) {
      return res.status(400).json({
        msg: "Username and Password cannot be blank",
      });
    }
    if (!validator.matches(username, "^[a-zA-Z0-9_.]*$")) {
      return res.status(400).send("Invalid Username");
    }

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

    //creating a token for the user
    // const userToken = {
    //   userId: user._id.toString(),
    //   name: user.username,
    // };

    console.info("Attached cookie to response", req.cookie);
    const token = createTokenUser(user);
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
