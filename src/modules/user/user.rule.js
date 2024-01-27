const { Number } = require("../../common/utils/validate.util");

const createUser = {
  query: {
    // age: Number({
    //   min: 1,
    //   max: 5,
    //   required: true,
    // }),
  },
};

module.exports = {
  getUser: createUser,
};
