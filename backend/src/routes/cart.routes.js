import express from "express";
import { addToCart } from "../controllers/cart.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { validateAddToCart } from "../validator/cart.validator.js";
import { getCart } from "../controllers/cart.controller.js";
import { createCartOrderController, verifyCartOrderController, updateCart, removeCart } from "../controllers/cart.controller.js";

const router = express.Router();
/**
 * @route POST /api/cart/add/:productId/:variantId
 * @desc Add item to cart
 * @access Private
 * @argument productId - ID of the product to add
 * @argument variantId - ID of the variant to add
 * @argument quantity - Quantity of the item to add (optional, default: 1)
 */
router.post("/add/:productId/:variantId", isAuthenticated, validateAddToCart, addToCart)


/**
 * @route GET /api/cart
 * @desc Get user's cart
 * @access Private
 */
router.get('/', isAuthenticated, getCart)
 


/**
 * @route POST /api/cart/payment/create/order
 */
router.post("/payment/create/order", isAuthenticated, createCartOrderController)

router.post("/payment/verify/order", isAuthenticated, verifyCartOrderController)
/**
 * @route POST /api/cart/update
 */

router.put("/update", isAuthenticated, updateCart)
/**
 * @route POST /api/cart/remove

 */

router.delete("/remove/:cartItemId", isAuthenticated, removeCart)
export default router;
