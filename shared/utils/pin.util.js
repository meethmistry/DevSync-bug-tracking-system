const bcrypt = require("bcryptjs");

const hashPin = async (pin) => {
  return await bcrypt.hash(pin, 10);
};

const comparePin = async (pin, hash) => {
  return await bcrypt.compare(pin, hash);
};

module.exports = {
  hashPin,
  comparePin,
};
