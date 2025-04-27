import { useEffect, useState } from "react";

export default function Dashboard() {
  // State variables for users, movies, and recently added
  const [usersCount, setUsersCount] = useState(0);
  const [moviesCount, setMoviesCount] = useState(0);
  const [recentlyAddedMoviesCount, setRecentlyAddedMoviesCount] = useState(0);
  const BACKEND = process.env.REACT_APP_BACKEND_URL;

  // Function to calculate the number of movies added in the last 7 days
  const getMoviesAddedInLast7Days = (movies) => {
    const today = new Date();
    const last7Days = new Date(today.setDate(today.getDate() - 7));

    return movies.filter(movie => {
      const movieDate = new Date(movie.createdAt); // Assuming 'createdAt' exists in your movie schema
      return movieDate >= last7Days;
    }).length;
  };

  // Fetch the data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch total users count
        const usersResponse = await fetch(`${BACKEND}/api/user/users`);
        const usersData = await usersResponse.json();
        setUsersCount(usersData.length); // Assuming usersData is an array of users

        // Fetch all movies
        const moviesResponse = await fetch(`${BACKEND}/api/movie/`);
        const moviesData = await moviesResponse.json();
        setMoviesCount(moviesData.length); // Count all movies

        // Fetch recently added movies in the last 7 days
        const recentlyAddedMovies = getMoviesAddedInLast7Days(moviesData);
        setRecentlyAddedMoviesCount(recentlyAddedMovies);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the fetch on mount

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to the Dashboard!</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 - Users */}
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center hover:shadow-lg transition-shadow duration-300">
          <div className="flex-shrink-0 bg-blue-100 p-4 rounded-full">
            <i className="fas fa-users text-blue-600 text-3xl"></i>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-700">Users</h3>
            <p className="text-2xl font-bold text-blue-600">{usersCount}</p>
          </div>
        </div>

        {/* Card 2 - Movies */}
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center hover:shadow-lg transition-shadow duration-300">
          <div className="flex-shrink-0 bg-green-100 p-4 rounded-full">
            <i className="fas fa-film text-green-600 text-3xl"></i>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-700">Movies</h3>
            <p className="text-2xl font-bold text-green-600">{moviesCount}</p>
          </div>
        </div>

        {/* Card 3 - Recently Added Movies */}
        <div className="bg-white shadow-md rounded-lg p-6 flex items-center hover:shadow-lg transition-shadow duration-300">
          <div className="flex-shrink-0 bg-purple-100 p-4 rounded-full">
            <i className="fas fa-tv text-purple-600 text-3xl"></i>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-700">Recently added</h3>
            <p className="text-2xl font-bold text-purple-600">{recentlyAddedMoviesCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
