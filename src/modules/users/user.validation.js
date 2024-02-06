import Joi from 'joi'

export const  addUserSchema = Joi.object({
    userName: Joi.string().alphanum().min(3).max(10).required(),
    email:Joi.string().email().required(),
    password:Joi.string().pattern(new RegExp(/^[A-Z][a-z0-9]{3,8}$/)).required(),
    CPassword: Joi.ref("password"),
    Address:Joi.string().required(),
    role:Joi.string(),

})

// export const updatUserValidation ={
// body:Joi.object().required().keys({
//     userName:Joi.string().required(),
//     email:Joi.string().email({minDomainSegments:2,tlds:{allow:['com','eg']}}),
//     age:Joi.number().min(15).max(50).required(),
//     password:Joi.string().pattern(new RegExp(/^[A-Z][a-z0-9]{3,8}$/)).required(),
//     CPassword: Joi.ref("password"),
//     gender: Joi.string().valid("Male", "Female").required(),
//     isVerify: Joi.boolean().required(),

// })
// }
