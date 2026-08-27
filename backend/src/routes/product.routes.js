import Router from "express";
import { authenticateSeller } from "../middlewares/auth.middleware.js";
import { createProduct, getSellerProducts, getAllProducts, getProductDetails, addProductVariant, updateProductVariant, removeProductVariant, removeProduct } from "../controllers/product.controller.js"
import { createProductValidator } from "../validator/product.validator.js";

import multer from "multer"


const productRouter = Router()

const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    }
})

/**
 * @route /api/products
 * @description create product 
 * @acess only selller
 */

productRouter.post("/", authenticateSeller, upload.array('images', 7), createProductValidator, createProduct)

/**
 * @route /api/products/seller
 * @description get product 
 * @acess only selller
 */

productRouter.get("/seller", authenticateSeller, getSellerProducts)

/**
 * @route /api/products/
 * @description get all products
 * @acess only selller
 */
productRouter.get("/", getAllProducts)

/**
 * @route /api/products/detail/:id
 * @description get  product data by id
 * @acess public
 */

productRouter.get("/details/:id", getProductDetails)

/**
 * @route post /api/products/:productId/variants
 * @description Add a new variant to a product
 * @access Private (Seller only)
 */
productRouter.post("/:productId/variants", authenticateSeller, upload.array('images', 7), addProductVariant)


/**
 * @route put /api/products/update/variant

 */

productRouter.put("/update/variant", authenticateSeller, updateProductVariant)

/**
 * @route delete /api/products/delete/variant/:productId/:variantId

 */

productRouter.delete("/delete/variant/:productId/:variantId", authenticateSeller, removeProductVariant)

/**
 * @route delete /api/products/delete/product/:productId
 *
 */

productRouter.delete("/delete/product/:productId", authenticateSeller, removeProduct)


export default productRouter
