
// import React, { useState } from 'react';

// const CreateProduct = () => {
//     const [formData, setFormData] = useState({
//         title: '',
//         description: '',
//         amount: '',
//         currency: 'INR',
//     });
//     const [images, setImages] = useState([]);
//     const [isDragging, setIsDragging] = useState(false);

//     // Handle Form Input
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     // Handle Image Selection
//     const processFiles = (files) => {
//         const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

//         if (images.length + validFiles.length > 7) {
//             alert("Bro, you can only upload a maximum of 7 images.");
//             return;
//         }

//         const newImages = validFiles.map(file => ({
//             file,
//             url: URL.createObjectURL(file)
//         }));

//         setImages(prev => [...prev, ...newImages].slice(0, 7));
//     };

//     const handleImageChange = (e) => processFiles(e.target.files);

//     // Drag and Drop Handlers
//     const handleDragOver = (e) => {
//         e.preventDefault();
//         setIsDragging(true);
//     };

//     const handleDragLeave = () => setIsDragging(false);

//     const handleDrop = (e) => {
//         e.preventDefault();
//         setIsDragging(false);
//         processFiles(e.dataTransfer.files);
//     };

//     const removeImage = (indexToRemove) => {
//         setImages(images.filter((_, index) => index !== indexToRemove));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log("Product Data Submitted: ", formData);
//         console.log("Images: ", images);
//     };

//     return (
//         // Background me ek custom light champagne color diya hai (White + Light Gold + Hint of Pink)
//         <div className="min-h-screen bg-[#FDF9F6] font-sans text-black py-12 px-8 md:px-20 lg:px-32 flex flex-col items-center transition-colors duration-500">

//             <div className="w-full max-w-xl">

//                 {/* Header Section - Snitch aur Arrow navigation ke liye */}
//                 <div className="mb-16 text-left">
//                     {/* Arrow aur chhota Snitch text */}
//                     <div className="flex items-center gap-6 mb-8 cursor-pointer w-fit hover:opacity-70 transition-opacity text-[#D4AF37]" onClick={() => console.log('Navigate Back')}>
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                         </svg>
//                         <h1 className="text-[11px] font-semibold tracking-[0.2em] uppercase">
//                             Snitch
//                         </h1>
//                     </div>

//                     <h2 className="text-4xl mt-10 mb-20 font-light tracking-wide uppercase text-black">
//                         <span className=' pb-4 border-b-2 border-b-[#D4AF37]'>New</span> Listing
//                     </h2>
//                 </div>

//                 <form onSubmit={handleSubmit} className="w-full">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-16">

//                         {/* LEFT SIDE: Inputs - Spacing badha di hai (space-y-14) */}
//                         <div className="space-y-14">

//                             {/* Title */}
//                             <div className="flex flex-col">
//                                 <label className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-3">
//                                     Product Title
//                                 </label>
//                                 {/* pb-4 se input me neeche ki taraf padding badhi hai */}
//                                 <input
//                                     type="text"
//                                     name="title"
//                                     value={formData.title}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full border-b-[0.5px] border-gray-300 pb-4 text-sm font-light focus:outline-none focus:border-[#D4AF37] transition-colors bg-transparent placeholder-gray-300"
//                                     placeholder="e.g. Premium Cotton Shirt"
//                                 />
//                             </div>

//                             {/* Description */}
//                             <div className="flex flex-col">
//                                 <label className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-3">
//                                     Description
//                                 </label>
//                                 {/* pb-8 dekar bottom border ko kaafi neeche shift kar diya hai */}
//                                 <textarea
//                                     name="description"
//                                     value={formData.description}
//                                     onChange={handleInputChange}
//                                     required
//                                     rows="1"
//                                     className="w-full border-b-[0.5px] border-gray-300 pb-25 text-sm font-light focus:outline-none focus:border-[#D4AF37] transition-colors resize-none bg-transparent placeholder-gray-300"
//                                     placeholder="Fabric, fit, style..."
//                                 />
//                             </div>

