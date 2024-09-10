import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import branches from '@/components/branches';
import Pagination from '@/components/Pagination';

import UserChart from '@/components/admin-components/UserChart';
import CheckInChart from '@/components/admin-components/CheckInChart';
import SalesChart from '@/components/admin-components/SalesChart';
import UserSalesChart from '@/components/admin-components/UserSalesChart';
import SalesOverTimeChart from '@/components/admin-components/SalesOverTimeChart';
import CheckinDataComponent from '@/components/updated/CheckinComponent';
import FeedbackComponent from '@/components/updated/FeedbackComponent';

const ITEMS_PER_PAGE = 10;

const BranchDropdown = ({ selectedBranch, setSelectedBranch }) => {
    const [searchTerm, setSearchTerm] = useState('');
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

const Sidebar = ({ activeSection, setActiveSection }) => {
    // const sections = ['Overview', 'Users', 'Check-Ins', 'Sales', 'Feedback'];
    const sections = ['Overview', 'Users', 'Check-Ins', 'Feedback'];
    return (
        <aside className=" fixed top-0 left-0 w-64 bg-gray-800 text-white h-screen p-4">
            <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
            <ul>
                {sections.map((section) => (
                    <li key={section} className="mb-2">
                        <button
                            onClick={() => setActiveSection(section)}
                            className={`w-full text-left p-2 rounded ${activeSection === section ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                        >
                            {section}
                        </button>
                    </li>
                ))}
            </ul>
        </aside>
    );
};

const Overview = ({ users, sales }) => {
    const totalUsers = users.length;
    const totalSales = sales.length;

    const topSellers = users
        .map(user => ({
            id: user.id,
            name: user.name,
            salesCount: sales.filter(sale => sale.user_id === user.id).length
        }))
        .sort((a, b) => b.salesCount - a.salesCount)
        .slice(0, 3);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-100 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Total Users</h3>
                    <p className="text-3xl font-bold">{totalUsers}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Total Sales</h3>
                    <p className="text-3xl font-bold">{totalSales}</p>
                </div>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Top 3 Sellers</h3>
                <ol className="list-decimal list-inside">
                    {topSellers.map((seller, index) => (
                        <li key={seller.id} className="text-lg">
                            {seller.name} - {seller.salesCount} sales
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
};

const AdminApp = () => {
    const [users, setUsers] = useState([]);
    const [checkIns, setCheckIns] = useState([]);
    const [sales, setSales] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [userFilter, setUserFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeSection, setActiveSection] = useState('Overview');
    const API_URL = '/api';

    useEffect(() => {
        fetchUsers();
        fetchCheckIns();
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

    const getPageData = (data, page) => {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return data.slice(startIndex, endIndex);
    };

    const filteredUsers = users.filter(user =>
        (user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase())) &&
        (userFilter === 'all' || (userFilter === 'active' && user.active) || (userFilter === 'inactive' && !user.active))
    );

    const userPageData = getPageData(filteredUsers, currentPage);

    const renderContent = () => {
        switch (activeSection) {
            case 'Overview':
                return <Overview users={users} sales={sales} />;
            case 'Users':
                return (
                    <div>
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
                                    {userPageData.map(user => (
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
                            <Pagination
                                currentPage={currentPage}
                                totalItems={filteredUsers.length}
                                itemsPerPage={ITEMS_PER_PAGE}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                        <UserChart users={filteredUsers} />
                    </div>
                );
            case 'Check-Ins':
                return (
                    <CheckinDataComponent />
                );
            case 'Feedback':
                return (
                    <FeedbackComponent />
                );
            default:
            return <div>Select a section from the sidebar</div>;
    }
};

return (
    <div className="flex">
        <Sidebar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            className=" bg-gray-800 text-white min-h-screen"
        />
        <div className="ml-64 w-full flex-1 p-4 bg-gray-100 min-h-screen">
            <div className="w-full max-w-6xl bg-white rounded-xl shadow-md p-6">
                <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
                <BranchDropdown selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch} />

                {message && (
                    <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                        {message}
                    </div>
                )}

                {renderContent()}
            </div>
        </div>
    </div>
);
};

export default AdminApp;