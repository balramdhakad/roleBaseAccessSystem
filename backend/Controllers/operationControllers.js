const createOperation = (req, res) => {
  res.status(200).json("create operation success");
};
const readOperation = (req, res) => {
  res.status(200).json("read operation success");
};
const updateOperation = (req, res) => {
  res.status(200).json("update operation success");
};
const deleteOperation = (req, res) => {
  res.status(200).json("delete operation success");
};

const operationControllers = {
  createOperation,
  readOperation,
  updateOperation,
  deleteOperation,
};

module.exports = operationControllers;
