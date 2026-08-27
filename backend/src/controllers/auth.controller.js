import userModel from "../models/user.model.js"
import jwt from "jsonwebtoken"
import { config } from "../config/config.js"
import redis from "../config/cache.js"
function generateToken({ user, res, message }) {


    const token = jwt.sign({
        id: user._id,
        role: user.role

    }, config.JWT_SECRET, {
        expiresIn: "1d"
    })

    res.cookie("token", token)

    return res.status(200).json({
        message,
        sucess: true,
        user: {
            id: user._id,
            email: user.email,
            contact: user.contact,
            fullname: user.fullname,
            role: user.role
        }
    }
    )
}


export const register = async (req, res) => {

    const { email, contact, name, password, fullname, isSeller } = req.body

    try {

        const existingUser = await userModel.findOne({
            $or: [
                { email },
                { contact }
            ]
        })

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists with this email or contact"
            })
        }

        const user = await userModel.create({
            email,
            contact,
            name,
            password,
            fullname,
            role: isSeller ? "seller" : "buyer"
        })

        generateToken({ user, res, message: "User registered successfully" })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error"
        })
    }

}

export const login = async (req, res) => {



    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email }).select("+password")

        if (!user) {
            return res.status(400).json({ messsage: "user not found with this email or password" })
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                message: "invalid email or passsword"
            })
        }

        generateToken({ res, user, message: "user logged in sucessfully" })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const logout = async (req, res) => {
    try {

        const token = req.cookies.token;

        res.clearCookie("token");
        await redis.set(token, Date.now().toString(), "EX", 24 * 60 * 60)

        return res.status(200).json({
            message: "User logged out successfully",
            success: true
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server error during logout",
            success: false
        });
    }
}

export const getMe = async (req, res) => {

    try {

        const user = req.user

        return res.status(200).json({
            message: "user fetched successfully",
            sucess: true,
            user: {
                id: user._id,
                email: user.email,
                contact: user.contact,
                fullname: user.fullname,
                role: user.role
            }
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error",
        })

    }
}


export const googleCallback = async (req, res) => {
    try {

        const { id, displayName, emails, photos } = req.user
        const email = emails[0].value
        const displayPic = photos[0].value

        let user = await userModel.findOne({ email })

        if (!user) {
            user = await userModel.create({
                email,
                fullname: displayName,
                googleId: id
            })
        }
        const token = jwt.sign({
            id: user._id,
            role: user.role

        }, config.JWT_SECRET, {
            expiresIn: "7d"
        })


        res.cookie("token", token)



        return res.redirect(config.NODE_ENV ? "http://localhost:5173/" : "/");

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error",
        })
    }
}

