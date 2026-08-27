import paymentModel from "../models/payment.model.js";
import { config } from "../config/config.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";

export async function orderUtil({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    

    const payment = await paymentModel.findOne({
        "razorpay.orderId": razorpay_order_id,
        status: "pending"
    })

   

    if (!payment) {
        throw new Error("Payment not found");
    }

    const isPaymentValid = validatePaymentVerification({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
    }, razorpay_signature, config.RAZORPAY_KEY_SECRET)

    if (!isPaymentValid) {

        payment.status = "failed"
        await payment.save()

        throw new Error("Payment verification failed");
    }

    payment.status = "paid"

    payment.razorpay.paymentId = razorpay_payment_id
    payment.razorpay.signature = razorpay_signature

    const { productId, variantId } = payment?.orderItems[0]
    console.log(productId, variantId)
    await payment.save()

    //return fro singleorderverify contorller
    return {
        productId,
        variantId
    }



}
