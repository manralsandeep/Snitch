import { Router } from "express";
import { register, login, getMe ,logout } from "../controllers/auth.controller.js"
import { registerValidation, loginValidation } from "../validator/auth.validator.js"
import { isAuthenticated } from './../middlewares/auth.middleware.js';
const authRouter = Router()
import passport from 'passport';
import { config } from "../config/config.js"
import { googleCallback } from "../controllers/auth.controller.js"

authRouter.post("/register", registerValidation, register)
authRouter.post("/login", loginValidation, login)
authRouter.get("/getMe", isAuthenticated, getMe)
authRouter.post("/logout",isAuthenticated,logout)

authRouter.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback route that Google will redirect to after authentication
authRouter.get('/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: config.NODE_ENV === "development" ? 'http://localhost:5173/login' : "/login"
    }),
    googleCallback
);
export default authRouter;