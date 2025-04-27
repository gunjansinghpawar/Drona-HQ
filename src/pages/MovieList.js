import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MovieList = () => {
  const navigate = useNavigate();
  const BACKEND = process.env.REACT_APP_BACKEND_URL;
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMovie, setSelectedMovie] = useState(null); // Selected movie for editing
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    uploadLink: "",
    category: "",
    status: "",
    poster: null
  });

  // Fetch all movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${BACKEND}/api/movie/`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [BACKEND]);

  // Handle edit click - Open modal and pre-fill data
  const handleEdit = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.title,
      description: movie.description,
      uploadLink: movie.uploadLink,
      category: movie.category,
      status: movie.status,
      poster: movie.poster
    });
    setIsModalOpen(true);
  };

  const handleAddMovie = () => {
    navigate("/add-movie");
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save movie (update movie)
  const handleSave = async () => {
    try {
      const updatedMovie = {
        ...formData,
        poster: formData.poster // Make sure poster is included in the formData
      };
      const response = await fetch(`${BACKEND}/api/movie/${selectedMovie._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMovie),
      });

      if (!response.ok) {
        throw new Error(`Failed to update movie. Status: ${response.status}`);
      }

      const updatedMovieData = await response.json();
      setMovies((prevMovies) =>
        prevMovies.map((movie) =>
          movie._id === selectedMovie._id ? updatedMovieData : movie
        )
      );
      setIsModalOpen(false); // Close modal after saving
    } catch (error) {
      console.error("Error saving movie:", error);
    }
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <span className="text-lg font-semibold text-gray-500">Loading movies...</span>
      </div>
    );
  }

  return (
    <section className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Movies</h2>
          <button
            onClick={handleAddMovie}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
          >
            <i className="fas fa-plus mr-2"></i> Add Movie
          </button>
        </div>

        {movies.length === 0 ? (
          <div className="flex justify-center items-center p-6">
            <span className="text-lg font-semibold text-gray-500">No movies available.</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Movie Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {movies.map((movie) => (
                  <tr key={movie._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{movie.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{movie.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={movie.poster} alt={movie.title} className="h-16 w-12 rounded object-cover" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{movie.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600">
                      <a href={movie.uploadLink} target="_blank" rel="noopener noreferrer" className="hover:underline">Source Link</a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{movie.status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(movie)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for Editing Movie */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Edit Movie</h3>
                <button onClick={handleCloseModal} className="text-gray-500 hover:text-gray-700">&times;</button>
              </div>
              <form>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="title">Movie Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="uploadLink">Source Link</label>
                  <input
                    type="url"
                    id="uploadLink"
                    name="uploadLink"
                    value={formData.uploadLink}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700" htmlFor="status">Status</label>
                  <input
                    type="text"
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleSave}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-md"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieList;