//                             {/* Amount & Currency */}
//                             <div className="grid grid-cols-2 gap-12">
//                                 <div className="flex flex-col">
//                                     <label className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-3">
//                                         Amount
//                                     </label>
//                                     <input
//                                         type="number"
//                                         name="amount"
//                                         value={formData.amount}
//                                         onChange={handleInputChange}
//                                         required
//                                         min="0"
//                                         className="w-full border-b-[0.5px] border-gray-300 pb-4 text-sm font-light focus:outline-none focus:border-[#D4AF37] transition-colors bg-transparent placeholder-gray-300"
//                                         placeholder="0.00"
//                                     />
//                                 </div>

//                                 <div className="flex flex-col">
//                                     <label className="text-xs font-medium uppercase tracking-widest text-gray-500 mb-3">
//                                         Currency
//                                     </label>
//                                     <select
//                                         name="currency"
//                                         value={formData.currency}
//                                         onChange={handleInputChange}
//                                         className="w-full border-b-[0.5px] border-gray-300 pb-4 text-sm font-light focus:outline-none focus:border-[#D4AF37] transition-colors bg-transparent cursor-pointer"
//                                     >
//                                         <option value="INR">INR</option>
//                                         <option value="USD">USD</option>
//                                         <option value="EUR">EUR</option>
//                                         <option value="GBP">GBP</option>
//                                         <option value="JPY">JPY</option>
//                                     </select>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* RIGHT SIDE: Drag & Drop Image Upload */}
//                         <div className="flex flex-col">
//                             <label className="text-xs font-medium flex flex-row justify-between uppercase tracking-widest text-gray-500 mb-3">
//                                 Images  <span className="text-[#D4AF37]">{images.length}/7</span>
//                             </label>

//                             <div
//                                 onDragOver={handleDragOver}
//                                 onDragLeave={handleDragLeave}
//                                 onDrop={handleDrop}
//                                 className={` flex flex-col items-center justify-center border-[0.5px] border-dashed min-h-[260px] p-4 transition-all duration-300 cursor-pointer ${isDragging ? 'border-[#D4AF37] bg-[#fbf5ee]' : 'border-gray-300 hover:border-[#D4AF37]'
//                                     }`}
//                                 onClick={() => document.getElementById('imageUpload').click()}
//                             >
//                                 <input
//                                     type="file"
//                                     id="imageUpload"
//                                     multiple
//                                     accept="image/*"
//                                     onChange={handleImageChange}
//                                     className="hidden"
//                                 />

//                                 {/* Arrow pointing into a box SVG */}
//                                 <svg className="w-7 h-7 text-[#D4AF37] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
//                                 </svg>

//                                 <p className="text-[#D4AF37] text-sm font-medium tracking-wide">Tap to upload</p>
//                                 <p className="text-gray-400 text-xs mt-2 font-light">or drag and drop images</p>
//                             </div>

//                             {/* Image Previews */}
//                             {images.length > 0 && (
//                                 <div className="grid grid-cols-4 gap-3 mt-6">
//                                     {images.map((img, index) => (
//                                         <div key={index} className="relative group aspect-square">
//                                             <img
//                                                 src={img.url}
//                                                 alt={`Preview ${index}`}
//                                                 className="w-full h-full object-cover rounded-sm border border-gray-100"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={(e) => { e.stopPropagation(); removeImage(index); }}
//                                                 className="absolute top-1 right-1 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
//                                             >
//                                                 ✕
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* BOTTOM: Submit Button - Golden Hover Effect */}
//                     <button
//                         type="submit"
//                         className="w-full bg-black text-white py-4 text-sm font-light tracking-widest uppercase hover:bg-[#D4AF37] transition-all duration-300"
//                     >
//                         Create Product
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CreateProduct;

// import React, { useState } from 'react';

// const CreateProduct = () => {
//     const [formData, setFormData] = useState({
//         title: '',
//         description: '',
//         amount: '',
//         currency: 'INR',
//     });
//     const [images, setImages] = useState([]);
//     const [isDragging, setIsDragging] = useState(false);

