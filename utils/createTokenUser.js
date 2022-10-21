const createTokenUser = (user) => {
  return { userID: user._id, name: user.username };
};

module.exports = { createTokenUser };
