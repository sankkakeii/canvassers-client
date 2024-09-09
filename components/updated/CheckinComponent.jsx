// import React, { useState, useEffect } from 'react';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import Pagination from '@/components/Pagination';
// import CheckInChart from '@/components/admin-components/CheckInChart';

// const ITEMS_PER_PAGE = 20;
// const API_URL = '/api';

// const CheckinDataComponent = () => {
//     const [checkIns, setCheckIns] = useState([]);
//     const [users, setUsers] = useState([]);
//     const [message, setMessage] = useState('');
//     const [checkInSearch, setCheckInSearch] = useState('');
//     const [dateFilter, setDateFilter] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);

//     useEffect(() => {
//         fetchCheckIns();
//         fetchUsers();
//     }, []);

//     const fetchUsers = async () => {
//         try {
//             const response = await fetch(`${API_URL}/supa/admin/fetch-all-users`, {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });
//             if (!response.ok) throw new Error('Failed to fetch users');
//             const data = await response.json();
//             setUsers(data);
//         } catch (error) {
//             console.error('Error fetching users:', error);
//             setMessage('Error fetching users');
//         }
//     };

//     const fetchCheckIns = async () => {
//         try {
//             const response = await fetch(`${API_URL}/supa/admin/fetch-all-checkins`, {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                 },
//             });
//             if (!response.ok) throw new Error('Failed to fetch check-ins');
//             const data = await response.json();
//             setCheckIns(data);
//         } catch (error) {
//             console.error('Error fetching check-ins:', error);
//             setMessage('Error fetching check-ins');
//         }
//     };

//     const getUserById = (id) => users.find((user) => user.id === id);

//     const filterCheckIns = () => {
//         let filteredData = checkIns;

//         if (checkInSearch) {
//             filteredData = filteredData.filter((checkIn) =>
//                 checkIn?.branch?.toLowerCase().includes(checkInSearch.toLowerCase())
//             );
//         }

//         if (dateFilter) {
//             filteredData = filteredData.filter((checkIn) =>
//                 new Date(checkIn.check_in_time).toLocaleDateString() === new Date(dateFilter).toLocaleDateString()
//             );
//         }

//         return filteredData.reduce((acc, checkIn) => {
//             const existing = acc.find((item) => item.user_id === checkIn.user_id);
//             if (existing) {
//                 existing.check_in_time = new Date(
//                     Math.min(new Date(existing.check_in_time), new Date(checkIn.check_in_time))
//                 ).toLocaleString();
//             } else {
//                 acc.push({ ...checkIn, check_in_time: new Date(checkIn.check_in_time).toLocaleString() });
//             }
//             return acc;
//         }, []);
//     };

//     const handlePageChange = (page) => {
//         setCurrentPage(page);
//     };

//     const filteredCheckIns = filterCheckIns();
//     const totalItems = filteredCheckIns.length;

//     // Correct slicing logic for paginated data
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     const endIndex = startIndex + ITEMS_PER_PAGE;
//     const checkInPageData = filteredCheckIns.slice(startIndex, endIndex);

//     return (
//         <div className="flex">
//             <div className="min-h-screen">
//                 <div>
//                     <h2 className="text-xl font-semibold mb-2">Check-Ins</h2>
//                     <Input
//                         type="date"
//                         placeholder="Filter by date..."
//                         value={dateFilter}
//                         onChange={(e) => setDateFilter(e.target.value)}
//                         className="max-w-sm mb-4"
//                     />
//                     <Input
//                         placeholder="Search check-ins by branch..."
//                         value={checkInSearch}
//                         onChange={(e) => setCheckInSearch(e.target.value)}
//                         className="max-w-sm mb-4"
//                     />
//                     <div className="overflow-x-auto">
//                         <table className="w-full table-auto border-collapse border border-gray-200">
//                             <thead>
//                                 <tr className="bg-gray-200">
//                                     <th className="border p-2 text-left">Check-In Time</th>
//                                     <th className="border p-2 text-left">User ID</th>
//                                     <th className="border p-2 text-left">User Name</th>
//                                     <th className="border p-2 text-left">Location</th>
//                                     <th className="border p-2 text-left">Branch</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {checkInPageData.map((checkIn) => {
//                                     const user = getUserById(checkIn.user_id);
//                                     return (
//                                         <tr key={checkIn.id} className="hover:bg-gray-100">
//                                             <td className="border p-2">{checkIn.check_in_time}</td>
//                                             <td className="border p-2">{checkIn.user_id}</td>
//                                             <td className="border p-2">{user ? user.name : 'Unknown User'}</td>
//                                             <td className="border p-2">{checkIn.location}</td>
//                                             <td className="border p-2">{checkIn.branch}</td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </table>
//                         <Pagination
//                             currentPage={currentPage}
//                             totalItems={totalItems}
//                             itemsPerPage={ITEMS_PER_PAGE}
//                             onPageChange={handlePageChange}
//                         />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CheckinDataComponent;










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

    // const filterCheckIns = () => {
    //     let filteredData = checkIns;

    //     if (checkInSearch) {
    //         filteredData = filteredData.filter((checkIn) =>
    //             checkIn.branch?.toLowerCase().includes(checkInSearch.toLowerCase())
    //         );
    //     }

    //     if (nameSearch) {
    //         filteredData = filteredData.filter((checkIn) => {
    //             const user = getUserById(checkIn.user_id);
    //             return user && user.name.toLowerCase().includes(nameSearch.toLowerCase());
    //         });
    //     }

    //     if (dateFilter) {
    //         filteredData = filteredData.filter(
    //             (checkIn) =>
    //                 new Date(checkIn.check_in_time).toLocaleDateString() ===
    //                 new Date(dateFilter).toLocaleDateString()
    //         );
    //     }

    //     return filteredData.reduce((acc, checkIn) => {
    //         const existing = acc.find((item) => item.user_id === checkIn.user_id);
    //         if (existing) {
    //             existing.check_in_time = new Date(
    //                 Math.min(new Date(existing.check_in_time), new Date(checkIn.check_in_time))
    //             ).toLocaleString();
    //         } else {
    //             acc.push({ ...checkIn, check_in_time: new Date(checkIn.check_in_time).toLocaleString() });
    //         }
    //         return acc;
    //     }, []);
    // };

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

        // Format the data to make it more human-readable
        return filteredData.map((checkIn) => ({
            ...checkIn,
            check_in_time: new Date(checkIn.check_in_time).toLocaleString(), // Format check-in time
            location: checkIn.location || 'Unknown Location', // Ensure location is displayed properly
            branch: checkIn.branch || 'Unknown Branch', // Ensure branch is displayed properly
        }));
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
