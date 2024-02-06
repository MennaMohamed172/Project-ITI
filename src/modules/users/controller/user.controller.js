import Joi from "joi";
import userModel from "../../../../db/Models/user.js"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { sendOurEmail, sendResetPasswordMail } from "../../../services/sendEmail.js";
// import {sendOurEmail} from '../../../utils/sendEmail.js'

import randomstring from 'randomstring'; 
// SignUp
export const addUser = async(req, res)=>{
  let {userName,age,email,password,Cpassword,Address} = req.body;
  if(password != Cpassword) return res.json({message:"password and correct password should match"})
      let foundeduser =await  userModel.findOne({email: req.body.email})
      console.log(foundeduser) 
      if (foundeduser){
          res.send("user already rejester ")
      }else{
          let hashedpassword = bcrypt.hashSync(password, 10);
          let addeduser = await userModel.insertMany({userName,age,email,Address,password:hashedpassword})
          let token = jwt.sign({id: addeduser[0]._id}, 'Newuser')
          let url = `http://localhost:5000/user/verify/${token}`
          sendOurEmail(email,url)
          res.json({message:"added",addeduser})  
      }
  }
// verification
export const verification = async (req, res)=>{

  let {token} = req.params
  jwt.verify (token, 'Newuser',async (err,decoded)=>{
      let foundeduser = await userModel.findById(decoded.id)
      if (!foundeduser) return res.json({message:'invalid user'})
      let updateduser = await userModel.findByIdAndUpdate(decoded.id, {isVerify:true},{new:true})
      res.json({message:"verification Done", updateduser})
  })
}
// SignIn
export const signIn = async (req, res, next) => {
  let { email, password } = req.body;
  let foundUser = await userModel.findOne({ email: req.body.email });
  if (!foundUser) {
      return res.status(404).json({ status: 'FAIL', data: { message: 'You need to register first' } });
  }
  if(!foundUser.isVerify){
      return res.json({message: "please verify your account first"})
  }

  let matchedPassword = bcrypt.compareSync(password, foundUser.password);
  if (matchedPassword) {

      let token = jwt.sign({ id: foundUser._id ,role:foundUser.role}, "menna")
      res.status(200).json({ status: 'Online', data: { message: 'welcome', token } });
  } else {
      return res.status(404).json({ status: 'FAIL', data: { message: 'Invalid password' } });
  }
}

const securePassword = async (password) => {
  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Error hashing password: ${error.message}`);
  }
};
// forgetPassword
export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const foundUser = await userModel.findOne({ email });

    if (foundUser) {
      const randomCode = randomstring.generate();
      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 15); // Set expiration to 15 minutes

      const updatedData = await userModel.updateOne(
        { email },
        { $set: { resetCode: randomCode, resetCodeExpiration: expirationTime } }
      );

      // Send the random code to the user via email
      sendResetPasswordMail(foundUser.userName, foundUser.email, randomCode);

      return res.status(200).json({
        status: "SUCCESS",
        data: { message: 'Please check your email for the verification code' }
      });
    } else {
      return res.status(404).json({ status: "FAIL", data: { message: 'User not found' } });
    }
  } catch (error) {
    res.status(500).json({ status: "ERROR", message: error.message, data: null });
  }
};

// verifyCode
export const verifyCode = async (req, res) => {
  try {
      const { email, resetCode } = req.body;

      const foundUser = await userModel.findOne({ email, resetCode });

      if (foundUser) {
          return res.status(200).json({ status: "SUCCESS", data: { message: 'Code verification successful' } });
      } else {
          return res.status(404).json({ status: FAIL, data: { message: 'Invalid code or email' } });
      }
  } catch (error) {
      res.status(500).json({ status: ERROR, message: error.message, data: null });
  }
};

// resetPassword
export const resetPassword = async (req, res) => {
  try {
    const password = req.body.password;
    const user_email = req.body.email;

    if (!user_email) {
      return res.status(400).json({ status: ERROR, message: 'User email is missing', data: null });
    }

    const secure_password = await securePassword(password);
    const updatedData = await userModel.findOneAndUpdate(
      { email: user_email },
      { $set: { password: secure_password, resetCode: '', resetCodeExpiration: null } }
    );

    if (!updatedData) {
      return res.status(404).json({  message: 'User not found', data: null });
    }

    res.json({ status: "SUCCESS", message: 'Password reset success' });
  } catch (error) {
    res.status(500).json({ status: "ERROR", message: error.message, data: null });
  }
};

// Update user data (only admin can do it )
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updatedData = req.body; // Assuming you send the updated data in the request body

    // Check if the user with the given ID exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Perform the update only if the user is an admin
    if (req.userRole === 'admin') {
      // Update the user data
      await userModel.findByIdAndUpdate(userId, updatedData);
      return res.json({ message: 'User data updated successfully' });
    } else {
      return res.status(403).json({ message: 'Unauthorized. Only admins can update user data.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

//  Deactivate user
  export const logout = async (req, res) => {
    let id = req.params.id;
  
    await userModel.findOneAndUpdate({ _id: id }, { status: false });
    res.json({ message: "Offline" });
  };