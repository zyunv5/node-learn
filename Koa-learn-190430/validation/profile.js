const validator = require('validator');
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  if (!validator.isLength(data.handle, {
      min: 2,
      max: 40
    })) {
    errors.handle = "handle的长度不能小于6位且不能超过30位";
  }

  console.log(data.handle);
  if (validator.isEmpty(data.handle)) {
    errors.handle = "handle不能为空";
  }

  if (validator.isEmpty(data.status)) {
    errors.status = "status不能为空";
  }

  if (validator.isEmpty(data.skills)) { 
    errors.skills = "skills不能为空";
  }

  if (!validator.isEmpty(data.website)) {
    if (!validator.isURL(data.website))
      errors.website = "URL不合法";
  }


  return {
    errors,
    isValid: isEmpty(errors)
  }
}