//     // Handle Form Input
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     // Handle Image Selection (Click or Drop)
//     const processFiles = (files) => {
//         const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

//         if (images.length + validFiles.length > 7) {
//             alert("Bro, you can only upload a maximum of 7 images.");
//             return;
//         }

//         const newImages = validFiles.map(file => ({
//             file,
//             url: URL.createObjectURL(file)
//         }));

//         setImages(prev => [...prev, ...newImages].slice(0, 7));
//     };

//     const handleImageChange = (e) => processFiles(e.target.files);

//     // Drag and Drop Handlers
//     const handleDragOver = (e) => {
//         e.preventDefault();
//         setIsDragging(true);
//     };

//     const handleDragLeave = () => setIsDragging(false);

//     const handleDrop = (e) => {
//         e.preventDefault();
//         setIsDragging(false);
//         processFiles(e.dataTransfer.files);
//     };

//     const removeImage = (indexToRemove) => {
//         setImages(images.filter((_, index) => index !== indexToRemove));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log("Product Data Submitted: ", formData);
//         console.log("Images: ", images);
//     };

//     return (
//         // 'font-light' aur max-width adjust karke elements ko centre aur minimal look diya hai
//         <div className="min-h-screen bg-white font-sans text-black py-12 px-8 md:px-20 lg:px-32 flex flex-col items-center">

//             {/* Container jo design ko center mein rakhega aur space dega */}
//             <div className="w-full max-w-5xl">

//                 {/* Header Section - Left Aligned */}
//                 <div className="mb-16 text-left">
//                     <h1 className="text-[20px] text-[#D4AF37] font-medium tracking-widest uppercase mb-6">
//                         Snitch
//                     </h1>
//                     <h2 className="text-4xl font-light tracking-wide uppercase text-black">
//                         New Listing
//                     </h2>
//                 </div>

//                 <form onSubmit={handleSubmit} className="w-full">
//                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-16">

//                         {/* LEFT SIDE: Inputs */}
//                         <div className="space-y-10">

//                             {/* Title */}
//                             <div className="flex flex-col">
//                                 <label className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-2">
//                                     Product Title
//                                 </label>
//                                 {/* Thin border, light focus, more space (py-2) */}
//                                 <input
//                                     type="text"
//                                     name="title"
//                                     value={formData.title}
//                                     onChange={handleInputChange}
//                                     required
//                                     className="w-full border-b-[0.5px] border-gray-300 py-2 text-sm font-light focus:outline-none focus:border-gray-500 transition-colors bg-transparent placeholder-gray-300"
//                                     placeholder="e.g. Premium Cotton Shirt"
//                                 />
//                             </div>

//                             {/* Description */}
//                             <div className="flex flex-col">
//                                 <label className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-2">
//                                     Description
//                                 </label>
//                                 <textarea
//                                     name="description"
//                                     value={formData.description}
//                                     onChange={handleInputChange}
//                                     required
//                                     rows="2"
//                                     className="w-full border-b-[0.5px] border-gray-300 py-2 text-sm font-light focus:outline-none focus:border-gray-500 transition-colors resize-none bg-transparent placeholder-gray-300"
//                                     placeholder="Fabric, fit, style..."
//                                 />
//                             </div>

//                             {/* Amount & Currency */}
//                             <div className="grid grid-cols-2 gap-8">
//                                 <div className="flex flex-col">
//                                     <label className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-2">
//                                         Amount
//                                     </label>
//                                     <input
//                                         type="number"
//                                         name="amount"
//                                         value={formData.amount}
//                                         onChange={handleInputChange}
//                                         required
//                                         min="0"
//                                         className="w-full border-b-[0.5px] border-gray-300 py-2 text-sm font-light focus:outline-none focus:border-gray-500 transition-colors bg-transparent placeholder-gray-300"
//                                         placeholder="0.00"
//                                     />
//                                 </div>

