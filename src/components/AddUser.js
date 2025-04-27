import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios for HTTP requests

const AddUser = () => {
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: '', // Remove role from here
  });
  const [loading, setLoading] = useState(false); // For handling loading state
  const [error, setError] = useState(null); // For handling errors
  const BACKEND = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };
  console.log(process.env);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the form is submitting
    setError(null); // Clear previous errors

    try {
      const response = await axios.post(`${BACKEND}/api/user/register`, {
        ...formData,
        password, // Include the password in the request
      });

      // If successful, navigate to another page or handle success
      console.log('User added successfully:', response.data);
      navigate('/users'); // Redirect to users list or another page
    } catch (err) {
      // Handle error
      console.error('Error adding user:', err);
      setError('Failed to add user. Please try again.');
    } finally {
      setLoading(false); // Set loading to false once the request completes
    }
  };

  const handleBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <section className="flex-1 overflow-y-auto p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New User</h2>
        
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-4 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <i className="fas fa-arrow-left mr-2"></i>Back
        </button>

        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="name">Full Name</label>
            <input
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              id="name"
              name="name"
              placeholder="Enter full name"
              required
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email Address</label>
            <input
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              id="email"
              name="email"
              placeholder="Enter email address"
              required
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <div className="relative mt-1">
              <input
                aria-describedby="passwordHelp"
                className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 pr-10 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                id="password"
                name="password"
                placeholder="Enter password"
                required
                type={passwordVisible ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
              />
              <button
                aria-label="Toggle password visibility"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                type="button"
                onClick={togglePasswordVisibility}
              >
                <i className={`fas ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`} id="eyeIcon"></i>
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500" id="passwordHelp">Must be at least 8 characters.</p>
          </div>
          
          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              className={`inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading && 'opacity-50 cursor-not-allowed'}`}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Adding...' : <><i className="fas fa-user-plus mr-2 self-center"></i> Add User</>}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddUser;
