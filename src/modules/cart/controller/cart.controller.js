import cartModel from "../../../../db/Models/cart.js";
import userModel from "../../../../db/Models/user.js";
import productModel from '../../../../db/Models/product.js';
import couponModel from "../../../../db/Models/coupon.js";

//******************************************
export const createCart = async (req, res) => {
  try {
    const { userId, products } = req.body;

    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate total price and price after discount based on products
    let totalPrice = 0;
    let priceAfterDiscount = 0;

    for (const product of products) {
      // Check if the product has a valid productId
      if (!product.productId) {
        return res.status(400).json({ message: 'Invalid productId in the product list' });
      }

      const productDetails = await productModel.findById(product.productId);
      if (!productDetails) {
        return res.status(404).json({ message: `Product not found for productId: ${product.productId}` });
      }

      totalPrice += product.quantity * productDetails.productPrice;
      priceAfterDiscount += product.quantity * (productDetails.priceAfterDiscount || productDetails.productPrice);
    }

    // Create the cart
    const newCart = await cartModel.create({
      userId,
      totalPrice,
      priceAfterDiscount,
      products,
    });

    res.json({ message: 'Cart created successfully', cart: newCart });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

//*****************************************
export const updateCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const { userId, products } = req.body;

    // Check if the cart exists
    const existingCart = await cartModel.findById(cartId);
    if (!existingCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if the user is authorized to update the cart (admin or the user who created it)
    if (userId !== existingCart.userId.toString() && !isAdmin(req.user)) {
      return res.status(403).json({ message: 'Unauthorized to update this cart' });
    }

    // Calculate total price and price after discount based on updated products
    let totalPrice = 0;
    let priceAfterDiscount = 0;

    for (const product of products) {
      // Check if the product has a valid productId
      if (!product.productId) {
        return res.status(400).json({ message: 'Invalid productId in the updated product list' });
      }

      const productDetails = await productModel.findById(product.productId);
      if (!productDetails) {
        return res.status(404).json({ message: `Product not found for productId: ${product.productId}` });
      }

      totalPrice += product.quantity * productDetails.productPrice;
      priceAfterDiscount += product.quantity * (productDetails.priceAfterDiscount || productDetails.productPrice);
    }

    // Update the cart details
    existingCart.totalPrice = totalPrice;
    existingCart.priceAfterDiscount = priceAfterDiscount;
    existingCart.products = products;

    // Save the updated cart
    const updatedCart = await existingCart.save();

    res.json({ message: 'Cart updated successfully', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

//******************************************
export const applyCoupon = async (req, res) => {
  try {
    const { cartId, couponCode } = req.params;

    // Check if the cart exists
    const existingCart = await cartModel.findById(cartId);
    if (!existingCart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if a coupon with the provided code exists
    const appliedCoupon = await couponModel.findOne({ couponCode });
    if (!appliedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Update the appliedCoupon field in the cart
    existingCart.appliedCoupon = appliedCoupon._id;

    // Save the updated cart
    const updatedCart = await existingCart.save();

    res.json({ message: 'Coupon applied to cart successfully', cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// ************************************************ Add the Create Order Cash on Delivery function

export const createOrderCashOnDelivery = async (req, res) => {
  try {
    const { userId, cartId } = req.body;

    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the cart exists
    const cart = await cartModel.findById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Create the order
    const newOrder = await cartModel.create({
      userId,
      totalPrice: cart.totalPrice,
      priceAfterDiscount: cart.priceAfterDiscount,
      products: cart.products,
      paymentMethod: 'Cash on Delivery',
    });


    res.json({ message: 'Cash on Delivery order created successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error });
  }
};