import express from 'express';
import { addCoupon, applyCouponToProduct, deleteCoupon, getAllCoupons, updateCoupon } from './controller/coupon.controller.js';
import couponValidation from './coupon.validation.js';
import { validation } from "../middleware/validation.js";
import { adminAuth } from '../middleware/auth.js';
const couponRoutes = express.Router();
couponRoutes.post("/addcoupon", validation(couponValidation), addCoupon) 
couponRoutes.put ("/updateCoupon/:id",adminAuth, updateCoupon) 
couponRoutes.delete("/deletCoupon/:id",adminAuth, deleteCoupon)
couponRoutes.get("/getAllCoupon/",getAllCoupons) 
couponRoutes.post('/applyToProduct/:productId', applyCouponToProduct);
export default couponRoutes;