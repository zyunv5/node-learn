const validator = require('validator');
const isEmpty = require("./is-empty");

module.exports = function validateEducationInput(data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (validator.isEmpty(data.school)) {
    errors.school = "school不能为空";
  }
  if (validator.isEmpty(data.degree)) {
    errors.degree = "degree不能为空";
  }
  if (validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = "fieldofstudy不能为空";
  }
  if (validator.isEmpty(data.from)) {
    errors.from = "company不能为空";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}