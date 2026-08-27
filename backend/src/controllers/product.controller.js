
import productModel from './../models/product.model.js';
import { uploadFile } from '../services/storage.service.js';
export async function createProduct(req, res) {
    try {
        const { title, description, priceAmount, priceCurrency } = req.body

        const seller = req.user


        const images = await Promise.all(req.files.map((file) => {
            return uploadFile({
                buffer: file.buffer,
                fileName: file.originalname
            })
        }))

        const product = await productModel.create({
            title,
            description,
            price: {
                amount: priceAmount,
                currency: priceCurrency || "INR"
            },
            images,
            seller: seller._id
        })

        return res.status(201).json({
            message: "Product created successfully",
            success: true,
            product
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }

}

export async function getSellerProducts(req, res) {
    try {
        const seller = req.user

        const products = await productModel.find({ seller: seller._id })

        return res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }

}

export async function getAllProducts(req, res) {
    try {
        const products = await productModel.find()
        return res.status(200).json({
            message: "Products fetched successfully",
            success: true,
            products
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })

    }


}


export async function getProductDetails(req, res) {
    try {
        const { id } = req.params

        const product = await productModel.findById(id)
        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            })
        }
        return res.status(200).json({
            message: "Product fetched successfully",
            success: true,
            product
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }

}

export async function addProductVariant(req, res) {

    try {
        const productId = req.params.productId;

        const product = await productModel.findOne({
            _id: productId,
            seller: req.user._id
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
                success: false
            })
        }

        const files = req.files;
        const images = [];
        if (files || files.length !== 0) {
            (await Promise.all(files.map(async (file) => {
                const image = await uploadFile({
                    buffer: file.buffer,
                    fileName: file.originalname
                })
                return image
            }))).map(image => images.push(image))
        }

        const price = req.body.priceAmount
        const stock = req.body.stock
        const attributes = JSON.parse(req.body.attributes || "{}")



        product.variants.push({
            images,
            price: {
                amount: Number(price) || product.price.amount,
                currency: req.body.priceCurrency || product.price.currency
            },
            stock,
            attributes
        })

        await product.save();

        return res.status(200).json({
            message: "Product variant added successfully",
            success: true,
            product
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export async function updateProductVariant(req, res) {

    try {

        const { productId, variantId, action } = req.body

        const value = action === 'increment' ? 1 : -1;

        const products = await productModel.findOneAndUpdate(
            {
                _id: productId,
                "variants._id": variantId           // Array ke andar us specific ID ko dhundho
            },
            {
                $inc: { "variants.$.stock": value } // '$' operator se seedha wahi item update hoga
            },
            { new: true } // Update hone ke baad latest cart return karo
        );

        res.status(200).json({
            message: "Product variant updated sucessfully",
            status: true,
            products
        })

    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            status: false
        })
    }


}

export async function removeProduct(req, res) {

    try {

        const { productId } = req.params

        const products = await productModel.findOneAndDelete(
            {
                _id: productId
            },
            { new: true }
        )


        res.status(200).json({
            message: "Product removed sucessfully",
            status: true,
            products
        })

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Internal server error",
            status: false
        })
    }

}
export async function removeProductVariant(req, res) {
    try {

        const { variantId, productId } = req.params

        const products = await productModel.findOneAndUpdate(
            { _id: productId },
            {
                $pull: { variants: { _id: variantId } } // $pull directly array se match karke uda dega
            },
            { new: true }
        )

        res.status(200).json({
            message: "Product variant removed sucessfully",
            status: true,
            products
        })

    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            status: false
        })
    }



}