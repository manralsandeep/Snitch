import { addItem, getCart, verifyCartOrder, updateCartItem, removeCartItem } from "../service/cart.api.js";
import { setCart } from "../state/cart.slice.js";
import { useDispatch } from "react-redux";
import { createCartOrder } from "../service/cart.api.js";

export const useCart = () => {
    const dispatch = useDispatch();

    async function handleAddItem({ productId, variantId }) {
        const response = await addItem({ productId, variantId });

        return response;
    }



    async function handleGetCart() {
        const data = await getCart()

        dispatch(setCart(data.cart))

    }

    async function handleCreateCartOrder() {
        const data = await createCartOrder()
        return data.order
    }

    async function handleRemoveCartItem({ cartItemId }) {
        const data = await removeCartItem({ cartItemId })
        return data
    }

    async function handleUpdateCartItem({ cartItemId, action }) {
        const data = await updateCartItem({ cartItemId, action })
        return data.updatedCart
    }

    async function handleVerifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
        const data = await verifyCartOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
        return data.success
    }
    return {
        handleAddItem,
        handleGetCart,
        handleCreateCartOrder,
        handleVerifyCartOrder,
        handleRemoveCartItem,
        handleUpdateCartItem
    }
}