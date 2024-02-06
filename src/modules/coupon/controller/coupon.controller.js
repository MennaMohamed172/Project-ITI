import couponModel from '../../../../db/Models/coupon.js';
import userModel from '../../../../db/Models/user.js';
import productModel from '../../../../db/Models/product.js';

export const addCoupon = async (req, res) => {
    try {
      const { couponCode, value } = req.body;
      const createdBy = await userModel.findById(req.body.createdBy);
      const currentDate = new Date();
      const expireIn = new Date(currentDate.getTime() + 10 * 24 * 60 * 60 * 1000); // Coupon expires in 10 days
  
      const newCoupon = await couponModel.create({
        couponCode,
        value,
        createdBy,
        expireIn,
      });
  
      res.send({ message: "Coupon created", coupon: newCoupon });
    } catch (error) {
      res.status(500).json({ message: error.message, data: null });
    }
  };

  // **************************************** update coupon

  export const updateCoupon = async (req, res) => {
    try {
      const couponId = req.params.id;
      const { couponCode, value } = req.body;
  
      // Check if the coupon exists
      const existingCoupon = await couponModel.findById(couponId);
      if (!existingCoupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
  
      // Update coupon details
      existingCoupon.couponCode = couponCode;
      existingCoupon.value = value;
  
      // Save the updated coupon
      const updatedCoupon = await existingCoupon.save();
  
      res.json({ message: 'Coupon updated successfully', coupon: updatedCoupon });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  };

  // *************************************  delete  Coupon

  export const deleteCoupon = async (req, res) => {
    try {
      const couponId = req.params.id;
  
      // Check if the coupon exists
      const deletedCoupon = await couponModel.findByIdAndDelete(couponId);
  
      if (deletedCoupon) {
        res.json({ message: 'Coupon deleted successfully', coupon: deletedCoupon });
      } else {
        res.status(404).json({ message: 'Coupon not found' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message, data: null });
    }
  };

  // ******************************** GetAll Coupon

  export const getAllCoupons = async (req, res) => {
    try {
      const coupons = await couponModel.find();
      res.json({ message: 'All coupons retrieved successfully', coupons });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  };

  // ****************************** Apply coupon to product

  export const applyCouponToProduct = async (req, res) => {
    try {
      const { productId } = req.params;
      const { couponCode } = req.body;
  
      // Check if the product exists
      const product = await productModel.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Check if the coupon exists
      const coupon = await couponModel.findOne({ couponCode });
      if (!coupon) {
        return res.status(404).json({ message: 'Coupon not found' });
      }
  
      // Check if the coupon is still valid
      const currentDate = new Date();
      if (currentDate > coupon.expireIn) {
        return res.status(400).json({ message: 'Coupon has expired' });
      }
  
      // Apply coupon logic, e.g., calculate discounted price
      const discountedPrice = product.productPrice - (product.productPrice * coupon.value) / 100;
  
      res.json({ message: 'Coupon applied successfully', discountedPrice });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error });
    }
  };