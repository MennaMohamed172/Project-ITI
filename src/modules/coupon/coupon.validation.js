import Joi from 'joi';

const couponValidation = Joi.object({
  couponCode: Joi.string().required(),
  value: Joi.number().required(),
  createdBy: Joi.string(),
});

export default couponValidation;
