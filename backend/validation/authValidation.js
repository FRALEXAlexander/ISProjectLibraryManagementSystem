const Joi = require("joi");

const registerValidation = (data) => {
  const registerSchema = Joi.object({
    username: Joi.string().required(),
    publicKey: Joi.string().required(),
    password: Joi.string().required(),
   
  });
  return registerSchema.validate(data);
};
const loginValidation = (data) => {
  const loginSchema = Joi.object({
    publicKey: Joi.string().required(),
    password: Joi.string().required(),
  });
  return loginSchema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;