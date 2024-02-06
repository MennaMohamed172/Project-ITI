// validation.js
import Joi from 'joi';

export const addProductSchema = Joi.object({
  productName: Joi.string().min(3).max(100).required(),
  slug: Joi.string().required(),
  priceAfterDiscount: Joi.number(),
  finalPrice: Joi.number().required().max(320000),
  imgURL: Joi.string(),
  subcategories: Joi.array().items(Joi.string()), // Assuming subcategories are string IDs
  stock: Joi.number(),
});

export const updateProductSchema = Joi.object({
  productName: Joi.string().min(3).max(100),
  slug: Joi.string(),
  priceAfterDiscount: Joi.number(),
  finalPrice: Joi.number().max(320000),
  imgURL: Joi.string(),
  subcategories: Joi.array().items(Joi.string()), // Assuming subcategories are string IDs
  stock: Joi.number(),
}).min(1); // At least one field is required for an update
