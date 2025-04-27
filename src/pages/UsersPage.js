import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACKEND = process.env.REACT_APP_BACKEND_URL;

const UsersPage = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null); // Add error state
    const [editingUserId, setEditingUserId] = useState(null); // Track which user is being edited
    const [editedUserData, setEditedUserData] = useState({}); // Store data of the user being edited

    // Fetch users when the component mounts
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch data from the API
                const response = await axios.get(`${BACKEND}/api/user/users`);
                setUsers(response.data);
                setLoading(false);
            } catch (error) {
                setError("Failed to fetch users. Please try again.");
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Handle change in editable fields
    const handleEditChange = (e, field) => {
        const { value } = e.target;
        setEditedUserData((prevState) => ({
            ...prevState,
            [field]: value
        }));
    };

    // Toggle edit mode for a specific user
    const handleEditClick = (user) => {
        setEditingUserId(user._id || user.id); // Use _id or id depending on your API response
        setEditedUserData({
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        });
    };

    // Save the edited user data
    const handleSaveClick = async (userId) => {
        try {
            // Use userId as the unique identifier when saving
            await axios.put(`${BACKEND}/api/user/${userId}`, editedUserData);
            const updatedUsers = users.map((user) =>
                user._id === userId || user.id === userId ? { ...user, ...editedUserData } : user
            );
            setUsers(updatedUsers);
            setEditingUserId(null); // Exit edit mode
        } catch (error) {
            setError("Failed to update user. Please try again.");
        }
    };

    // Cancel editing
    const handleCancelClick = () => {
        setEditingUserId(null); // Exit edit mode without saving
    };

    if (loading) {
        return (
            <section className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
                    <p>Loading...</p> {/* Show a loading message while fetching users */}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="flex-1 overflow-y-auto p-6 bg-gray-50">
                <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
                    <p className="text-red-500">{error}</p> {/* Display an error message */}
                </div>
            </section>
        );
    }

    return (
        <section className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Users</h2>
                    <button
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        type="button"
                        onClick={() => navigate("/add-user")}
                    >
                        <i className="fas fa-user-plus mr-2"></i> Add User
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="relative px-6 py-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user._id || user.id}> {/* Use _id or id for key */}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {editingUserId === user._id || editingUserId === user.id ? (
                                            <input
                                                type="text"
                                                value={editedUserData.name}
                                                onChange={(e) => handleEditChange(e, "name")}
                                                className="border px-2 py-1 rounded"
                                            />
                                        ) : (
                                            user.name
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {editingUserId === user._id || editingUserId === user.id ? (
                                            <input
                                                type="email"
                                                value={editedUserData.email}
                                                onChange={(e) => handleEditChange(e, "email")}
                                                className="border px-2 py-1 rounded"
                                            />
                                        ) : (
                                            user.email
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm uppercase text-gray-500">
                                        {editingUserId === user._id || editingUserId === user.id ? (
                                            <select
                                                value={editedUserData.role}
                                                onChange={(e) => handleEditChange(e, "role")}
                                                className="border px-2 py-1 rounded"
                                            >
                                                <option value="Admin">Admin</option>
                                                <option value="Editor">Editor</option>
                                                <option value="User">User</option>
                                            </select>
                                        ) : (
                                            user.role
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingUserId === user._id || editingUserId === user.id ? (
                                            <select
                                                value={editedUserData.status}
                                                onChange={(e) => handleEditChange(e, "status")}
                                                className="border px-2 py-1 rounded"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                                <option value="pending">Pending</option>
                                            </select>
                                        ) : (
                                            <span
                                                className={`px-2 inline-flex text-xs leading-5 uppercase font-semibold rounded-full 
                                                    ${user.status === "active" ? "bg-green-100 text-green-800" : ""}
                                                    ${user.status === "inactive" ? "bg-red-100 text-red-800" : ""}
                                                    ${user.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                                                `}
                                            >
                                                {user.status}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {editingUserId === user._id || editingUserId === user.id ? (
                                            <>
                                                <button
                                                    onClick={() => handleSaveClick(user._id || user.id)}
                                                    className="text-green-600 hover:text-green-900"
                                                >
                                                    Save
                                                </button>
                                                <button
                                                    onClick={handleCancelClick}
                                                    className="ml-2 text-red-600 hover:text-red-900"
                                                >
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => handleEditClick(user)}
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
                </div>
            </div>
        </section>
    );
};

export default UsersPage;
