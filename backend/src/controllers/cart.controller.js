import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import { stockOfVariant } from "../dao/product.dao.js";
import paymentModel from "../models/payment.model.js";
import { getCartDetails } from "../dao/Cart.dao.js";
import { createOrder } from "../services/payment.service.js";
import { orderUtil } from "../utils/order.util.js";

export const addToCart = async (req, res) => {

    const { productId, variantId } = req.params
    const { quantity = 1 } = req.body

    const product = await productModel.findOne({
        _id: productId,
        "variants._id": variantId

    })

    if (!product) {
        return res.status(404).json({
            message: "Product or variant not found",
            success: false
        })
    }

    const stock = await stockOfVariant(productId, variantId)

    const cart = (await cartModel.findOne({ user: req.user._id })) ||
        (await cartModel.create({ user: req.user._id }))

    const isProductAlreadyInCart = cart.items.some(item => item.product.toString() === productId && item.variant?.toString() === variantId)

    if (isProductAlreadyInCart) {
        const quantityInCart = cart.items.find(item => item.product.toString() === productId && item.variant?.toString() === variantId).quantity
        if (quantityInCart + quantity > stock) {
            return res.status(400).json({
                message: `Only ${stock} items left in stock. and you already have ${quantityInCart} items in your cart`,
                success: false
            })
        }

        await cartModel.findOneAndUpdate(
            { user: req.user._id, "items.product": productId, "items.variant": variantId },
            { $inc: { "items.$.quantity": quantity } },
            { new: true }
        )

        return res.status(200).json({
            message: "Cart updated successfully",
            success: true
        })
    }

    if (quantity > stock) {
        return res.status(400).json({
            message: `Only ${stock} items left in stock`,
            success: false
        })
    }

    cart.items.push({
        product: productId,
        variant: variantId,
        quantity,
        price: product.price
    })

    await cart.save()

    return res.status(200).json({
        message: "Product added to cart successfully",
        success: true
    })
}

export const getCart = async (req, res) => {
    const user = req.user

    let cart = await getCartDetails(user._id)

    if (!cart) {
        cart = await cartModel.create({ user: user._id })
    }
    return res.status(200).json({
        message: "Cart fetched successfully",
        success: true,
        cart
    })
}

export const createCartOrderController = async (req, res) => {

    const cart = await getCartDetails(req.user._id)

    if (!cart) {
        return res.status(400).json({
            message: "Cart is empty",
            success: false
        })
    }

    const order = await createOrder({ amount: cart.price, currency: cart.currency })

    const payment = await paymentModel.create({
        user: req.user._id,
        razorpay: {
            orderId: order.id,
        },
        price: {
            amount: cart.price,
            currency: cart.currency
        },
        orderItems: cart.items.map(item => ({
            title: item.product.title,
            productId: item.product._id,
            variantId: item.variant,
            quantity: item.quantity,
            images: item.product.variants.images || item.product.images,
            description: item.product.description,
            price: {
                amount: item.product.variants.price.amount || item.product.price.amount,
                currency: item.product.variants.price.currency || item.product.price.currency
            }
        }))
    })


    res.status(200).json({
        message: "Order created successfully",
        success: true,
        order
    }
    )
}

export const verifyCartOrderController = async (req, res) => {
    try {
        const userId = req.user._id
        const cart = await cartModel.findOne({
            user: userId
        })
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

        await orderUtil({ razorpay_order_id, razorpay_payment_id, razorpay_signature }, res)


        const bulkOperations = cart.items.map((item) => {
            return {
                updateOne: {
                    // DB ko batao: Woh product dhoondo, aur uska EXACT woh variant dhoondo
                    filter: {
                        _id: item.product,           // Main product ki ID
                        "variants._id": item.variant // Jo specific variant user ne cart mein add kiya hai
                    },
                    // Uss specific variant ka stock kam karo
                    // Yahan '$' ka matlab hai ki jo variant upar match hua hai, sirf usi ka stock kam karo
                    update: {
                        $inc: { "variants.$.stock": -item.quantity }
                    }
                }
            };
        });

        await productModel.bulkWrite(bulkOperations);

        await cartModel.updateOne(
            { user: userId },
            { $set: { items: [] } }
        )



        return res.status(200).json({
            message: "Payment verified successfully",
            success: true

        })
    } catch (err) {
        console.log(err)

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

export const updateCart = async (req, res) => {


    try {
        const userId = req.user._id;

        const { cartItemId, action } = req.body;


        const value = action === 'increment' ? 1 : -1;

        const updatedCart = await cartModel.findOneAndUpdate(
            {
                user: userId,
                "items._id": cartItemId // Array ke andar us specific ID ko dhundho
            },
            {
                $inc: { "items.$.quantity": value } // '$' operator se seedha wahi item update hoga
            },
            { new: true } // Update hone ke baad latest cart return karo
        );

        res.status(200).json({
            message: "cart updated sucessfully ",
            success: true,
            updatedCart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export const removeCart = async (req, res) => {
    try {

        const userId = req.user._id;
        const { cartItemId } = req.params;

        const updatedCart = await cartModel.findOneAndUpdate(
            { user: userId },
            {
                $pull: { items: { _id: cartItemId } } // $pull directly array se match karke uda dega
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            updatedCart
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });

    }
}