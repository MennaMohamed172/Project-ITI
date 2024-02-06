import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  priceAfterDiscount: {
    type: Number,
    default: 0,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    },
  ],
  appliedCoupon: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' }, // New field for applied coupon
  status: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered'], default: 'Pending' },
  paymentMethod: {type: String, enum: ['Cash on Delivery'],default: 'Cash on Delivery',
  },
},

{  timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

const cartModel = mongoose.model('Cart', cartSchema);
export default cartModel;
