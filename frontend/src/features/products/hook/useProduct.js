import { updateProductVariant, deleteProductVariant, deleteProduct, getSellerProduct, createProduct, getAllProducts, getProductById, addProductVariant, createSingleOrder, verifySingleOrder } from "../service/product.api"
import { useDispatch } from 'react-redux';
import { setSellerProducts, setProducts, deleteProductLocally, deleteVariantLocally, updateVariantStockLocally } from "../state/product.slice";

export function useProduct() {

    const dispatch = useDispatch()

    async function handleUpdateProductVariant({ variantId, productId, action }) {
        const data = await updateProductVariant({ variantId, productId, action })
        dispatch(updateVariantStockLocally({ variantId, productId, action }))
    }


    async function handleDeleteProductVariant({ variantId, productId }) {
        const data = await deleteProductVariant({ variantId, productId })
        dispatch(deleteVariantLocally({ variantId, productId }))
    }

    async function handleDeleteProduct({ productId }) {
        const data = await deleteProduct({ productId })
        dispatch(deleteProductLocally({ productId }))
    }

    async function handleCreateProduct(formdata) {
        const data = await createProduct(formdata)
        return data.product
    }

    async function handleGetSellerProduct() {
        const data = await getSellerProduct()
        dispatch(setSellerProducts(data.products))

        return data.products
    }

    async function handleGetAllProducts() {
        const data = await getAllProducts()
        dispatch(setProducts(data.products))
        console.log(data.products)
    }

    async function handleGetProductById(productId) {
        const data = await getProductById(productId)
        return data.product
    }



    async function handleAddProductVariant(productId, newProductVariant) {
        const data = await addProductVariant(productId, newProductVariant)

        return data.product.variants

    }

    async function handleCreateSingleOrder({ productId, variantId }) {
        const data = await createSingleOrder({ productId, variantId })
        return data.order
    }
    async function handleVerifySingleOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
        const data = await verifySingleOrder({ razorpay_order_id, razorpay_payment_id, razorpay_signature })
        return data
    }
    return {
        handleCreateProduct,
        handleGetSellerProduct,
        handleGetAllProducts,
        handleGetProductById,
        handleAddProductVariant,
        handleCreateSingleOrder,
        handleVerifySingleOrder,
        handleDeleteProductVariant,
        handleUpdateProductVariant,
        handleDeleteProduct

    }
}