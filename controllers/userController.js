const user = async (req, res) => {
  const id = req.params.id;
  res.status(200).json({ msg: `HI this is user ${id}` });
};

module.exports = { user };
