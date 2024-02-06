import express  from "express"
import { addCategory, addimg ,deleteCategory,updateCategory,getAllCategories,getCategoryByKey,getCategoryById} from "../category/controller/category.controller.js";
import { validation } from "../middleware/validation.js";
import {auth ,adminAuth} from "../middleware/auth.js";
import { updateCategorySchema ,categorySchema} from "./category.validation.js";

const categoryRoutes = express.Router()

categoryRoutes.post("/category",addimg,adminAuth, validation(categorySchema),addCategory)
categoryRoutes.put('/category/update/:id',adminAuth, updateCategory)

categoryRoutes.delete('/category/:id',adminAuth, deleteCategory);
categoryRoutes.get('/getAllCategory',getAllCategories)
categoryRoutes.get('/category/:key',getCategoryByKey)
categoryRoutes.get('/getCategoryById/:id',getCategoryById)

export default categoryRoutes;