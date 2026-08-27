import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useProduct } from '../hook/useProduct';
import { useCart } from '../../cart/hooks/useCart';
import { useCheckout } from '../../shared/utils/useCheckout';
import toast from 'react-hot-toast';

// Helper icons
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

const ProductDetail = () => {

    const { handleAddItem, handleGetCart } = useCart()
    const { handleCheckout } = useCheckout()
    const { productId } = useParams();
    const { handleGetProductById, handleCreateSingleOrder, handleVerifySingleOrder } = useProduct();
    const [product, setProduct] = useState(null);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedAttributes, setSelectedAttributes] = useState({});
    const navigate = useNavigate();

    async function fetchProductDetails() {
        try {
            const productData = await handleGetProductById(productId);
            setProduct(productData);

        } catch (error) {
            console.error("Failed to fetch product details", error);
        }
    }

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    useEffect(() => {
        if (product?.variants?.length > 0) {
            setSelectedAttributes(product.variants[0].attributes || {});
        }
    }, [product]);

    const activeVariant = useMemo(() => {
        if (!product?.variants || product.variants.length === 0) return null;
        return product.variants.find(v => {
            if (!v.attributes) return false;
            const vKeys = Object.keys(v.attributes);
            const sKeys = Object.keys(selectedAttributes);
            const isMatch = vKeys.every(k => v.attributes[k] === selectedAttributes[k]);
            return vKeys.length === sKeys.length && isMatch;
        });
    }, [product, selectedAttributes]);

    const availableAttributes = useMemo(() => {
        if (!product?.variants) return {};
        const attrs = {};
        product.variants.forEach(variant => {
            if (variant.attributes) {
                Object.entries(variant.attributes).forEach(([key, value]) => {
                    if (!attrs[key]) attrs[key] = new Set();
                    attrs[key].add(value);
                });
            }
        });
        Object.keys(attrs).forEach(key => {
            attrs[key] = Array.from(attrs[key]);
        });
        return attrs;
    }, [product]);

    useEffect(() => {
        setSelectedImageIndex(0);
    }, [activeVariant]);

    const handleAttributeChange = (attrName, value) => {
        const newAttrs = { ...selectedAttributes, [attrName]: value };

        const exactMatch = product.variants.find(v => {
            const vAttrs = v.attributes || {};
            return Object.keys(newAttrs).every(k => newAttrs[k] === vAttrs[k]) &&
                Object.keys(vAttrs).every(k => newAttrs[k] === vAttrs[k]);
        });

        if (exactMatch) {
            setSelectedAttributes(exactMatch.attributes);
        } else {
            const fallbackVariant = product.variants.find(v => v.attributes && v.attributes[attrName] === value);
            if (fallbackVariant) {
                setSelectedAttributes(fallbackVariant.attributes);
            } else {
                setSelectedAttributes(newAttrs);
            }
        }
    };

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center selection:bg-[#C9A96E]/30" style={{ backgroundColor: '#fbf9f6' }}>
                <p style={{ fontFamily: "'Inter', sans-serif", color: '#B5ADA3' }} className="text-[10px] uppercase tracking-[0.2em] font-medium animate-pulse">
                    Retrieving piece...
                </p>
            </div>
        );
    }

    // Fallbacks
    const displayImages = (activeVariant?.images && activeVariant.images.length > 0)
        ? activeVariant.images
        : (product.images && product.images.length > 0 ? product.images : [{ url: '/snitch_editorial_warm.png' }]);

    const displayPrice = activeVariant?.price?.amount
        ? activeVariant.price
        : product.price;

    // Image Navigation Handlers 
    const handlePrevImage = () => {
        if (!displayImages?.length) return;
        setSelectedImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        if (!displayImages?.length) return;
        setSelectedImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    };

    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap"
                rel="stylesheet"
            />

            <div
                className="min-h-screen selection:bg-[#C9A96E]/30 pb-24"
                style={{ backgroundColor: '#fbf9f6', fontFamily: "'Inter', sans-serif" }}
            >

                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-16 xl:px-20 pt-10 lg:pt-16">


                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 mb-8 text-[12px] uppercase tracking-[0.22em] font-medium transition-colors hover:opacity-70 w-fit group"
                        style={{ color: '#C9A96E' }}
                        aria-label="Go back"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-transform group-hover:-translate-x-1"
                        >
                            <line x1="19" y1="12" x2="5" y2="12"></line>
                            <polyline points="12 19 5 12 12 5"></polyline>
                        </svg>
                        snitch
                    </button>

                    <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

                        {/* ── LEFT SECTION ── */}
                        <div className="w-full lg:w-[58%] flex flex-col-reverse md:flex-row gap-4 lg:gap-5">

                            {/* Thumbnails */}
                            {displayImages && displayImages.length > 1 && (
                                <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto pb-2 md:pb-0 scrollbar-hide w-full md:w-20 lg:w-24 shrink-0 md:max-h-[540px]">
                                    {displayImages.map((img, idx) => (
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
                                {displayImages && displayImages.length > 0 ? (
                                    <img
                                        src={displayImages[selectedImageIndex]?.url || displayImages[0].url}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-opacity duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xs text-[#7A6E63]">
                                        No Image Available
                                    </div>
                                )}

                                {displayImages && displayImages.length > 1 && (
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


                        {/* ── RIGHT: Product Details ── */}
                        <div className="w-full lg:w-[42%] lg:sticky lg:top-24 flex flex-col pt-2">

                            <h1
                                className="text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] mb-6"
                                style={{ fontFamily: "'Cormorant Garamond', serif", color: '#1b1c1a' }}
                            >
                                {product.title}
                            </h1>

                            <div className="mb-8">
                                <span
                                    className="text-sm uppercase tracking-[0.2em] font-medium"
                                    style={{ color: '#1b1c1a' }}
                                >
                                    {displayPrice?.currency} {displayPrice?.amount?.toLocaleString()}
                                </span>
                            </div>

                            <div className="h-px w-full mb-8" style={{ backgroundColor: '#e4e2df' }} />

                            {/* Options/Variants */}
                            {Object.entries(availableAttributes).map(([attrName, values]) => (
                                <div key={attrName} className="mb-6">
                                    <h3 className="text-[10px] uppercase tracking-[0.24em] font-medium mb-3" style={{ color: '#C9A96E' }}>
                                        {attrName}
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {values.map(val => {
                                            const isSelected = selectedAttributes[attrName] === val;
                                            return (
                                                <button
                                                    key={val}
                                                    onClick={() => handleAttributeChange(attrName, val)}
                                                    className={`px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-medium transition-all duration-300 border ${isSelected ? 'border-[#1b1c1a] bg-[#1b1c1a] text-[#fbf9f6]' : 'border-[#d0c5b5] text-[#1b1c1a] hover:border-[#1b1c1a]'}`}
                                                    style={isSelected ? {} : { backgroundColor: 'transparent' }}
                                                >
                                                    {val}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}

                            {/* Stock Information */}
                            {activeVariant && activeVariant.stock !== undefined && (
                                <div className="mb-6">
                                    <span className={`text-[10px] uppercase tracking-[0.2em] font-medium ${activeVariant.stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                        {activeVariant.stock > 0 ? `${activeVariant.stock} in stock` : 'Out of stock'}
                                    </span>
                                </div>
                            )}

                            <div className="mb-12">
                                <h3 className="text-[10px] uppercase tracking-[0.24em] font-medium mb-4" style={{ color: '#C9A96E' }}>
                                    The Details
                                </h3>
                                <p className="text-sm leading-relaxed" style={{ color: '#7A6E63' }}>
                                    {product.description}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-4 mt-auto">
                                <button
                                    className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    disabled={activeVariant?.stock === 0}
                                    style={{
                                        backgroundColor: '#1b1c1a',
                                        color: '#fbf9f6',
                                        fontFamily: "'Inter', sans-serif"
                                    }}
                                    onMouseEnter={e => {
                                        if (activeVariant?.stock > 0) {
                                            e.currentTarget.style.backgroundColor = '#C9A96E';
                                            e.currentTarget.style.color = '#1b1c1a';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (activeVariant?.stock > 0) {
                                            e.currentTarget.style.backgroundColor = '#1b1c1a';
                                            e.currentTarget.style.color = '#fbf9f6';
                                        }
                                    }}
                                    onClick={async () => {
                                        try {

                                            await handleAddItem({
                                                productId: product._id,
                                                variantId: activeVariant._id
                                            });


                                            await handleGetCart();

                                            toast.success('Item added to cart!');

                                        } catch (error) {
                                            console.error("Cart add error:", error);


                                            toast.error('Failed to add item. Please try again.');
                                        }
                                    }}
                                >
                                    {activeVariant?.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                                </button>

                                {/* 🚀 BUG FIXED HERE - Added Try Catch for the Checkout API Error */}
                                <button
                                    className="w-full py-4 text-[11px] uppercase tracking-[0.25em] font-medium transition-all duration-300 border disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                    disabled={activeVariant?.stock === 0}
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderColor: '#d0c5b5',
                                        color: '#1b1c1a',
                                        fontFamily: "'Inter', sans-serif"
                                    }}
                                    onClick={async () => {
                                        try {
                                            await handleCheckout(
                                                async () => {
                                                    try {
                                                        return await handleCreateSingleOrder({
                                                            productId: product._id,
                                                            variantId: activeVariant._id
                                                        });
                                                    } catch (err) {
                                                        toast.error('Please login to proceed with the purchase.');
                                                        throw err;
                                                    }
                                                },
                                                handleVerifySingleOrder
                                            );
                                        } catch (error) {
                                            console.error("Checkout error:", error);
                                        }
                                    }}
                                    onMouseEnter={e => {
                                        if (activeVariant?.stock > 0) {
                                            e.currentTarget.style.borderColor = '#C9A96E';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (activeVariant?.stock > 0) {
                                            e.currentTarget.style.borderColor = '#d0c5b5';
                                        }
                                    }}
                                >
                                    Buy Now
                                </button>
                            </div>

                            {/* Extra elegant details */}
                            <div className="mt-14 space-y-4 text-[10px] uppercase tracking-[0.1em]" style={{ color: '#B5ADA3' }}>
                                <div className="flex justify-between border-b pb-3" style={{ borderColor: '#e4e2df' }}>
                                    <span>Shipping</span>
                                    <span>Complimentary over INR 15,000</span>
                                </div>
                                <div className="flex justify-between border-b pb-3" style={{ borderColor: '#e4e2df' }}>
                                    <span>Returns</span>
                                    <span>Within 14 days of delivery</span>
                                </div>
                                <div className="flex justify-between border-b pb-3" style={{ borderColor: '#e4e2df' }}>
                                    <span>Authenticity</span>
                                    <span>100% Guaranteed</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;