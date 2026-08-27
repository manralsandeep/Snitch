import axios from "axios";

const productApiInstance = axios.create({
    baseURL: "/api",
    withCredentials: true,
})


export async function getSellerProduct() {
    const response = await productApiInstance.get("/products/seller");
    return response.data
}

export async function createProduct(formdata) {

    const response = await productApiInstance.post("/products/", formdata);
    return response.data

}

export async function getAllProducts() {

    const response = await productApiInstance.get("/products/");
    return response.data

}

export async function getProductById(productId) {
    const response = await productApiInstance.get(`/products/details/${productId}`);
    return response.data
}

export async function updateProductVariant({ productId, variantId, action }) {
    const response = await productApiInstance.put(`/products/update/variant`,
        {
            productId,
            variantId,
            action
        }
    )
    return response.data
}

export async function deleteProductVariant({ variantId, productId }) {
    const response = await productApiInstance.delete(`/products/delete/variant/${productId}/${variantId}`)
    return response.data
}

export async function deleteProduct({ productId }) {
    const response = await productApiInstance.delete(`/products/delete/product/${productId}`)
    return response.data
}


export async function addProductVariant(productId, newProductVariant) {


    const formData = new FormData()

    newProductVariant.images.forEach((image) => {
        formData.append(`images`, image.file)
    })

    formData.append("stock", newProductVariant.stock)
    formData.append("priceAmount", newProductVariant.price)
    formData.append("attributes", JSON.stringify(newProductVariant.attributes))

    const response = await productApiInstance.post(`/products/${productId}/variants`, formData)

    return response.data

}

export async function createSingleOrder({ productId, variantId }) {
    const response = await productApiInstance.post("/orders/payment/create/order", {
        productId,
        variantId
    })
    return response.data
}
export async function verifySingleOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
    const response = await productApiInstance.post("/orders/payment/verify/order", {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    }
    )
    return response.data
}