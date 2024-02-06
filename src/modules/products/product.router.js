import express  from "express"
import { validation } from "../middleware/validation.js";
import { addProduct, addimg,updateProduct,deleteProduct,getAllProducts,getProductByKey,getProductsByCategory } from "../products/controller/product.controller.js";
import { updateProductSchema,addProductSchema } from "./product.validation.js"
import { adminAuth,auth } from "../middleware/auth.js";


const productRoutes = express.Router()

productRoutes.post("/Product",addimg,adminAuth, validation(addProductSchema),addProduct)
productRoutes.put('/Product/:productId',adminAuth, validation(updateProductSchema),updateProduct);
productRoutes.delete('/Product/:id',adminAuth, deleteProduct);
productRoutes.get('/products', getAllProducts);
productRoutes.get('/products/:key',getProductByKey)
productRoutes.get('/getProductsByCategory',getProductsByCategory)
export default productRoutes;   