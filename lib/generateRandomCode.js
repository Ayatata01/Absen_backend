const findUniqCode = () => {
  const UniqCode = Math.floor((Math.random() * 100 * 1000) / 2);
  return UniqCode;
};

module.exports = { findUniqCode };
