import { body } from 'express-validator'


export const validateUsername = () => 
    body("username")
        .isString()
        .withMessage("Username should be a string")
        .matches(/^[a-zA-Z0-9]{1,20}$/)
        .withMessage("Username must only contain letters and numbers and be 1-20 characters long");


export const validatePassword = () => 
    body("password")
        .isString()
        .withMessage("Password should be a string")
        .matches(/^[a-zA-Z0-9!@#$%&*]{6,20}$/)
        .withMessage("Password must only contain letters, numbers, special characters: !@#$%&*, and be 6-20 characters long");


export const validateComment = () => 
    body("reply")
        .isString()
        .withMessage("Comment should be a string")
        .trim()
        .customSanitizer((r)=>r.replace(/\n{3,}/g, '\n\n'))
        .isLength({min:1, max:1000})
        .withMessage("Comment is too short or too long");

        
export const validatePost = () => 
    body("text")
        .isString()
        .withMessage("Post should be a string")
        .trim()
        .customSanitizer((r)=>r.replace(/\n{3,}/g, '\n\n'))
        .isLength({min:1, max:10000})
        .withMessage("Post is too short or too long");