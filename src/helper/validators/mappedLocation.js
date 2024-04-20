import Joi from "joi";

export const validateMappedLocation = async (req, res, next) => {
  const locationPayload = req.body;
  try {
    await mappedLocationValidator.validateAsync(locationPayload);
    next();
  } catch (error) {
    res.status(406).send(error.details[0].message);
  }
};
const mappedLocationValidator = Joi.object({
  country: Joi.string().min(3).max(30).trim().required(),
  state: Joi.string().required(),
  address: Joi.string().trim().required(),
  local_government: Joi.string().required(),
});
