import express  from "express"
import { addUser,verification,signIn,forgetPassword,verifyCode,resetPassword, updateUser,logout} from "./controller/user.controller.js"
import { validation } from "../middleware/validation.js";
import { addUserSchema } from "./user.validation.js"
import { adminAuth } from "../middleware/auth.js";
const UserRoutes = express.Router()

UserRoutes.post("/user/signup",validation(addUserSchema) ,addUser);
UserRoutes.get('/user/verify/:token', verification);
UserRoutes.post("/user/signIn",signIn)
UserRoutes.post("/forgetPassword",forgetPassword)
UserRoutes.post('/verifyCode', verifyCode); 
UserRoutes.post('/resetPassword', resetPassword);
UserRoutes.put('/updateUser/:userId', adminAuth, updateUser);
UserRoutes.put("/Deactivate/:id",logout);

export default UserRoutes;