import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

const API_URL = '/api';

const CheckinDataComponent = () => {
    const [checkIns, setCheckIns] = useState([]);
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState('');
    const [checkInSearch, setCheckInSearch] = useState('');
    const [nameSearch, setNameSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    useEffect(() => {
        fetchCheckIns();
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/supa/admin/fetch-all-users`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
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
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch check-ins');
            const data = await response.json();
            setCheckIns(data);
        } catch (error) {
            console.error('Error fetching check-ins:', error);
            setMessage('Error fetching check-ins');
        }
    };

    const getUserById = (id) => users.find((user) => user.id === id);

    const filterCheckIns = () => {
        let filteredData = checkIns;

        // Filter by branch name if `checkInSearch` is provided
        if (checkInSearch) {
            filteredData = filteredData.filter((checkIn) =>
                checkIn.branch?.toLowerCase().includes(checkInSearch.toLowerCase())
            );
        }

        // Filter by user name if `nameSearch` is provided
        if (nameSearch) {
            filteredData = filteredData.filter((checkIn) => {
                const user = getUserById(checkIn.user_id);
                return user && user.name.toLowerCase().includes(nameSearch.toLowerCase());
            });
        }

        // Filter by date if `dateFilter` is provided
        if (dateFilter) {
            filteredData = filteredData.filter(
                (checkIn) =>
                    new Date(checkIn.check_in_time).toLocaleDateString() ===
                    new Date(dateFilter).toLocaleDateString()
            );
        }

        // Group check-ins by user and date, and select the earliest check-in for each user per date
        const earliestCheckIns = {};
        filteredData.forEach((checkIn) => {
            const userId = checkIn.user_id;
            const dateKey = new Date(checkIn.check_in_time).toLocaleDateString();
            const key = `${userId}-${dateKey}`;

            if (!earliestCheckIns[key]) {
                earliestCheckIns[key] = checkIn;
            } else if (new Date(checkIn.check_in_time) < new Date(earliestCheckIns[key].check_in_time)) {
                earliestCheckIns[key] = checkIn;
            }
        });

        // Return the filtered check-ins sorted by check-in time
        return Object.values(earliestCheckIns)
            .map((checkIn) => ({
                ...checkIn,
                check_in_time: new Date(checkIn.check_in_time).toLocaleString(), // Format check-in time
                location: checkIn.location || 'Unknown Location', // Ensure location is displayed properly
                branch: checkIn.branch || 'Unknown Branch', // Ensure branch is displayed properly
            }))
            .sort((a, b) => new Date(a.check_in_time) - new Date(b.check_in_time)); // Sort by check-in time
    };

    const filteredCheckIns = filterCheckIns();

    return (
        <div className="flex flex-col p-4">
            <h2 className="text-2xl font-semibold mb-4">Check-Ins</h2>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                <Input
                    type="date"
                    placeholder="Filter by date..."
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="max-w-sm"
                />
                <Input
                    placeholder="Search by branch..."
                    value={checkInSearch}
                    onChange={(e) => setCheckInSearch(e.target.value)}
                    className="max-w-sm"
                />
                <Input
                    placeholder="Search by user name..."
                    value={nameSearch}
                    onChange={(e) => setNameSearch(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            {/* Check-In Tally */}
            <div className="mb-4 bg-gray-200 p-4 rounded-lg w-fit">
                <p className="text-2xl font-medium text-green-600">
                    Total Check-Ins: {filteredCheckIns.length}
                </p>
            </div>

            <div className="overflow-x-auto border rounded-lg shadow-sm">
                {message && <p className="text-red-500 mb-4">{message}</p>}
                <table className="w-full border-collapse table-auto">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2 text-left">Check-In Time</th>
                            <th className="border p-2 text-left">User ID</th>
                            <th className="border p-2 text-left">User Name</th>
                            <th className="border p-2 text-left">Location</th>
                            <th className="border p-2 text-left">Branch</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCheckIns.map((checkIn) => {
                            const user = getUserById(checkIn.user_id);
                            return (
                                <tr key={checkIn.id} className="hover:bg-gray-100">
                                    <td className="border p-2">{checkIn.check_in_time}</td>
                                    <td className="border p-2">{checkIn.user_id}</td>
                                    <td className="border p-2">{user ? user.name : 'Unknown User'}</td>
                                    <td className="border p-2">{checkIn.location}</td>
                                    <td className="border p-2">{checkIn.branch}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CheckinDataComponent;
