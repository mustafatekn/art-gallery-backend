exports.isEmpty = (data) => {
  let errors = {};

  Object.entries(data).map((entry) => {
    if (entry[1].trim() === "") {
      errors = {
        ...errors,
        [entry[0]]: `${entry[0]} field is required`,
      };
    }
  });

  return errors;
};

exports.isMatched = (data) => {
  let errors = {};
  const entries = Object.entries(data);

  if (entries[0][1] !== entries[1][1]) {
    errors = {
      ...errors,
      [entries[0][0]]: `${entries[0][0]}s must match`,
    };
  }

  return errors;
};

exports.isEmail = (email) => {
  let errors = {};

  const emailRegExp =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!emailRegExp.test(String(email))) errors.email = "Email cannot be empty";

  return errors;
};
