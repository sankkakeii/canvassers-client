import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import branches from '@/components/branches';


// Searchable BranchDropdown component
const BranchDropdown = ({ selectedBranch, setSelectedBranch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    // const branches = ['Branch A', 'Branch B', 'Branch C', 'Branch D', 'Branch E']; // Replace with your actual branch list

    const filteredBranches = branches.filter(branch => 
        branch.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-[200px] mb-4">
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                    <SelectValue placeholder="Select a branch" />
                </SelectTrigger>
                <SelectContent>
                    <div className="p-2">
                        <Input
                            placeholder="Search branches..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {filteredBranches.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                            {branch}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};

// Main AdminApp component
const AdminApp = () => {
    const [users, setUsers] = useState([]);
    const [checkIns, setCheckIns] = useState([]);
    const [sales, setSales] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [checkInSearch, setCheckInSearch] = useState('');
    const [saleSearch, setSaleSearch] = useState('');
    const [userFilter, setUserFilter] = useState('all');
    const API_URL = '/api';

    useEffect(() => {
        fetchUsers();
        fetchCheckIns();
        fetchSales();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/supa/admin/fetch-all-users`, {
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
            const response = await fetch(`${API_URL}/supa/admin/fetch-all-checkins`, {
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
            const response = await fetch(`${API_URL}/supa/admin/fetch-all-sales`, {
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
            const response = await fetch(`${API_URL}/supa/admin/update-user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ id: userId, active, slot_location: selectedBranch })
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

    const filteredUsers = users.filter(user =>
        (user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email.toLowerCase().includes(userSearch.toLowerCase())) &&
        (userFilter === 'all' || (userFilter === 'active' && user.active) || (userFilter === 'inactive' && !user.active))
    );

    const filteredCheckIns = checkIns.filter(checkIn =>
        checkIn.location.toLowerCase().includes(checkInSearch.toLowerCase()) ||
        checkIn.branch.toLowerCase().includes(checkInSearch.toLowerCase())
    );

    const filteredSales = sales.filter(sale =>
        sale.id.toString().toLowerCase().includes(saleSearch.toLowerCase())
    );

    return (
        <div className="flex flex-col items-center justify-center w-full h-fit p-4 bg-gray-100">
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-md p-6">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                <BranchDropdown selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch} />

                {message && (
                    <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                        {message}
                    </div>
                )}

                <h2 className="text-xl font-semibold mb-2">Users</h2>
                <div className="mb-4 flex gap-4">
                    <Input
                        placeholder="Search users..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="max-w-sm"
                    />
                    <Select value={userFilter} onValueChange={setUserFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2 text-left">Name</th>
                                <th className="border p-2 text-left">Email</th>
                                <th className="border p-2 text-left">Status</th>
                                <th className="border p-2 text-left">Slot Location</th>
                                <th className="border p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-100">
                                    <td className="border p-2">{user.name}</td>
                                    <td className="border p-2">{user.email}</td>
                                    <td className="border p-2">{user.active ? 'Active' : 'Inactive'}</td>
                                    <td className="border p-2">{user.slot_location}</td>
                                    <td className="border p-2">
                                        <button
                                            onClick={() => handleStatusChange(user, user.active)}
                                            className={`px-4 py-2 rounded-md ${user.active ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
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
                <Input
                    placeholder="Search check-ins..."
                    value={checkInSearch}
                    onChange={(e) => setCheckInSearch(e.target.value)}
                    className="max-w-sm mb-4"
                />
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2 text-left">Check-In Time</th>
                                <th className="border p-2 text-left">User ID</th>
                                <th className="border p-2 text-left">Location</th>
                                <th className="border p-2 text-left">Branch</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCheckIns.map(checkIn => (
                                <tr key={checkIn.id} className="hover:bg-gray-100">
                                    <td className="border p-2">{new Date(checkIn.check_in_time).toLocaleString()}</td>
                                    <td className="border p-2">{checkIn.user_id}</td>
                                    <td className="border p-2">{checkIn.location}</td>
                                    <td className="border p-2">{checkIn.branch}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <h2 className="text-xl font-semibold mt-6 mb-2">Sales</h2>
                <Input
                    placeholder="Search sales..."
                    value={saleSearch}
                    onChange={(e) => setSaleSearch(e.target.value)}
                    className="max-w-sm mb-4"
                />
                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2 text-left">Sale Time</th>
                                <th className="border p-2 text-left">User ID</th>
                                <th className="border p-2 text-left">Amount</th>
                                <th className="border p-2 text-left">Product</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSales.map(sale => (
                                <tr key={sale.id} className="hover:bg-gray-100">
                                    <td className="border p-2">{new Date(sale.created_at).toLocaleString()}</td>
                                    <td className="border p-2">{sale.user_id}</td>
                                    <td className="border p-2">{sale.amount}</td>
                                    <td className="border p-2">{sale.product}</td>
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
