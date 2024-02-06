import Joi from "joi";

export const categorySchema = Joi.object({
  categoryName: Joi.string().min(3).max(20).required(),
  image: Joi.string().required(),
});

export const updateCategorySchema = Joi.object({
  categoryName: Joi.string().min(3).max(20),
  image: Joi.string(),
});