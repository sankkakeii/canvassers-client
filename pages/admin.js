import React, { useState, useEffect } from 'react';

const AdminApp = () => {
    const [users, setUsers] = useState([]);
    const [checkIns, setCheckIns] = useState([]);
    const [sales, setSales] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    // const API_URL = 'http://localhost:5001/api';
    const API_URL = 'https://canvassers-api.onrender.com/api';

    useEffect(() => {
        fetchUsers();
        fetchCheckIns();
        fetchSales();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/users`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setMessage('Error fetching users');
        }
    };

    const fetchCheckIns = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/check-ins`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch check-ins');
            const data = await response.json();
            setCheckIns(data);
        } catch (error) {
            console.error('Error fetching check-ins:', error);
            setMessage('Error fetching check-ins');
        }
    };

    const fetchSales = async () => {
        try {
            const response = await fetch(`${API_URL}/admin/sales`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch sales');
            const data = await response.json();
            setSales(data);
        } catch (error) {
            console.error('Error fetching sales:', error);
            setMessage('Error fetching sales');
        }
    };

    const updateUserStatus = async (userId, active) => {
        try {
            const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ active })
            });
            if (!response.ok) throw new Error('Failed to update user status');
            const data = await response.json();
            setMessage(data.message);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user status:', error);
            setMessage('Failed to update user status');
        }
    };

    const handleStatusChange = (user, active) => {
        updateUserStatus(user.id, active ? 0 : 1);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full h-fit p-4 bg-gray-100">
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-md p-6">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

                {message && (
                    <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                        {message}
                    </div>
                )}

                <h2 className="text-xl font-semibold mb-2">Users</h2>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2 text-left">Name</th>
                                <th className="border p-2 text-left">Email</th>
                                <th className="border p-2 text-left">Status</th>
                                <th className="border p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="hover:bg-gray-100">
                                    <td className="border p-2">{user.name}</td>
                                    <td className="border p-2">{user.email}</td>
                                    <td className="border p-2">{user.active ? 'Active' : 'Inactive'}</td>
                                    <td className="border p-2">
                                        <button
                                            onClick={() => handleStatusChange(user, user.active)}
                                            className={`px-4 py-2 rounded-md ${user.active ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                                                }`}
                                        >
                                            {user.active ? 'Deactivate' : 'Activate'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-2">Check-Ins</h2>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2 text-left">Check-In Time</th>
                                <th className="border p-2 text-left">User ID</th>
                            </tr>
                        </thead>
                        <tbody>
                            {checkIns.map(checkIn => (
                                <tr key={checkIn.id} className="hover:bg-gray-100">
                                    <td className="border p-2">{new Date(checkIn.checkInDateTime).toLocaleString()}</td>
                                    <td className="border p-2">{checkIn.userId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-2">Sales</h2>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2 text-left">Sale Time</th>
                                <th className="border p-2 text-left">Customer Name</th>
                                <th className="border p-2 text-left">Device Model</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map(sale => (
                                <tr key={sale.id} className="hover:bg-gray-100">
                                    <td className="border p-2">{new Date(sale.createdAt).toLocaleString()}</td>
                                    <td className="border p-2">{sale.customerName}</td>
                                    <td className="border p-2">{sale.deviceModel}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminApp;
