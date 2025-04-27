import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddMovie() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]); // 🆕 categories fetched from API
  const [loading, setLoading] = useState(false); 
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    uploadLink: "",
    youtubeLink: "",
    poster: null,
    category: "", // 🆕 selected category ID
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState(null); // Optional error state

  const BACKEND = process.env.REACT_APP_BACKEND_URL;

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BACKEND}/api/category/`);
        setCategories(response.data);
      } catch (err) {
        setError("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "poster" && files.length > 0) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, poster: file }));

      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log("Movie Data Submitted:", formData);

    const formPayload = new FormData();
    formPayload.append("title", formData.title);
    formPayload.append("description", formData.description);
    formPayload.append("uploadLink", formData.uploadLink);
    formPayload.append("youtubeLink", formData.youtubeLink);
    formPayload.append("poster", formData.poster);
    formPayload.append("category", formData.category); // Add selected category

    try {
      await axios.post(`${BACKEND}/api/movie/`, formPayload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      navigate("/movies"); // Redirect after successful submit
    } catch (err) {
      console.error(err);
      setError("Failed to add movie. Please try again.");
    }
  };

  const handleBack = () => {
    navigate("/movies");
  };

  return (
    <section className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Add New Movie</h2>
          <button
            onClick={handleBack}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <i className="fas fa-arrow-left mr-2"></i> Back
          </button>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
          
          {/* Movie Poster Upload + Preview */}
          <div>
            <label htmlFor="poster" className="block text-sm font-medium text-gray-700">
              Movie Poster
            </label>
            <input
              type="file"
              id="poster"
              name="poster"
              accept="image/*"
              onChange={handleChange}
              required
              className="mt-1 block w-full text-gray-700"
            />
            {previewImage && (
              <img
                src={previewImage}
                alt="Poster Preview"
                className="mt-4 w-48 h-72 object-cover rounded-md shadow-md"
              />
            )}
          </div>

          {/* Movie Name */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Movie Name
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter movie name"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Enter movie description"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            ></textarea>
          </div>

          {/* Upload Link */}
          <div>
            <label htmlFor="uploadLink" className="block text-sm font-medium text-gray-700">
              Upload Link
            </label>
            <input
              type="url"
              id="uploadLink"
              name="uploadLink"
              value={formData.uploadLink}
              onChange={handleChange}
              required
              placeholder="https://your-upload-link.com"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>

          {/* YouTube Link */}
          <div>
            <label htmlFor="youtubeLink" className="block text-sm font-medium text-gray-700">
              YouTube Link
            </label>
            <input
              type="url"
              id="youtubeLink"
              name="youtubeLink"
              value={formData.youtubeLink}
              onChange={handleChange}
              required
              placeholder="https://youtube.com/watch?v=xxxx"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Select Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="">-- Select a Category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <i className="fas fa-save mr-2 self-center"></i>
              {loading ? "Saving..." : "Save Movie"}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm mt-2">
              {error}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}