//                                 <div className="flex flex-col">
//                                     <label className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-2">
//                                         Currency
//                                     </label>
//                                     <select
//                                         name="currency"
//                                         value={formData.currency}
//                                         onChange={handleInputChange}
//                                         className="w-full border-b-[0.5px] border-gray-300 py-2 text-sm font-light focus:outline-none focus:border-gray-500 transition-colors bg-white cursor-pointer"
//                                     >
//                                         <option value="INR">INR</option>
//                                         <option value="USD">USD</option>
//                                         <option value="EUR">EUR</option>
//                                         <option value="GBP">GBP</option>
//                                         <option value="JPY">JPY</option>
//                                     </select>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* RIGHT SIDE: Drag & Drop Image Upload */}
//                         <div className="flex flex-col">
//                             <label className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-2">
//                                 Product Images ({images.length}/7)
//                             </label>

//                             {/* Drop box ko chhota kiya (min-h-[180px]) aur border thin kiya */}
//                             <div
//                                 onDragOver={handleDragOver}
//                                 onDragLeave={handleDragLeave}
//                                 onDrop={handleDrop}
//                                 className={`flex-1 flex flex-col items-center justify-center border-[0.5px] border-dashed min-h-[180px] p-4 transition-colors duration-300 cursor-pointer ${isDragging ? 'border-gray-500 bg-gray-50' : 'border-gray-300 hover:border-gray-400'
//                                     }`}
//                                 onClick={() => document.getElementById('imageUpload').click()}
//                             >
//                                 <input
//                                     type="file"
//                                     id="imageUpload"
//                                     multiple
//                                     accept="image/*"
//                                     onChange={handleImageChange}
//                                     className="hidden"
//                                 />
//                                 <p className="text-gray-400 text-sm font-light">Drag & drop images</p>
//                                 <p className="text-gray-300 text-xs mt-1">or click here</p>
//                             </div>

//                             {/* Image Previews */}
//                             {images.length > 0 && (
//                                 <div className="grid grid-cols-4 gap-3 mt-6">
//                                     {images.map((img, index) => (
//                                         <div key={index} className="relative group aspect-square">
//                                             <img
//                                                 src={img.url}
//                                                 alt={`Preview ${index}`}
//                                                 className="w-full h-full object-cover rounded-sm border border-gray-100"
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={(e) => { e.stopPropagation(); removeImage(index); }}
//                                                 className="absolute top-1 right-1 bg-black text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
//                                             >
//                                                 ✕
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>

//                     {/* BOTTOM: Submit Button - Full Width */}
//                     <button
//                         type="submit"
//                         className="w-full bg-black text-white py-4 text-sm font-light tracking-widest uppercase hover:bg-gray-800 transition-colors"
//                     >
//                         Create Product
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CreateProduct;
// import { useRef } from 'react'
// import { useState } from 'react'
// const CreateProduct = () => {

//     const fileRef = useRef(null)

//     const max = 7;

//     const [images, setImages] = useState([])
//     const [text, setText] = useState("")



//     function makingArrayFiles(files) {
//         const remaning = max - images.length
//         if (remaning <= 0) return;
//         const toadd = Array.from(files).slice(0, remaning)
//         const newArray = toadd.map((file) => {
//             return {
//                 file,
//                 preview: URL.createObjectURL(file)
//             }

//         })

//         setImages((prev) => {
//             return [...prev, ...newArray]
//         })

//     }
//     function handleFileChange(e) {
//         makingArrayFiles(e.target.files)
//         e.target.value = ""
//     }

//     function handleSubmit(e) {
//         e.preventDefault()

//         let data = new FormData()

//         data.append("text", text)
//         images.forEach((img) => {
//             data.append("images", img.file)
//         });


//     }
//     function handleDragOver(e) {
//         e.preventDefault()


//     }

//     function handleDrop(e) {
//         e.preventDefault()
//         const dropped = e.dataTransfer.files
//         makingArrayFiles(dropped)
//         console.log(dropped)
//     }

