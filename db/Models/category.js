import mongoose from "mongoose";

const categorySchema = mongoose.Schema({
  categoryName: {
    type:String,
    required: true,
    trim:true
},
categoryImage: String,
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  }, 
   
},
{
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
}


);

const categoryModel = mongoose.model("Category", categorySchema);
export default categoryModel;