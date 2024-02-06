import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  couponCode: { type: String, required: true },
  value: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deletedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expireIn: { type: Date, required: true },
},
{  timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}
);

const couponModel = mongoose.model('Coupon', couponSchema);

export default couponModel;
