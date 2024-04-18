import Joi from "joi";

export const validateProduct = async (req, res, next) => {
  const productPayload = req.body;
  try {
    await userValidator.validateAsync(productPayload);
    next();
  } catch (error) {
    res.status(406).send(error.details[0].message);
  }
};
const userValidator = Joi.object({
  name: Joi.string().min(3).max(30).trim().required(),
  price: Joi.number().required(),
  description: Joi.string().trim().required(),
  quantity: Joi.number().required(),
});