//     function removeImage(index){
//         const newImages = [...images]
//         URL.revokeObjectURL(newImages[index].preview)
//         newImages.splice(index, 1)
//         setImages(newImages)
//     }

//     return (
//         <div >

//             <br />
//             <form onSubmit={handleSubmit}>
//                 <div
//                     onDrop={handleDrop}
//                     onDragOver={handleDragOver}
//                     className='h-[300px] w-[300px] m-2 border border-black'
//                     onClick={() => {
//                         fileRef.current.click()
//                     }}
//                 >

//                     <input
//                         ref={fileRef}
//                         hidden
//                         onChange={(e) => {
//                             handleFileChange(e)

//                         }
//                         } multiple type="file" accept="image/*" />
//                 </div>
//                 <br />

//                 <br />
//                 <input value={text} className='border border-black' onChange={(e) => { setText(e.target.value) }} type="text" />
//                 <br />
//                 <button>submit</button>
//                 <div className=' border border-black'>
//                     {images.map((img, index) => {
//                         return (
//                             <div className=' ' key={index}>
//                                 hello
//                                 <img src={img.preview} />
//                                 <br />
//                                 <button onClick={()=>{
//                                     removeImage(index)
//                                 }} className='p-2 border border-black'>cut</button>
//                             </div>
//                         )
//                     })}
//                 </div>
//             </form>


//         </div>
//     )
// }

// export default CreateProduct


// import React, { useState } from 'react';

// const CreateProduct = () => {
//     const [formData, setFormData] = useState({
//         title: '',
//         description: '',
//         amount: '',
//         currency: 'INR',
//     });
//     const [images, setImages] = useState([]);
//     const [isDragging, setIsDragging] = useState(false);

//     // Handle Form Input
//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     // Handle Image Selection (Click or Drop)
//     const processFiles = (files) => {
//         const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

//         if (images.length + validFiles.length > 7) {
//             alert("Bro, you can only upload a maximum of 7 images.");
//             return;
//         }

//         const newImages = validFiles.map(file => ({
//             file,
//             url: URL.createObjectURL(file) // For preview purposes
//         }));

//         setImages(prev => [...prev, ...newImages].slice(0, 7));
//     };

//     const handleImageChange = (e) => processFiles(e.target.files);

//     // Drag and Drop Handlers
//     const handleDragOver = (e) => {
//         e.preventDefault();
//         setIsDragging(true);
//     };

//     const handleDragLeave = () => setIsDragging(false);

//     const handleDrop = (e) => {
//         e.preventDefault();
//         setIsDragging(false);
//         processFiles(e.dataTransfer.files);
//     };

//     const removeImage = (indexToRemove) => {
//         setImages(images.filter((_, index) => index !== indexToRemove));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         console.log("Product Data Submitted: ", formData);
//         console.log("Images: ", images);
//         // Add your API call here to save data to MongoDB
//     };

//     return (
//         <div className="min-h-screen bg-white font-sans text-black p-6 md:p-12">

//             {/* Brand & Header Section */}
//             <div className="text-center mb-12">
//                 <h1 className="text-4xl md:text-5xl font-extrabold tracking-widest uppercase mb-2">
//                     Snitch
//                 </h1>
//                 <h2 className="text-[#D4AF37] text-lg font-medium tracking-[0.2em] uppercase">
//                     New Listing
//                 </h2>
//             </div>

//             <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

//                     {/* LEFT SIDE: Inputs */}
//                     <div className="space-y-8">
//                         <div>
//                             <label className="block text-sm font-semibold uppercase tracking-wider mb-2 text-gray-800">
//                                 Product Title
//                             </label>
//                             <input
//                                 type="text"
//                                 name="title"
//                                 value={formData.title}
//                                 onChange={handleInputChange}
//                                 required
//                                 className="w-full border-b border-gray-300 py-3 text-lg focus:outline-none focus:border-[#D4AF37] transition-colors placeholder-gray-400 bg-transparent"
//                                 placeholder="Premium Cotton Shirt"
//                             />
//                         </div>

