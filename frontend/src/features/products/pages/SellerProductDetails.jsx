import React, { useEffect, useState } from 'react';
import { useProduct } from '../hook/useProduct';
import { useParams, useNavigate } from 'react-router-dom'; // 🚀 FIX: useNavigate import kiya

// Helper icons
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
);

const ChevronLeftIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M9 5l7 7-7 7" />
    </svg>
);

const SellerProductDetails = () => {

    const { handleDeleteProduct, handleDeleteProductVariant, handleUpdateProductVariant, handleAddProductVariant, handleGetProductById } = useProduct()
    const { productId } = useParams()
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false)
    const [product, setProduct] = useState(null);
    console.log(product)

    const [localVariants, setLocalVariants] = useState([]);
    const [isAddingVariant, setIsAddingVariant] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // UI state for inputs to maintain focus
    const [attributeInputs, setAttributeInputs] = useState([{ key: '', value: '' }]);

    // New variant state
    const [newVariant, setNewVariant] = useState({
        images: [],
        stock: 0,
        attributes: {},
        price: { amount: '', currency: 'INR' }
    });

    async function fetchProductDetails() {
        setLoading(true);
        try {
            const data = await handleGetProductById(productId);
            const prod = data;
            setProduct(prod);
            // Initialize variants locally
            if (prod?.variants) {
                setLocalVariants(prod.variants);
            }
        } catch (error) {
            console.error("Failed to fetch product details", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProductDetails()
    }, [productId])

    // Image Navigation Handlers
    const handlePrevImage = () => {
        if (!product?.images?.length) return;
        setSelectedImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        if (!product?.images?.length) return;
        setSelectedImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
    };

    // Stock modification (OLD LOGIC KEPT INTACT)
    const handleStockChange = (index, newStock) => {
        const fixedStock = Math.max(0, Number(newStock));
        const updatedVariants = [...localVariants];
        updatedVariants[index] = { ...updatedVariants[index], stock: fixedStock };
        setLocalVariants(updatedVariants);
    };

    // Variant creation (OLD LOGIC KEPT INTACT)
    const handleAddNewVariant = async () => {
        try {
            const hasValidAttribute = attributeInputs.some(attr => attr.key.trim() && attr.value.trim());
            if (!hasValidAttribute) {
                alert('At least one valid attribute is required.');
                return;
            }

            const cleanImages = newVariant.images.map(img => ({ url: img.previewUrl, file: img.file }));
            const cleanAttributes = { ...newVariant.attributes };

            const variantToSave = {
                images: cleanImages,
                stock: Number(newVariant.stock), //fixed stock
                attributes: cleanAttributes,
                price: newVariant.price.amount
                    ? { amount: Number(newVariant.price.amount), currency: newVariant.price.currency }
                    : undefined
            };

            setIsAddingVariant(false);
            const data = await handleAddProductVariant(productId, variantToSave)
            setLocalVariants([...data]);

            // Reset
            setAttributeInputs([{ key: '', value: '' }]);
            setNewVariant({
                images: [],
                stock: 0,
                attributes: {},
                price: { amount: '', currency: 'INR' }
            });

        } catch (error) {
            console.error("Failed to add new variant", error);
        }
    };

    const handleAddAttribute = () => {
        setAttributeInputs(prev => [...prev, { key: '', value: '' }]);
    };

    const handleAttributeChange = (index, field, value) => {
        const updatedInputs = [...attributeInputs];
        updatedInputs[index][field] = value;
        setAttributeInputs(updatedInputs);

        const newAttrsObj = {};
        updatedInputs.forEach(attr => {
            if (attr.key.trim() !== '' && attr.value.trim() !== '') {
                newAttrsObj[attr.key.trim()] = attr.value.trim();
            }
        });
        setNewVariant(prev => ({ ...prev, attributes: newAttrsObj }));
    };

    const handleRemoveAttribute = (index) => {
        const updatedInputs = attributeInputs.filter((_, i) => i !== index);
        setAttributeInputs(updatedInputs);

        const newAttrsObj = {};
        updatedInputs.forEach(attr => {
            if (attr.key.trim() !== '' && attr.value.trim() !== '') {
                newAttrsObj[attr.key.trim()] = attr.value.trim();
            }
        });
        setNewVariant(prev => ({ ...prev, attributes: newAttrsObj }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const availableSlots = 7 - newVariant.images.length;
        const filesToAdd = files.slice(0, availableSlots);

        if (files.length > availableSlots) {
            alert(`You can only upload up to 7 images. ${filesToAdd.length} added.`);
        }

        const newImageObjects = filesToAdd.map(file => ({
            file,
            previewUrl: URL.createObjectURL(file)
        }));

        setNewVariant(prev => ({
            ...prev,
            images: [...prev.images, ...newImageObjects]
        }));

        e.target.value = '';
    };

    const handleRemoveImage = (index) => {
        const imageToRemove = newVariant.images[index];
        if (imageToRemove?.previewUrl) {
            URL.revokeObjectURL(imageToRemove.previewUrl);
        }
        const updatedImages = newVariant.images.filter((_, i) => i !== index);
        setNewVariant(prev => ({ ...prev, images: updatedImages }));
    };

    // ==========================================
    // 🔴 NEW FUNCTIONS ADDED HERE 
    // ==========================================

    // 🔴 3 - DELETE PRODUCT FUNCTION
    const deleteEntireProduct = async () => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await handleDeleteProduct({ productId });
                navigate(-1);
            } catch (error) {
                console.error("Error deleting product", error);
            }
        }
    };

    // DELETE VARIANT FUNCTION
    const removeVariant = async (variantId) => {
        try {
            await handleDeleteProductVariant({ productId, variantId });
            setLocalVariants(prev => prev.filter(v => v._id !== variantId));
        } catch (error) {
            console.error("Error removing variant", error);
        }
    };

    // UPDATE STOCK FUNCTION (+ / -)
    const updateVariantStock = async (variantId, action, currentStock) => {
        if (action === 'decrement' && currentStock <= 0) return;
        try {
            await handleUpdateProductVariant({ productId, variantId, action });
            setLocalVariants(prev => prev.map(v => {
                if (v._id === variantId) {
                    return { ...v, stock: action === 'increment' ? v.stock + 1 : v.stock - 1 };
                }
                return v;
            }));
        } catch (error) {
            console.error("Error updating stock", error);
        }
    };

    return (
        <>
            {/* Google Fonts */}
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30 pb-24"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >
                <main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 pt-10 lg:pt-16">

                    {/*  DELETE PRODUCT UI: Back button aur Delete button dono flex container mein */}
                    <div className="flex justify-between items-center mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] font-medium transition-colors hover:opacity-70 w-fit group cursor-pointer"
                            style={{ color: '#C9A96E' }}
                            aria-label="Go back"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
                                <line x1="19" y1="12" x2="5" y2="12"></line>
                                <polyline points="12 19 5 12 12 5"></polyline>
                            </svg>
                            Snitch
                        </button>

                        <button
                            onClick={deleteEntireProduct}
                            className="flex items-center gap-1.5 px-3 py-1.5 border border-[#ba1a1a]/30 text-[10px] uppercase tracking-[0.2em] font-medium text-[#ba1a1a] hover:bg-[#ba1a1a]/5 transition-colors cursor-pointer rounded-sm"
                        >
                            <TrashIcon /> Delete Product
                        </button>
                    </div>

                    {/* Top Section: Balanced Gallery (w-[55%]-w-[60%]) & Details (w-[40%]-w-[45%]) */}
                    <section className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start mb-20">

                        {/* Gallery Section */}
                        <div className="w-full lg:w-[58%] flex flex-col-reverse md:flex-row gap-4 lg:gap-5">

                            {/* Vertical Thumbnails (Exact customer page sizing: w-20 to w-24) */}
                            {product?.images && product?.images.length > 1 && (
                                <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-20 lg:w-24 shrink-0 md:max-h-[540px]">
                                    {product?.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setSelectedImageIndex(idx)}
                                            className={`shrink-0 w-16 md:w-full aspect-[4/5] overflow-hidden transition-all duration-300 cursor-pointer ${selectedImageIndex === idx
                                                ? 'opacity-100 ring-1 ring-[#C9A96E] ring-offset-2'
                                                : 'opacity-50 hover:opacity-100'
                                                }`}
                                            style={{ backgroundColor: '#f5f3f0' }}
                                        >
                                            <img
                                                src={img.url}
                                                alt={`View ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Image with Hover Arrows */}
                            <div
                                className="relative flex-1 aspect-[4/5] overflow-hidden group shadow-[0_10px_30px_rgba(27,28,26,0.03)]"
                                style={{ backgroundColor: '#f5f3f0' }}
                            >
                                {product?.images && product?.images.length > 0 ? (
                                    <img
                                        src={product.images[selectedImageIndex]?.url || product.images[0].url}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-opacity duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-[#7A6E63]">
                                        No Image Available
                                    </div>
                                )}

                                {product?.images && product?.images.length > 1 && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={handlePrevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border cursor-pointer"
                                            style={{ backgroundColor: 'rgba(251,249,246,0.85)', borderColor: '#e4e2df', color: '#1b1c1a' }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fbf9f6')}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(251,249,246,0.85)')}
                                            aria-label="Previous image"
                                        >
                                            <ChevronLeftIcon />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleNextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 border cursor-pointer"
                                            style={{ backgroundColor: 'rgba(251,249,246,0.85)', borderColor: '#e4e2df', color: '#1b1c1a' }}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fbf9f6')}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(251,249,246,0.85)')}
                                            aria-label="Next image"
                                        >
                                            <ChevronRightIcon />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Right Product Overview */}
                        <div className=" lg:mt-[10rem] w-full lg:w-[42%] flex flex-col pt-2">
                            <span className="text-[10px] uppercase tracking-[0.24em] font-medium text-[#C9A96E] mb-3">
                                Live Overview
                            </span>
                            <h2
                                className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] mb-5 uppercase"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                            >
                                {product?.title}
                            </h2>
                            <div className="mb-6">
                                <span className="text-sm uppercase tracking-[0.2em] font-medium text-[#1b1c1a]">
                                    {product?.price?.currency} {product?.price?.amount?.toLocaleString()}
                                </span>
                            </div>

                            <div className="h-px w-full mb-6 bg-[#e4e2df]" />

                            <div className="mb-6">
                                <h3 className="text-[10px] uppercase tracking-[0.24em] font-medium mb-3 text-[#C9A96E]">
                                    Description
                                </h3>
                                <p className="text-sm leading-relaxed text-[#7A6E63]">
                                    {product?.description}
                                </p>
                            </div>
                        </div>

                    </section>

                    {/* Variants & Inventory Section */}
                    <section className="bg-[#f5f3f0] p-6 md:p-10 border border-[#e4e2df]">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                            <div>
                                <h3
                                    className="text-2xl md:text-3xl font-light uppercase tracking-wide text-[#1b1c1a]"
                                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                >
                                    Variants & Stock Inventory
                                </h3>
                                <p className="text-xs text-[#7A6E63] mt-1 tracking-wider uppercase">
                                    Manage inventory limits and custom pricing per combination
                                </p>
                            </div>
                            {!isAddingVariant && (
                                <button
                                    onClick={() => setIsAddingVariant(true)}
                                    className="px-5 py-3 text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-300 flex items-center gap-2 cursor-pointer"
                                    style={{ backgroundColor: '#1b1c1a', color: '#fbf9f6' }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#C9A96E';
                                        e.currentTarget.style.color = '#1b1c1a';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#1b1c1a';
                                        e.currentTarget.style.color = '#fbf9f6';
                                    }}
                                >
                                    <PlusIcon /> Add Variant
                                </button>
                            )}
                        </div>

                        {/* Add New Variant Form Modal/Box */}
                        {isAddingVariant && (
                            <div className="bg-[#ffffff] p-6 md:p-8 mb-10 border border-[#e4e2df] shadow-[0_20px_40px_rgba(27,28,26,0.03)]">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#f5f3f0]">
                                    <h4
                                        className="text-xl uppercase font-light text-[#1b1c1a]"
                                        style={{ fontFamily: "'Cormorant Garamond', serif" }}
                                    >
                                        Create New Variant
                                    </h4>
                                    <button
                                        onClick={() => setIsAddingVariant(false)}
                                        className="text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] hover:text-[#1b1c1a] cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Left Column: Attributes & Price/Stock */}
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-[0.24em] font-medium mb-3 text-[#C9A96E]">
                                                Attributes (e.g. Size, Color) *
                                            </label>
                                            <div className="space-y-3">
                                                {attributeInputs.map((attr, index) => (
                                                    <div key={index} className="flex gap-2 items-center">
                                                        <input
                                                            type="text"
                                                            placeholder="Key (e.g. Size)"
                                                            value={attr.key}
                                                            onChange={(e) => handleAttributeChange(index, 'key', e.target.value)}
                                                            className="w-1/2 bg-transparent border-b border-[#d0c5b5] py-1.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#C9A96E] placeholder:text-[#b5ada3]"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Value (e.g. M)"
                                                            value={attr.value}
                                                            onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                                                            className="w-1/2 bg-transparent border-b border-[#d0c5b5] py-1.5 text-xs text-[#1b1c1a] focus:outline-none focus:border-[#C9A96E] placeholder:text-[#b5ada3]"
                                                        />
                                                        {attributeInputs.length > 1 && (
                                                            <button
                                                                onClick={() => handleRemoveAttribute(index)}
                                                                className="text-[#ba1a1a] p-1.5 hover:bg-[#ffdad6] transition-colors cursor-pointer"
                                                            >
                                                                <TrashIcon />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            <button
                                                onClick={handleAddAttribute}
                                                className="mt-3 text-[10px] uppercase tracking-[0.18em] font-medium text-[#745a27] hover:text-[#1b1c1a] flex items-center gap-1 cursor-pointer"
                                            >
                                                <PlusIcon /> Add Attribute
                                            </button>
                                        </div>

                                        <div className="flex gap-4">
                                            <div className="w-1/2">
                                                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] mb-1">
                                                    Initial Stock
                                                </label>
                                                <input
                                                    type="number"
                                                    value={newVariant.stock}
                                                    onChange={(e) => setNewVariant({ ...newVariant, stock: e.target.value })}
                                                    className="w-full bg-transparent border-b border-[#d0c5b5] py-1.5 text-sm focus:outline-none focus:border-[#C9A96E]"
                                                />
                                            </div>
                                            <div className="w-1/2">
                                                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#7A6E63] mb-1">
                                                    Price Amount (Optional)
                                                </label>
                                                <input
                                                    type="number"
                                                    value={newVariant.price.amount}
                                                    onChange={(e) =>
                                                        setNewVariant({
                                                            ...newVariant,
                                                            price: { ...newVariant.price, amount: e.target.value }
                                                        })
                                                    }
                                                    placeholder="Default if empty"
                                                    className="w-full bg-transparent border-b border-[#d0c5b5] py-1.5 text-sm focus:outline-none focus:border-[#C9A96E] placeholder:text-[#b5ada3]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column: Variant Images */}
                                    <div>
                                        <div className="flex justify-between items-end mb-3">
                                            <label className="block text-[10px] uppercase tracking-[0.24em] font-medium text-[#C9A96E]">
                                                Variant Images (Max 7)
                                            </label>
                                            <span className="text-[10px] text-[#7A6E63]">{newVariant.images.length}/7</span>
                                        </div>

                                        {newVariant.images.length > 0 && (
                                            <div className="grid grid-cols-3 gap-2 mb-4">
                                                {newVariant.images.map((img, index) => (
                                                    <div key={index} className="relative aspect-[4/5] bg-[#f5f3f0]">
                                                        <img src={img.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                                        <button
                                                            onClick={() => handleRemoveImage(index)}
                                                            className="absolute top-1 right-1 bg-white/90 p-1 text-[#ba1a1a] hover:bg-white transition-colors cursor-pointer"
                                                        >
                                                            <TrashIcon />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {newVariant.images.length < 7 && (
                                            <div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImageUpload}
                                                    className="block w-full text-xs text-[#7A6E63]
                            file:mr-4 file:py-2 file:px-3
                            file:border file:border-[#d0c5b5] file:bg-[#fbf9f6] file:text-[#1b1c1a]
                            hover:file:bg-[#e4e2df] file:cursor-pointer file:uppercase file:text-[10px] file:tracking-wider
                            cursor-pointer"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end pt-4 border-t border-[#f5f3f0]">
                                    <button
                                        onClick={handleAddNewVariant}
                                        className="px-6 py-3 text-[11px] uppercase tracking-[0.2em] font-medium transition-all cursor-pointer"
                                        style={{ backgroundColor: '#1b1c1a', color: '#fbf9f6' }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#C9A96E';
                                            e.currentTarget.style.color = '#1b1c1a';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#1b1c1a';
                                            e.currentTarget.style.color = '#fbf9f6';
                                        }}
                                    >
                                        Save Variant
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Saved Variants Cards */}
                        {localVariants.length === 0 ? (
                            <div className="py-12 text-center text-[#7A6E63]">
                                <p className="text-xs uppercase tracking-widest">No variants have been added yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                                {localVariants.map((variant, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-[#ffffff] flex flex-col border border-[#e4e2df] shadow-[0_10px_25px_rgba(27,28,26,0.02)] relative"
                                    >
                                        {/*  DELETE VARIANT UI */}
                                        <button
                                            onClick={() => removeVariant(variant._id)}
                                            className="absolute top-3 right-3 text-[9px] uppercase tracking-widest text-[#ba1a1a] hover:text-[#1b1c1a] underline underline-offset-[3px] transition-colors cursor-pointer z-10"
                                        >
                                            Remove
                                        </button>

                                        <div className="p-4 flex gap-4 h-24">
                                            <div className="w-16 h-20 bg-[#f5f3f0] shrink-0 overflow-hidden">
                                                {variant.images && variant.images.length > 0 ? (
                                                    <img src={variant.images[0].url} alt="Variant" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-[#7A6E63]">
                                                        N/A
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 pr-10">
                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                    {Object.entries(variant.attributes || {}).map(([key, val]) => (
                                                        <span
                                                            key={key}
                                                            className="bg-[#f5f3f0] px-2 py-0.5 text-[10px] uppercase tracking-wider text-[#1b1c1a] border border-[#e4e2df]"
                                                        >
                                                            <span className="text-[#7A6E63]">{key}:</span> {val}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="text-xs font-medium tracking-wide text-[#1b1c1a]">
                                                    {variant.price?.amount
                                                        ? `${variant.price.currency || 'INR'} ${variant.price.amount.toLocaleString()}`
                                                        : 'Base Price'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-auto border-t border-[#f5f3f0] bg-[#fbf9f6] flex items-center px-4 py-2.5 justify-between">
                                            <label className="text-[10px] text-[#7A6E63] uppercase tracking-[0.18em]">
                                                Stock Limit
                                            </label>

                                            {/* - UPDATE STOCK UI (- / +) */}
                                            <div className="flex items-center gap-3 border border-[#d0c5b5] rounded-sm px-2 py-0.5 bg-white">
                                                <button
                                                    onClick={() => updateVariantStock(variant._id, 'decrement', variant.stock)}
                                                    disabled={variant.stock <= 0}
                                                    className={`text-lg leading-none pb-0.5 px-1 transition-colors ${variant.stock <= 0 ? 'text-[#e4e2df] cursor-not-allowed' : 'text-[#1b1c1a] cursor-pointer hover:text-[#C9A96E]'}`}
                                                >
                                                    -
                                                </button>
                                                <span className="text-xs font-medium text-[#1b1c1a] min-w-[20px] text-center">
                                                    {variant.stock || 0}
                                                </span>
                                                <button
                                                    onClick={() => updateVariantStock(variant._id, 'increment', variant.stock)}
                                                    className="text-lg leading-none pb-0.5 px-1 text-[#1b1c1a] cursor-pointer hover:text-[#C9A96E] transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                </main>
            </div>
        </>
    );
};

export default SellerProductDetails;