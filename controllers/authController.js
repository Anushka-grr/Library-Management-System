//todo get user => if password matches,i.e.,login
const User = require("../models/users");
const validator = require("validator");
const login = async (req, res) => {};
const register = async (req, res) => {
  try {
    //validating username using validator package
    const details = req.body;
    const uname = details.username;
    if (!validator.matches(uname, "^[a-zA-Z0-9_.]*$")) {
      return res.status(500).send("Invalid Username");
    }
    //creating a user in db
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    //using an err object so that frontend can look for an err key in response object to spot an error
    res = {
      err: {
        code: error,
        msg: `${error}`,
      },
    };
  }
};
module.exports = { login, register };
