import React, { useState } from "react";
import axios from "axios";

const AddCategory = () => {
  const [newCategory, setNewCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const BACKEND = process.env.REACT_APP_BACKEND_URL;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setCategoryImage(file);

    const previewURL = URL.createObjectURL(file);
    setImagePreview(previewURL);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", newCategory);
    formData.append("image", categoryImage);

    try {
      const response = await axios.post(`${BACKEND}/api/category/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data);
      setLoading(false);
      setNewCategory("");
      setCategoryImage(null);
      setImagePreview(null);
      setError(null);
    } catch (err) {
      setLoading(false);
      setError("Failed to add category. Please try again.");
    }
  };

  return (
    <section className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New Category</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>

          {/* New Category Input Always Visible */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="newCategory">
              Category Name
            </label>
            <input
              id="newCategory"
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
            />
          </div>

          {/* Category Image Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="categoryImage">
              Upload Category Image
            </label>
            <input
              id="categoryImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                         file:rounded-md file:border-0 file:text-sm file:font-semibold
                         file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Image Preview:</h4>
              <img
                src={imagePreview}
                alt="Category Preview"
                className="w-full max-h-64 object-cover mt-2 rounded-md shadow"
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-4 text-red-600 text-sm">
              <p>{error}</p>
            </div>
          )}

          {/* Loading Indicator */}
          {loading ? (
            <div className="mt-4 text-blue-600 text-sm">
              <p>Loading...</p>
            </div>
          ) : (
            <div className="pt-4">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Category
              </button>
            </div>
          )}
          
        </form>
      </div>
    </section>
  );
};

export default AddCategory;
