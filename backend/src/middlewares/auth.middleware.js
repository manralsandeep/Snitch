import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
import redis from "../config/cache.js"

export const isAuthenticated = async (req, res, next) => {

    try {

        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            })
        }

        const isTokenBlacklisted = await redis.get(token)
        console.log(isTokenBlacklisted)

        if (isTokenBlacklisted) {
           
            return res.status(401).json({
                message: "Invalid token",
                success: false
                
            })
        }


        const decoded = jwt.verify(token, config.JWT_SECRET)
        const user = await userModel.findById(decoded.id)
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            })
        }
        
       
        req.user = user
        next()

    } catch (err) {
        console.log(err)
        return res.status(401).json({
            message: "Unauthorized",
            success: false
        })
    }
}


export const authenticateSeller = async (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            })
        }

        const decoded = jwt.verify(token, config.JWT_SECRET)
        const user = await userModel.findById(decoded.id)
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized",
                success: false
            })
        }
        if (user.role !== "seller") {
            return res.status(403).json({
                message: "Forbidden",
                success: false
            })
        }
        req.user = user
        next()


    } catch (err) {
        console.log(err)
        return res.status(401).json({
            message: "Unauthorized",
            success: false
        })
    }
}