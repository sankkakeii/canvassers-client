import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import branches from '@/components/branches';
import Pagination from '@/components/Pagination';

import UserChart from '@/components/admin-components/UserChart';
import CheckInChart from '@/components/admin-components/CheckInChart';

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
    const sections = ['Users', 'Check-Ins'];
    return (
        <aside className="fixed top-0 left-0 w-64 bg-gray-800 text-white h-screen p-4">
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

const AdminApp = () => {
    const [users, setUsers] = useState([]);
    const [checkIns, setCheckIns] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeSection, setActiveSection] = useState('Users');
    const [filters, setFilters] = useState({
        date: '',
        order: 'asc',
        name: '',
        emailSuffix: ''
    });
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

    const getUserById = (id) => {
        return users.find(user => user.id === id);
    };

    const getPageData = (data, page) => {
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return data.slice(startIndex, endIndex);
    };

    const filterCheckIns = () => {
        let filteredData = [...checkIns];
    
        if (filters.date) {
            filteredData = filteredData.filter(checkIn => {
                const checkInDate = new Date(checkIn.check_in_time).toLocaleDateString('en-CA'); // Use 'en-CA' for YYYY-MM-DD format
                return checkInDate === filters.date;
            });
        }
    
        if (filters.name) {
            filteredData = filteredData.filter(checkIn =>
                getUserById(checkIn.user_id)?.name.toLowerCase().includes(filters.name.toLowerCase())
            );
        }
    
        if (filters.emailSuffix) {
            const emailRegex = new RegExp(`${filters.emailSuffix}$`);
            filteredData = filteredData.filter(checkIn =>
                emailRegex.test(checkIn.email)
            );
        }
    
        if (filters.order === 'desc') {
            filteredData.sort((a, b) => new Date(b.check_in_time) - new Date(a.check_in_time));
        } else {
            filteredData.sort((a, b) => new Date(a.check_in_time) - new Date(b.check_in_time));
        }
    
        return filteredData;
    };
    

    const userPageData = getPageData(users, currentPage);
    const checkInPageData = getPageData(filterCheckIns(), currentPage);

    const renderContent = () => {
        switch (activeSection) {
            case 'Users':
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Users</h2>
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
                                totalItems={users.length}
                                itemsPerPage={ITEMS_PER_PAGE}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                        <UserChart users={users} />
                    </div>
                );
            case 'Check-Ins':
                return (
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Check-Ins</h2>
                        <BranchDropdown
                            selectedBranch={selectedBranch}
                            setSelectedBranch={setSelectedBranch}
                        />
                        <div className="mb-4 flex gap-2">
                            <Input
                                type="date"
                                placeholder="Filter by date"
                                value={filters.date}
                                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                                className="p-2 border border-gray-300 rounded"
                            />
                            <Input
                                placeholder="Filter by name"
                                value={filters.name}
                                onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                                className="p-2 border border-gray-300 rounded"
                            />
                            <Input
                                placeholder="Filter by email suffix"
                                value={filters.emailSuffix}
                                onChange={(e) => setFilters({ ...filters, emailSuffix: e.target.value })}
                                className="p-2 border border-gray-300 rounded"
                            />
                            <select
                                value={filters.order}
                                onChange={(e) => setFilters({ ...filters, order: e.target.value })}
                                className="p-2 border border-gray-300 rounded"
                            >
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2 text-left">User ID</th>
                                        <th className="border p-2 text-left">Name</th>
                                        <th className="border p-2 text-left">Check-In Time</th>
                                        <th className="border p-2 text-left">Check-Out Time</th>
                                        <th className="border p-2 text-left">Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checkInPageData.map(checkIn => (
                                        <tr key={checkIn.id} className="hover:bg-gray-100">
                                            <td className="border p-2">{checkIn.user_id}</td>
                                            <td className="border p-2">{checkIn.name}</td>
                                            <td className="border p-2">{new Date(checkIn.check_in_time).toLocaleString()}</td>
                                            <td className="border p-2">{new Date(checkIn.check_out_time).toLocaleString()}</td>
                                            <td className="border p-2">{checkIn.location}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination
                                currentPage={currentPage}
                                totalItems={filterCheckIns().length}
                                itemsPerPage={ITEMS_PER_PAGE}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                        <CheckInChart checkIns={checkIns} />
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex">
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
            <main className="ml-64 p-8 flex-1">
                {message && <div className="mb-4 p-4 bg-red-100 text-red-600 rounded">{message}</div>}
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminApp;
