import { createSlice } from "@reduxjs/toolkit";

export const productSlice = createSlice({
    name: "product",
    initialState: {
        sellerProducts: [],
        products: [],
        searchQuery: ""

    },
    reducers: {
        setSellerProducts: (state, action) => {
            state.sellerProducts = action.payload;
        },
        setProducts: (state, action) => {
            state.products = action.payload
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload
        },

        //  Pura Product Delete Karne Ke Liye
        deleteProductLocally: (state, action) => {
            const productId = action.payload; // Payload mein sirf ID aayegi

            // Filter karke wo product dono arrays se hata do
            state.products = state.products.filter(p => p._id !== productId);
            state.sellerProducts = state.sellerProducts.filter(p => p._id !== productId);
        },

        //  Sirf Product Variant Delete Karne Ke Liye
        deleteVariantLocally: (state, action) => {
            const { productId, variantId } = action.payload;

            // Ek helper function taaki code repeat na karna pade
            const removeVariantFromArray = (array) => {
                const product = array.find(p => p._id === productId);
                if (product) {
                    // Sirf us product ke variants array se wo specific variant filter out kar do
                    product.variants = product.variants.filter(v => v._id !== variantId);
                }
            };

            removeVariantFromArray(state.products);
            removeVariantFromArray(state.sellerProducts);
        },

        // Product Variant Ka Stock Update Karne Ke Liye (Increment/Decrement)
        updateVariantStockLocally: (state, action) => {
            const { productId, variantId, actionType } = action.payload; // actionType: 'increment' ya 'decrement'
            const value = actionType === 'increment' ? 1 : -1;

            const updateStockInArray = (array) => {
                const product = array.find(p => p._id === productId);
                if (product) {
                    const variant = product.variants.find(v => v._id === variantId);
                    if (variant) {
                        // RTK Immer ki wajah se direct mutate kar sakte hain
                        variant.stock += value;
                    }
                }
            };

            updateStockInArray(state.products);
            updateStockInArray(state.sellerProducts);
        },

    }
})

export const { setSellerProducts, setProducts, setSearchQuery, deleteProductLocally, deleteVariantLocally, updateVariantStockLocally } = productSlice.actions;
export default productSlice.reducer;
