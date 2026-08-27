import { createOrder } from "../services/payment.service.js";
import paymentModel from "../models/payment.model.js";
import productModel from "../models/product.model.js";
import { orderUtil } from "../utils/order.util.js";
export const createSingleOrderController = async (req, res) => {
    const userId = req.user._id

    const { productId, variantId } = req.body
    const product = await productModel.findOne({
        _id: productId
    })

    if (!product) {
        return res.status(500).json({
            message: "product not found",
            success: false,
        })
    }

    const variant = product.variants.find((item) => {
        return variantId === item._id.toString()
    })




    const order = await createOrder({ amount: variant.price.amount || product?.price?.amount, currency: variant.price.currency || product?.price?.currency })

    const payment = await paymentModel.create({
        user: userId,
        razorpay: {
            orderId: order.id,
        },
        price: {
            amount: variant?.price?.amount || product?.price?.amount,
            currency: variant?.price?.currency || product?.price?.currency
        },
        orderItems: [{
            title: product.title,
            productId: product._id,
            variantId: variant._id,
            quantity: variant.quantity,
            images: variant.images || product.images,
            description: product.description,
            price: {
                amount: variant?.price?.amount || product?.price?.amount,
                currency: variant?.price?.currency || product?.price?.currency
            }
        }]
    })


    res.status(200).json({
        message: "Order created successfully",
        success: true,
        order

    }
    )

}

export const verifySingleOrderController = async (req, res) => {
    try {
        const userId = req.user._id

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body


        const { productId, variantId } = await orderUtil({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
    

        await productModel.updateOne(
            { _id: productId, "variants._id": variantId },
            { $inc: { "variants.$.stock": -1 } }
        )

        return res.status(200).json({
            message: "Payment verified successfully",
            success: true

        })

    } catch (err) {
        if (err.message === "Payment not found" || err.message === "Payment verification failed") {
            return res.status(400).json({
                message: err.message,
                success: false
            });
        }

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}
