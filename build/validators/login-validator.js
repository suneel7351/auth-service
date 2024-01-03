"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
// first method
// export default [body('email').notEmpty().withMessage("Email is required!")]
// second method
exports.default = (0, express_validator_1.checkSchema)({
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
});
