import axios from 'axios';

const cartApiInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + '/api/cart',
    withCredentials: true,
})

export async function addItem({ productId, variantId }) {

    const response = await cartApiInstance.post(`/add/${productId}/${variantId}`, { quantity: 1 })
    return response.data
}


export const getCart = async () => {
    const response = await cartApiInstance.get("/")
    return response.data
}


export const createCartOrder = async () => {
    const response = await cartApiInstance.post("/payment/create/order")
    return response.data
}

export const verifyCartOrder = async ({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
    const response = await cartApiInstance.post("/payment/verify/order", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    })

    return response.data
}

export const updateCartItem = async ({ cartItemId, action }) => {
    const response = await cartApiInstance.put("/update", {
        cartItemId,
        action
    })
    return response.data
}

export const removeCartItem = async ({ cartItemId }) => {
    const response = await cartApiInstance.delete(`/remove/${cartItemId}`)
    return response.data
}