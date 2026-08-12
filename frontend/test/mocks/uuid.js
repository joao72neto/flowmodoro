// test/mocks/uuid.js
module.exports = {
  v4: () => require("crypto").randomUUID(),
};
