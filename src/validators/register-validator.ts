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
    firstName: {
        errorMessage: "Email is required.",
        notEmpty: true,
        trim: true
    },
    password: {
        errorMessage: "Email is required.",
        notEmpty: true,
        trim: true,
        isLength: {
            options: { min: 6 },
            errorMessage: "Password must be at least 6 characters."
        },

    }
})