const User = require("../models/users");
const Booking = require("../models/booking");
const { attachCookieToResponse } = require("../utils/jwt");
const validator = require("../utils/validator");
const Joi = require("joi");
//validation using JOI
//userControllerSchemas
const registerSchema = Joi.object({
  username: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9_.]*$"))
    .min(3)
    .max(10)
    .required(),
  emailId: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string()
    // .pattern(new RegExp("^[a-zA-Z0-9@_#]$"))
    .min(3)
    .max(10)
    .required(),
});
const loginSchema = Joi.object({
  username: Joi.string().pattern(new RegExp("^[a-zA-Z0-9_.]*$")).min(3).max(10),
  emailId: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  password: Joi.string()
    // .pattern(new RegExp("^[a-zA-Z0-9@_#]$"))
    .min(3)
    .max(10)
    .required(),
});
//get id and username of all users in the database
const login = async (req, res) => {
  try {
    //validating the user request using joi
    const { error, value } = validator(loginSchema, req.body);

    // If error, throw error.
    if (error) {
      return res.status(400).json({
        message: `${error}`,
      });
    }

    // Get required values
    const { username, password, emailId } = value;

    // If there is no username and there is no email id, throw error
    if (!username && !emailId) {
      return res
        .status(400)
        .json({ message: "Username/Email Id required to login" });
    }

    // Check if user exists with the given username
    let savedUser = await User.findOne({ username });

    if (!savedUser) {
      //  Check if user exists with the given email id
      savedUser = await User.findOne({ emailId });

      // No user found by username or email
      if (!savedUser) {
        return res.status(404).json({
          message: "No user with this username/emailId",
        });
      }
    }

    const passwordVerified = await savedUser.comparePassword(password);

    // Password does not match, throw error
    if (!passwordVerified) {
      return res.status(401).json({
        message: "Wrong Password",
      });
    }

    const user = {
      username: savedUser.username,
      userId: savedUser._id,
      emailId: savedUser.emailId,
    };
    const token = {
      userId: user.userId,
      username: user.username,
      emailId: user.emailId,
    };
    // Assigning jwt token
    attachCookieToResponse(res, token);
    console.info("Attaching cookie to response...", req.cookie);
    res.status(200).json(user);
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
    // Validate request body against register schema.
    const { error, value } = validator(registerSchema, req.body);
    if (error) {
      return res.status(400).json({
        message: `${error}`,
      });
    }
    const { username, password, emailId } = value;
    const savedUser = await User.findOne({
      username,
    });
    if (savedUser) {
      return res.status(409).json({
        msg: "Username already taken",
      });
    }
    //creating a user in db
    const user = await User.create({
      username,
      password,
      emailId,
    });
    //creating jwt token for loggen in user
    const token = {
      userId: user.userId,
      username: user.username,
      emailId: user.emailId,
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
const getAllUsers = async (req, res) => {
  try {
    // Find users by only selecting id and username column.
    const user = await User.find({}, "_id username");
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({
      err: {
        code: error,
        message: `${error}`,
      },
    });
  }
};
//get all bookings of the requested user
const getUserBookings = async (req, res) => {
  try {
    const userId = req.params.id;
    //validate user
    if (userId !== req.user.userId) {
      console.info(`Authorized user ==> ${req.user.userId}  `);
      console.info(`Current User ==> ${userId}`);
      return res.status(400).json({ message: "User Not Authorised" });
    }
    //get active and past bookings
    const bookings = await Booking.find({
      bookedBy: userId,
    });

    if (bookings.length === 0) {
      return res.status(404).json({ message: "NO BOOKING HISTORY FOUND" });
    }

    const userBookings = {
      bookings,
    };

    res.status(200).json(userBookings);
  } catch (error) {
    res.status(500).json({ err: { code: ``, message: `${error}` } });
  }
};

module.exports = {
  registerSchema,
  loginSchema,
  login,
  register,
  getAllUsers,
  getUserBookings,
};

//TODO: implement jwt refresh tokens
