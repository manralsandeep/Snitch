


import { body, validationResult } from "express-validator";

const validate = (req, res, next) => {
    const errors = validationResult(req);
    // Agar error object ke isEmpty method ko call karke true aaya matlab koi error nahi hai
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
        .trim()       // Sanitization: Aage-peeche ke faltu spaces hatayega
        .escape()     // SANITIZATION ADDED: <script> jaise tags ko normal text mein badal dega (XSS protection)
        .notEmpty()
        .withMessage("Fullname is required")
        .isLength({ min: 3 })
        .withMessage("Fullname must be at least 3 characters long"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()    // Validation: Check karega ki email valid hai ya nahi
        .withMessage("Please enter a valid email address")
        .normalizeEmail(), // Sanitization: Email ko lower-case aur standard format mein clean kar deta hai

    body("password")
        // YAHAN SE .trim() HATA DIYA: Kyunki password mein blank spaces valid character mane jate hain. 
        // Password modify nahi karna chahiye.
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("contact")
        .optional()
        .trim()
        .isMobilePhone() // Validation: Check karega ki mobile number valid hai ya nahi
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
        // YAHAN SE BHI .trim() HATA DIYA HAI
        .notEmpty()
        .withMessage("Password is required"),

    validate
];


// import { body, validationResult } from "express-validator";

// const validate = (req, res, next) => {
//     const errors = validationResult(req);
//     //agr error object ke isempty method ko call krke true aaya mtlb koi error nhi hai
//     // Agar koi error milta hai
//     if (!errors.isEmpty()) {
//         return res.status(400).json({
//             success: false,
//             message: "Validation Error",
//             errors: errors.array().map((err) => ({
//                 field: err.path,
//                 message: err.msg,
//             })),
//         });
//     }

//     // Agar koi error nahi hai toh aage controller par jao
//     next();
// };

// export const registerValidation = [
//     body("fullname")
//         .trim()
//         .notEmpty()
//         .withMessage("Fullname is required")
//         .isLength({ min: 3 })
//         .withMessage("Fullname must be at least 3 characters long"),

//     body("email")
//         .trim()
//         .notEmpty()
//         .withMessage("Email is required")
//         .isEmail()
//         .withMessage("Please enter a valid email address")
//         .normalizeEmail(), // Sanitization: Email ko lower-case aur clean kar deta hai

//     body("password")
//         .trim()
//         .notEmpty()
//         .withMessage("Password is required")
//         .isLength({ min: 6 })
//         .withMessage("Password must be at least 6 characters long"),

//     body("contact")
//         .optional()
//         .trim()
//         .isMobilePhone()
//         .withMessage("Please enter a valid mobile number"),

//     validate
// ];


// export const loginValidation = [
//     body("email")
//         .trim()
//         .notEmpty()
//         .withMessage("Email is required")
//         .isEmail()
//         .withMessage("Please enter a valid email address")
//         .normalizeEmail(),

//     body("password")
//         .trim()
//         .notEmpty()
//         .withMessage("Password is required"),

//     validate
// ]