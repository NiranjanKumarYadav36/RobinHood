import React, { useState, useRef } from 'react';
import Header from '../Header/header';

function FormPage() {
  const [images, setImages] = useState<File[]>([]); // Store image files
  const [foodName, setFoodName] = useState('');       // New state for Food Name
  const [description, setDescription] = useState('');
  const [expiry, setExpiry] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process files from drag-drop or file input
  const handleFiles = (files: FileList) => {
    const fileArray = Array.from(files).filter(file =>
      file.type.startsWith('image/')
    );
    if (fileArray.length) {
      setImages(prev => [...prev, ...fileArray]);
      setError('');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  // New function to remove an image by index
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    if (images.length === 0) {
      setError('At least one image is required.');
      return;
    }
    if (!expiry) {
      setError('Expected expiry date is required.');
      return;
    }
    
    // Validate that the selected expiry date is not before today's date
    const selectedDate = new Date(expiry);
    const today = new Date(new Date().toISOString().split("T")[0]); // set to midnight today
    if (selectedDate < today) {
      setError('Expiry date cannot be before today.');
      return;
    }

    // Process submission
    const formData = {
      images,
      foodName,      // Include the food name in form data
      description,
      expiry,
    };
    console.log('Form submitted:', formData);
    alert('Form submitted successfully!');
    // Reset form if needed
  };

  // Get today's date in YYYY-MM-DD format for min attribute
  const todayDate = new Date().toISOString().split("T")[0];

  return (
    <>
      {/* <Header /> */}
      <section className="max-w-4xl p-6 mx-auto bg-green-100 rounded-md shadow-md dark:bg-gray-800 mt-15">
        <div className="max-w-xl mx-auto p-4">
          <h1 className="text-3xl font-bold text-green-800 capitalize dark:text-white mb-4">Submit Food Details</h1>
          
          {error && <div className="mb-4 text-red-600">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            {/* Drag and Drop Area */}
            <label className="block text-sm font-medium dark:text-white">Image</label>
            <div 
              className="mt-2 border-dashed border-2 border-gray-300 p-6 mb-4 text-center cursor-pointer rounded-xl"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <svg className="mx-auto h-12 w-12 text-green-950" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p>Drag and drop image file here or click to upload</p>
              <input 
                type="file" 
                accept="image/*" 
                multiple 
                ref={fileInputRef} 
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Image Preview with Delete Option */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {images.map((file, index) => (
                <div key={index} className="relative">
                  <img 
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            {/* Food Name Field */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium dark:text-white">Food Name</label>
              <input 
                type="text"
                value={foodName}
                onChange={(e) => setFoodName(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Enter food name"
              />
            </div>

            {/* Description Field */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium dark:text-white">Food Description</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded"
                placeholder="Enter description about the food"
              ></textarea>
            </div>

            {/* Expected Expiry Date Field */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium dark:text-white">
                Expected Expiry Date <span className="text-red-600">*</span>
              </label>
              <input 
                type="date"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                min={todayDate}
                className="w-full border border-gray-300 p-2 rounded"
                required
              />
            </div>

            <button 
              type="submit" 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </section>
    </>
  );
}

export default FormPage;
