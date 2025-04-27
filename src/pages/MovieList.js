import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MovieList = () => {
  const BACKEND = process.env.REACT_APP_BACKEND_URL;
  const [movies, setMovies] = useState([]);
  const [editingMovieId, setEditingMovieId] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [editedMovie, setEditedMovie] = useState({
    title: '',
    youtubeLink: '',
    uploadLink: '',
    category: '',
    status: 'Active',
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch all movies
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${BACKEND}/api/movie/`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setMovies(data);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [BACKEND]);

  const handleEdit = (id) => {
    setEditingMovieId(id);
    const movie = movies.find((m) => m._id === id);
    if (movie) {
      setEditedMovie({
        title: movie.title,
        youtubeLink: movie.youtubeLink,
        uploadLink: movie.uploadLink,
        category: movie.category,
        status: movie.status,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedMovie((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (id) => {
    try {
      const response = await fetch(`${BACKEND}/api/movie/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editedMovie),
      });

      if (!response.ok) {
        throw new Error("Failed to update movie");
      }

      const updatedMovies = movies.map((movie) =>
        movie._id === id ? { ...movie, ...editedMovie } : movie
      );
      setMovies(updatedMovies);
      setEditingMovieId(null);
      setShowNewCategoryInput(false);
      setNewCategory("");
    } catch (error) {
      console.error("Error updating movie:", error);
    }
  };

  const handleAddMovie = () => {
    navigate("/add-movies");
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setEditedMovie((prev) => ({ ...prev, category: newCategory.trim() }));
      setShowNewCategoryInput(false);
      setNewCategory("");
    }
  };

  const toggleNewCategoryInput = () => {
    setShowNewCategoryInput((prev) => !prev);
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
                  <tr key={movie._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={movie.poster} alt={movie.title} className="h-16 w-12 rounded object-cover" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingMovieId === movie._id ? (
                        <input
                          name="title"
                          value={editedMovie.title}
                          onChange={handleInputChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        movie.title
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {editingMovieId === movie._id ? (
                        <input
                          name="youtubeLink"
                          value={editedMovie.youtubeLink}
                          onChange={handleInputChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        <a href={movie.youtubeLink} target="_blank" rel="noopener noreferrer" className="hover:underline">Watch</a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {editingMovieId === movie._id ? (
                        <input
                          name="uploadLink"
                          value={editedMovie.uploadLink}
                          onChange={handleInputChange}
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        <a href={movie.uploadLink} target="_blank" rel="noopener noreferrer" className="hover:underline">Upload Link</a>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingMovieId === movie._id ? (
                        <>
                          <select
                            name="category"
                            value={editedMovie.category}
                            onChange={handleInputChange}
                            className="border px-2 py-1 rounded w-full"
                          >
                            <option value="Action">Action</option>
                            <option value="Sci-Fi">Sci-Fi</option>
                            <option value="Fantasy">Fantasy</option>
                            <option value="Romance">Romance</option>
                            <option value="Mystery">Mystery</option>
                            <option value="Other">Other</option>
                          </select>
                          {showNewCategoryInput && (
                            <div className="mt-2">
                              <input
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="New Category"
                                className="border px-2 py-1 rounded w-full"
                              />
                              <button
                                onClick={handleAddCategory}
                                className="text-green-600 mt-1"
                              >
                                Add
                              </button>
                            </div>
                          )}
                          <button
                            onClick={toggleNewCategoryInput}
                            className="text-blue-600 mt-1"
                          >
                            {showNewCategoryInput ? "Cancel" : "New Category"}
                          </button>
                        </>
                      ) : (
                        movie.category
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingMovieId === movie._id ? (
                        <select
                          name="status"
                          value={editedMovie.status}
                          onChange={handleInputChange}
                          className="border px-2 py-1 rounded w-full"
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
                      {editingMovieId === movie._id ? (
                        <button
                          onClick={() => handleSave(movie._id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(movie._id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default MovieList;
