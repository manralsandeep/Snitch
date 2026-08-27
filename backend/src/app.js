import express from "express"
import authRouter from "./routes/auth.routes.js"
import productRouter from "./routes/product.routes.js"
import cartRouter from "./routes/cart.routes.js"
import orderRouter from "./routes/order.routes.js"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from "./config/config.js"
import cors from "cors"
const app = express()

app.use(passport.initialize());

app.use(morgan("dev"))
app.use(express.json())


app.use(cors(
    {
        origin: "https://snitch-jet.vercel.app",
        // origin:"http://localhost:5173",
        credentials: true
    }
))

app.use(cookieParser())

passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback',
    proxy:true
}, (accessToken, refreshToken, profile, done) => {
    // Here, you would typically find or create a user in your database
    // For this example, we'll just return the profile
    return done(null, profile);
}));


app.use("/api/auth", authRouter)
app.use("/api/products", productRouter)
app.use("/api/cart", cartRouter)
app.use("/api/orders", orderRouter)
export default app 