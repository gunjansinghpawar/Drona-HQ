import React, { useState } from 'react';
import axios from 'axios';

const AddBanner = () => {
  const [bannerImage, setBannerImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setBannerImage(file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data
    const formData = new FormData();
    formData.append('image', bannerImage);

    try {
      // Send POST request to your backend
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/banner`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle success response (You can store the response or show a success message)
      console.log('Banner uploaded successfully:', response.data);
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error uploading banner:', error);
    }
  };

  return (
    <section className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New Banner</h2>
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data" method="POST" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="bannerImage">
              Banner Image
            </label>
            <input
              accept="image/*"
              className="mt-1 block w-full text-gray-700"
              id="bannerImage"
              name="bannerImage"
              required
              type="file"
              onChange={handleFileChange}
            />
          </div>

          {preview && (
            <div className="mt-4">
              <img src={preview} alt="Preview" className="w-[50%] h-auto rounded-lg shadow-md" />
            </div>
          )}

          <div className="pt-4">
            <button
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              type="submit"
            >
              Save Banner
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddBanner;
