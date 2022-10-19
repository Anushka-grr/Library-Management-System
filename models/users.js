const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    maxLength: [20, "use upto 20 characters"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    maxLength: [10, "use upto 10 characters only"],
  },
});
//encrypting the password using bcryptjs package
UserSchema.pre("save", async function () {
  this.password = bcrypt.hashSync(this.password, saltRounds);
});
module.exports = mongoose.model("User", UserSchema);
