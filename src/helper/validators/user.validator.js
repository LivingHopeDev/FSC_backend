import Joi from "joi";

export const validateUserMiddleware = async (req, res, next) => {
  const userPayload = req.body;
  try {
    await userValidator.validateAsync(userPayload);
    next();
  } catch (error) {
    res.status(406).send(error.details[0].message);
  }
};

export const validateFarmer = async (req, res, next) => {
  const userPayload = req.body;
  try {
    await farmerValidator.validateAsync(userPayload);
    next();
  } catch (error) {
    res.status(406).send(error.details[0].message);
  }
};
const farmerValidator = Joi.object({
  firstName: Joi.string().min(3).max(30).trim().required(),
  lastName: Joi.string().min(3).trim().max(30).required(),
  email: Joi.string().lowercase().email().trim(),
  phoneNumber: Joi.string().trim().required(),
  gender: Joi.string().trim().required(),
  farmLocation: Joi.string().trim().required(),
});
const userValidator = Joi.object({
  first_name: Joi.string().min(3).max(30).trim().required(),
  last_name: Joi.string().min(3).trim().max(30).required(),
  email: Joi.string().lowercase().email().trim().required(),
  role: Joi.string().lowercase().trim(),

  password: Joi.string()
    .min(6)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),

  confirm_password: Joi.string()
    .required()
    .valid(Joi.ref("password"))
    .label("Confirm Password")
    .messages({
      "any.only": "{{#label}} does not match the password",
    }),
});
