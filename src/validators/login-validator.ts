import { checkSchema } from "express-validator";

// first method
// export default [body('email').notEmpty().withMessage("Email is required!")]


// second method

export default checkSchema({
    email: {
        errorMessage: "Email is required.",
        notEmpty: true,
        trim: true,
        isEmail: true
    },

    password: {
        errorMessage: "Password is required.",
        notEmpty: true,
        trim: true,

    }
})