//                         <div>
//                             <label className="block text-sm font-semibold uppercase tracking-wider mb-2 text-gray-800">
//                                 Description
//                             </label>
//                             <textarea
//                                 name="description"
//                                 value={formData.description}
//                                 onChange={handleInputChange}
//                                 required
//                                 rows="4"
//                                 className="w-full border border-gray-300 p-4 text-base focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-colors resize-none bg-transparent"
//                                 placeholder="Describe the fabric, fit, and style..."
//                             />
//                         </div>

//                         <div className="grid grid-cols-2 gap-6">
//                             <div>
//                                 <label className="block text-sm font-semibold uppercase tracking-wider mb-2 text-gray-800">
//                                     Amount
//                                 </label>
//                                 <input
//                                     type="number"
//                                     name="amount"
//                                     value={formData.amount}
//                                     onChange={handleInputChange}
//                                     required
//                                     min="0"
//                                     className="w-full border-b border-gray-300 py-3 text-lg focus:outline-none focus:border-[#D4AF37] transition-colors bg-transparent"
//                                     placeholder="0.00"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block text-sm font-semibold uppercase tracking-wider mb-2 text-gray-800">
//                                     Currency
//                                 </label>
//                                 <select
//                                     name="currency"
//                                     value={formData.currency}
//                                     onChange={handleInputChange}
//                                     className="w-full border-b border-gray-300 py-3 text-lg focus:outline-none focus:border-[#D4AF37] transition-colors bg-white cursor-pointer"
//                                 >
//                                     <option value="INR">INR</option>
//                                     <option value="USD">USD</option>
//                                     <option value="EUR">EUR</option>
//                                     <option value="GBP">GBP</option>
//                                     <option value="JPY">JPY</option>
//                                 </select>
//                             </div>
//                         </div>
//                     </div>

//                     {/* RIGHT SIDE: Drag & Drop Image Upload */}
//                     <div className="flex flex-col h-full">
//                         <label className="block text-sm font-semibold uppercase tracking-wider mb-4 text-gray-800">
//                             Product Images ({images.length}/7)
//                         </label>

//                         <div
//                             onDragOver={handleDragOver}
//                             onDragLeave={handleDragLeave}
//                             onDrop={handleDrop}
//                             className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed min-h-[300px] p-8 transition-colors duration-300 cursor-pointer ${isDragging ? 'border-[#D4AF37] bg-yellow-50' : 'border-gray-300 hover:border-[#D4AF37]'
//                                 }`}
//                             onClick={() => document.getElementById('imageUpload').click()}
//                         >
//                             <input
//                                 type="file"
//                                 id="imageUpload"
//                                 multiple
//                                 accept="image/*"
//                                 onChange={handleImageChange}
//                                 className="hidden"
//                             />
//                             <svg className="w-12 h-12 text-[#D4AF37] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                             </svg>
//                             <p className="text-gray-600 font-medium">Drag & Drop your images here</p>
//                             <p className="text-gray-400 text-sm mt-2">or click to browse</p>
//                         </div>

//                         {/* Image Previews */}
//                         {images.length > 0 && (
//                             <div className="grid grid-cols-4 gap-4 mt-6">
//                                 {images.map((img, index) => (
//                                     <div key={index} className="relative group aspect-square">
//                                         <img
//                                             src={img.url}
//                                             alt={`Preview ${index}`}
//                                             className="w-full h-full object-cover rounded shadow-sm border border-gray-200"
//                                         />
//                                         <button
//                                             type="button"
//                                             onClick={(e) => { e.stopPropagation(); removeImage(index); }}
//                                             className="absolute top-1 right-1 bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
//                                         >
//                                             ✕
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* BOTTOM: Submit Button */}
//                 <div className="mt-16 flex justify-center">
//                     <button
//                         type="submit"
//                         className="w-full max-w-md bg-black text-[#D4AF37] py-4 px-8 text-lg font-bold uppercase tracking-widest hover:bg-gray-900 transition-colors shadow-lg"
//                     >
//                         Create Product
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// };

// export default CreateProduct;