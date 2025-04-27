import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MovieList = () => {
  const BACKEND = process.env.REACT_APP_BACKEND_URL; // Backend URL from environment variables
  const [movies, setMovies] = useState([]);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [newCategory, setNewCategory] = useState(""); // State for adding new category
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false); // Toggle for category input
  const [editedMovie, setEditedMovie] = useState({
    title: '',
    youtubeLink: '',
    uploadLink: '',
    category: '',
    status: 'Active', // Add a default status
  });

  const [loading, setLoading] = useState(true); // Loading state for fetching movies
  const navigate = useNavigate();

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${BACKEND}/api/movie/`); // API endpoint for fetching movies
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data)
        setMovies(data);
        setLoading(false); // Set loading to false after fetching
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchMovies();
  }, []); // Run once on component mount

  const handleEdit = (id) => {
    setEditingMovieId(id); // Set the movie to edit
    const movie = movies.find((m) => m.id === id);
    setEditedMovie({
      title: movie.title,
      youtubeLink: movie.youtubeLink,
      uploadLink: movie.uploadLink,
      category: movie.category,
      status: movie.status, // Initialize the status from the movie data
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (id) => {
    const updatedMovies = movies.map((movie) =>
      movie.id === id
        ? { ...movie, ...editedMovie } // Save changes to the movie
        : movie
    );
    setMovies(updatedMovies);
    setEditingMovieId(null); // Exit edit mode
  };

  const handleAddMovie = () => {
    navigate("/add-movies");
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      // Add new category to the selected movie
      const updatedMovies = movies.map((movie) =>
        movie.id === editingMovieId
          ? { ...movie, category: newCategory }
          : movie
      );
      setMovies(updatedMovies);
      setNewCategory(""); // Reset input
      setShowNewCategoryInput(false); // Hide input
    }
  };

  const toggleNewCategoryInput = () => {
    setShowNewCategoryInput((prev) => !prev); // Toggle the visibility of new category input
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
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            type="button"
            onClick={handleAddMovie}
          >
            <i className="fas fa-plus mr-2"></i> Add Movie
          </button>
        </div>

        {movies.length === 0 ?
          (
            <div className="flex justify-center items-center p-6">
              <span className="text-lg font-semibold text-gray-500">No movies available.</span>
            </div>
          ) : (<div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poster</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">YouTube</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Edit</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {movies.map((movie) => (
                  <tr key={movie.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img alt={`Movie poster for ${movie.title}`} className="h-16 w-12 rounded object-cover" src={movie.poster} width="80" height="120" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {editingMovieId === movie.id ? (
                        <input
                          name="title"
                          type="text"
                          value={editedMovie.title}
                          onChange={handleInputChange}
                          className="border px-2 py-1 rounded"
                        />
                      ) : (
                        movie.title
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {editingMovieId === movie.id ? (
                        <input
                          name="youtubeLink"
                          type="text"
                          value={editedMovie.youtubeLink}
                          onChange={handleInputChange}
                          className="border px-2 py-1 rounded"
                        />
                      ) : (
                        <a href={movie.youtubeLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Watch
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {editingMovieId === movie.id ? (
                        <input
                          name="uploadLink"
                          type="text"
                          value={editedMovie.uploadLink}
                          onChange={handleInputChange}
                          className="border px-2 py-1 rounded"
                        />
                      ) : (
                        <a href={movie.uploadLink} className="hover:underline">
                          Upload Link
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingMovieId === movie.id ? (
                        <>
                          <select
                            name="category"
                            value={editedMovie.category}
                            onChange={handleInputChange}
                            className="border px-2 py-1 rounded"
                          >
                            <option value="Action">Action</option>
                            <option value="Sci-Fi">Sci-Fi</option>
                            <option value="Fantasy">Fantasy</option>
                            <option value="Romance">Romance</option>
                            <option value="Mystery">Mystery</option>
                            <option value="Other">Other</option>
                          </select>
                          {showNewCategoryInput && (
                            <div>
                              <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Enter new category"
                                className="border px-2 py-1 mt-2"
                              />
                              <button
                                onClick={handleAddCategory}
                                className="text-green-600 mt-2"
                              >
                                Add Category
                              </button>
                            </div>
                          )}
                          <button
                            onClick={toggleNewCategoryInput}
                            className="text-blue-600 mt-2"
                          >
                            {showNewCategoryInput ? 'Cancel' : 'Add New Category'}
                          </button>
                        </>
                      ) : (
                        movie.category
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {editingMovieId === movie.id ? (
                        <select
                          name="status"
                          value={editedMovie.status}
                          onChange={handleInputChange}
                          className="border px-2 py-1 rounded"
                        >
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      ) : (
                        movie.status
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingMovieId === movie.id ? (
                        <button
                          onClick={() => handleSave(movie.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(movie.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>)
        }

      </div>
    </section>
  );
};

export default MovieList;
