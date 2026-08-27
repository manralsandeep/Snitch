import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
    const errors = validationResult(req);
    //agr error object ke isempty method ko call krke true aaya mtlb koi error nhi hai
    // Agar koi error milta hai
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: errors.array().map((err) => ({
                field: err.path,
                message: err.msg,
            })),
        });
    }

    // Agar koi error nahi hai toh aage controller par jao
    next();
};

export const registerValidation = [
    body("fullname")
        .trim()
        .notEmpty()
        .withMessage("Fullname is required")
        .isLength({ min: 3 })
        .withMessage("Fullname must be at least 3 characters long"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(), // Sanitization: Email ko lower-case aur clean kar deta hai

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("contact")
        .optional()
        .trim()
        .isMobilePhone()
        .withMessage("Please enter a valid mobile number"),

    validate
];


export const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please enter a valid email address")
        .normalizeEmail(),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required"),

    validate
]