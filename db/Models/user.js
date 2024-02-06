import mongoose from "mongoose";
import Joi from "joi";
let userSchema = new mongoose.Schema({
    userName:{
      type:String,
      require:true,
      trim:true
    },
    email:{
      type:String,
      require:true,
      trim:true,
      unique: true,
        },
    password:{
      type:String,
      require:true,
      trim:true,

    },
    status:{
        type:String,
        default:"Offline",
        enum:["Offline","Online"]
      },

      isVerify: {
        type: Boolean,
        default: false,
      },
      Address: [{
        city: { type: String, trim: true },
        country: { type: String, trim: true },
        street:{type: String, trim: true}
    }],
   role:{
    type:String,
    enum:["admin","user"],
    default:"user"
   },
   isAdmin:{
    type:Boolean,
    default:false
   },
   resetCode:{
    type:String,
    default:''
}
   
   
},{
    timestamps:true
});
const userModel =mongoose.model('User', userSchema);

export default userModel;