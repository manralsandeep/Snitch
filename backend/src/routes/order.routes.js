import { Router } from "express"
const router = Router()
import { isAuthenticated } from "../middlewares/auth.middleware.js"

import { createSingleOrderController, verifySingleOrderController } from './../controllers/order.controller.js';
/**
 * @route POST /api/orders/payment/create/order
 */
router.post("/payment/create/order", isAuthenticated, createSingleOrderController)
/**
 * @route POST /api/orders/payment/verify/order
 */
router.post("/payment/verify/order", isAuthenticated, verifySingleOrderController)

export default router