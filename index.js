import 'dotenv/config'
import express, { json } from "express";
import { connect, Schema, model, Types } from 'mongoose';
import initConnection from "./db/initConnection.js";
import userRoutes from "./src/modules/users/user.route.js";

const server = express()
// middleware  
server.use(json())
initConnection(process.env.MONGO_URI);
server.use("/uploads",express.static("uploads"))
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid'; 
import productModel from './db/Models/product.js';
import productRoutes from './src/modules/products/product.router.js';
import categoryRoutes from './src/modules/category/category.router.js';
import couponRoutes from './src/modules/coupon/coupon.router.js'
import cartRoutes from './src/modules/cart/cart.router.js';
server.use(userRoutes)
server.use(productRoutes)
server.use(categoryRoutes)
server.use(couponRoutes)
server.use(cartRoutes);
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads')
//     },
//     filename: function (req, file, cb) {
//       cb(null, uuidv4() +"_"+ file.originalname);
//     }
//   })
  
//   const upload = multer({ storage: storage })
 
// server.post("/photos",upload.single('profilePicture'),async(req,res)=>{
//     console.log(req.file , req.body)
//     req.body.imgURL="http://localhost:5000/uploads/"+ req.file.filename 
//     let added=await productModel.insertMany(req.body)
//     res.json({message:"Done",added})
// })
let isloggedIn=true
const auth =(req,res,next)=>{
    if(isloggedIn){
        next()
    }else{
        res.json({message:"you need to loggedin first"})
    }
}
server.get("/",auth,(req,res, next)=>{
    res.json({message:"mmn"})
})

server.listen(5000)