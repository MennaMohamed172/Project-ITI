import express from 'express';
import { adminAuth ,auth} from '../middleware/auth.js';
import { createCart ,updateCart ,applyCoupon, createOrderCashOnDelivery } from './controller/cart.controller.js';

const cartRoutes = express.Router();
cartRoutes.post("/addCart", auth,createCart)
cartRoutes.put ("/Cart/:cartId",adminAuth,auth, updateCart)
cartRoutes.put('/Cart/:cartId/apply-coupon/:couponCode',auth, applyCoupon)
cartRoutes.post('/create-order-cash-on-delivery', createOrderCashOnDelivery);

export default cartRoutes;