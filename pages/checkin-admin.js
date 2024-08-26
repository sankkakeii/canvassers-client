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
    const [userSearch, setUserSearch] = useState('');
    const [checkInSearch, setCheckInSearch] = useState('');
    const [userFilter, setUserFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [activeSection, setActiveSection] = useState('Users');
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

    const filteredUsers = users.filter(user =>
        (user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
            user.email.toLowerCase().includes(userSearch.toLowerCase())) &&
        (userFilter === 'all' || (userFilter === 'active' && user.active) || (userFilter === 'inactive' && !user.active))
    );

    const filteredCheckIns = checkIns.filter(checkIn =>
        checkIn?.branch?.toLowerCase().includes(checkInSearch.toLowerCase())
    ).reduce((acc, checkIn) => {
        const existing = acc.find(item => item.user_id === checkIn.user_id);
        if (existing) {
            existing.check_in_time = new Date(Math.min(new Date(existing.check_in_time), new Date(checkIn.check_in_time))).toLocaleString();
        } else {
            acc.push({ ...checkIn, check_in_time: new Date(checkIn.check_in_time).toLocaleString() });
        }
        return acc;
    }, []);

    const userPageData = getPageData(filteredUsers, currentPage);
    const checkInPageData = getPageData(filteredCheckIns, currentPage);

    const renderContent = () => {
        switch (activeSection) {
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
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Check-Ins</h2>
                        <Input
                            placeholder="Search check-ins..."
                            value={checkInSearch}
                            onChange={(e) => setCheckInSearch(e.target.value)}
                            className="mb-4 max-w-sm"
                        />
                        <BranchDropdown
                            selectedBranch={selectedBranch}
                            setSelectedBranch={setSelectedBranch}
                        />
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto border-collapse border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="border p-2 text-left">User ID</th>
                                        <th className="border p-2 text-left">User Name</th>
                                        <th className="border p-2 text-left">Check-In Time</th>
                                        {/* <th className="border p-2 text-left">Branch</th> */}
                                        <th className="border p-2 text-left">Check In Within Range</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {checkInPageData.map((checkIn) => (
                                        <tr key={checkIn.user_id} className="hover:bg-gray-100">
                                            <td className="border p-2">{checkIn.user_id}</td>
                                            <td className="border p-2">{getUserById(checkIn.user_id)?.name || 'Unknown'}</td>
                                            <td className="border p-2">{checkIn.check_in_time}</td>
                                            {/* <td className="border p-2">{checkIn.branch}</td> */}
                                            <td className="border p-2">{checkIn.within_400_meters}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Pagination
                                currentPage={currentPage}
                                totalItems={filteredCheckIns.length}
                                itemsPerPage={ITEMS_PER_PAGE}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                        <CheckInChart checkIns={filteredCheckIns} />
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
                {message && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                        {message}
                    </div>
                )}
                {renderContent()}
            </main>
        </div>
    );
};

export default AdminApp;






























// import React, { useState, useEffect } from 'react';
// import { Input } from '@/components/ui/input';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import branches from '@/components/branches';
// import Pagination from '@/components/Pagination';
// import UserChart from '@/components/admin-components/UserChart';
// import CheckInChart from '@/components/admin-components/CheckInChart';

// const ITEMS_PER_PAGE = 10;

// const BranchDropdown = ({ selectedBranch, setSelectedBranch }) => {
//     const [searchTerm, setSearchTerm] = useState('');
//     const filteredBranches = branches.filter(branch =>
//         branch.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     return (
//         <div className="w-[200px] mb-4">
//             <Select value={selectedBranch} onValueChange={setSelectedBranch}>
//                 <SelectTrigger>
//                     <SelectValue placeholder="Select a branch" />
//                 </SelectTrigger>
//                 <SelectContent>
//                     <div className="p-2">
//                         <Input
//                             placeholder="Search branches..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                         />
//                     </div>
//                     {filteredBranches.map((branch) => (
//                         <SelectItem key={branch} value={branch}>
//                             {branch}
//                         </SelectItem>
//                     ))}
//                 </SelectContent>
//             </Select>
//         </div>
//     );
// };

// const Sidebar = ({ activeSection, setActiveSection }) => {
//     const sections = ['Users', 'Check-Ins'];
//     return (
//         <aside className="fixed top-0 left-0 w-64 bg-gray-800 text-white h-screen p-4">
//             <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
//             <ul>
//                 {sections.map((section) => (
//                     <li key={section} className="mb-2">
//                         <button
//                             onClick={() => setActiveSection(section)}
//                             className={`w-full text-left p-2 rounded ${activeSection === section ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
//                         >
//                             {section}
//                         </button>
//                     </li>
//                 ))}
//             </ul>
//         </aside>
//     );
// };

// const CheckInModal = ({ user, checkIns, onClose }) => {
//     const userCheckIns = checkIns.filter(checkIn => checkIn.user_id === user.id);

//     return (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//             <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-3xl">
//                 <h3 className="text-xl font-semibold mb-4">Check-Ins for {user.name}</h3>
//                 <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
//                     &times;
//                 </button>
//                 <div className="overflow-x-auto">
//                     <table className="w-full table-auto border-collapse border border-gray-200">
//                         <thead>
//                             <tr className="bg-gray-200">
//                                 <th className="border p-2 text-left">Check-In Time</th>
//                                 <th className="border p-2 text-left">Check-Out Time</th>
//                                 <th className="border p-2 text-left">Location</th>
//                                 <th className="border p-2 text-left">Distance to Branch</th>
//                                 <th className="border p-2 text-left">Within 400 Meters</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {userCheckIns.map(checkIn => (
//                                 <tr key={checkIn.id} className="hover:bg-gray-100">
//                                     <td className="border p-2">{new Date(checkIn.check_in_time).toLocaleString()}</td>
//                                     <td className="border p-2">{checkIn.check_out_time ? new Date(checkIn.check_out_time).toLocaleString() : 'N/A'}</td>
//                                     <td className="border p-2">{checkIn.location ? JSON.parse(checkIn.location).latitude + ', ' + JSON.parse(checkIn.location).longitude : 'N/A'}</td>
//                                     <td className="border p-2">{checkIn.distance_to_branch || 'N/A'}</td>
//                                     <td className="border p-2">{checkIn.within_400_meters ? 'Yes' : 'No'}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// const AdminApp = () => {
//     const [users, setUsers] = useState([]);
//     const [checkIns, setCheckIns] = useState([]);
//     const [message, setMessage] = useState('');
//     const [selectedBranch, setSelectedBranch] = useState('');
//     const [userSearch, setUserSearch] = useState('');
//     const [checkInSearch, setCheckInSearch] = useState('');
//     const [userFilter, setUserFilter] = useState('all');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [activeSection, setActiveSection] = useState('Users');
//     const [selectedUser, setSelectedUser] = useState(null);
//     const API_URL = '/api';

//     useEffect(() => {
//         fetchUsers();
//         fetchCheckIns();
//     }, []);

//     const fetchUsers = async () => {
//         try {
//             const response = await fetch(`${API_URL}/supa/admin/fetch-all-users`, {
//                 headers: {
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
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
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 }
//             });
//             if (!response.ok) throw new Error('Failed to fetch check-ins');
//             const data = await response.json();
//             console.log(data);
//             setCheckIns(data.map(checkIn => ({
//                 ...checkIn,
//                 // location: checkIn.location ? JSON.parse(checkIn.location) : null,
//                 // check_out_information: checkIn.check_out_information ? JSON.parse(checkIn.check_out_information) : null
//             })));
//         } catch (error) {
//             console.error('Error fetching check-ins:', error);
//             setMessage('Error fetching check-ins');
//         }
//     };

//     const updateUserStatus = async (userId, active) => {
//         try {
//             const response = await fetch(`${API_URL}/supa/admin/update-user`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${localStorage.getItem('token')}`
//                 },
//                 body: JSON.stringify({ id: userId, active, slot_location: selectedBranch })
//             });
//             if (!response.ok) throw new Error('Failed to update user status');
//             const data = await response.json();
//             setMessage(data.message);
//             fetchUsers();
//         } catch (error) {
//             console.error('Error updating user status:', error);
//             setMessage('Failed to update user status');
//         }
//     };

//     const handleStatusChange = (user, active) => {
//         updateUserStatus(user.id, active ? 0 : 1);
//     };

//     const getUserById = (id) => {
//         return users.find(user => user.id === id);
//     };

//     const getPageData = (data, page) => {
//         const startIndex = (page - 1) * ITEMS_PER_PAGE;
//         const endIndex = startIndex + ITEMS_PER_PAGE;
//         return data.slice(startIndex, endIndex);
//     };

//     const filteredUsers = users.filter(user =>
//         (user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
//             user.email.toLowerCase().includes(userSearch.toLowerCase())) &&
//         (userFilter === 'all' || (userFilter === 'active' && user.active) || (userFilter === 'inactive' && !user.active))
//     );

//     const recentCheckIns = checkIns.reduce((acc, checkIn) => {
//         if (!acc[checkIn.user_id] || new Date(checkIn.check_in_time) > new Date(acc[checkIn.user_id].check_in_time)) {
//             acc[checkIn.user_id] = checkIn;
//         }
//         return acc;
//     }, {});

//     const filteredCheckIns = Object.values(recentCheckIns).filter(checkIn =>
//         checkIn?.branch.toLowerCase().includes(checkInSearch.toLowerCase())
//     );

//     const userPageData = getPageData(filteredUsers, currentPage);
//     const checkInPageData = getPageData(filteredCheckIns, currentPage);

//     const renderContent = () => {
//         switch (activeSection) {
//             case 'Users':
//                 return (
//                     <div>
//                         <h2 className="text-xl font-semibold mb-2">Users</h2>
//                         <div className="mb-4 flex gap-4">
//                             <Input
//                                 placeholder="Search users..."
//                                 value={userSearch}
//                                 onChange={(e) => setUserSearch(e.target.value)}
//                                 className="max-w-sm"
//                             />
//                             <Select value={userFilter} onValueChange={setUserFilter}>
//                                 <SelectTrigger className="w-[180px]">
//                                     <SelectValue placeholder="Filter by status" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="all">All</SelectItem>
//                                     <SelectItem value="active">Active</SelectItem>
//                                     <SelectItem value="inactive">Inactive</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                         <div className="overflow-x-auto">
//                             <table className="w-full table-auto border-collapse border border-gray-200">
//                                 <thead>
//                                     <tr className="bg-gray-200">
//                                         <th className="border p-2 text-left">Name</th>
//                                         <th className="border p-2 text-left">Email</th>
//                                         <th className="border p-2 text-left">Status</th>
//                                         <th className="border p-2 text-left">Slot Location</th>
//                                         <th className="border p-2 text-left">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {userPageData.map(user => (
//                                         <tr key={user.id} className="hover:bg-gray-100">
//                                             <td className="border p-2">{user.name}</td>
//                                             <td className="border p-2">{user.email}</td>
//                                             <td className="border p-2">{user.active ? 'Active' : 'Inactive'}</td>
//                                             <td className="border p-2">{user.slot_location}</td>
//                                             <td className="border p-2">
//                                                 <button
//                                                     onClick={() => handleStatusChange(user, user.active)}
//                                                     className={`px-4 py-2 rounded-md ${user.active ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
//                                                 >
//                                                     {user.active ? 'Deactivate' : 'Activate'}
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                             <Pagination
//                                 currentPage={currentPage}
//                                 totalItems={filteredUsers.length}
//                                 itemsPerPage={ITEMS_PER_PAGE}
//                                 onPageChange={setCurrentPage}
//                             />
//                         </div>
//                         <UserChart users={filteredUsers} />
//                     </div>
//                 );
//             case 'Check-Ins':
//                 return (
//                     <div>
//                         <h2 className="text-xl font-semibold mb-2">Check-Ins</h2>
//                         <Input
//                             placeholder="Search check-ins..."
//                             value={checkInSearch}
//                             onChange={(e) => setCheckInSearch(e.target.value)}
//                             className="mb-4 max-w-sm"
//                         />
//                         <BranchDropdown
//                             selectedBranch={selectedBranch}
//                             setSelectedBranch={setSelectedBranch}
//                         />
//                         <div className="overflow-x-auto">
//                             <table className="w-full table-auto border-collapse border border-gray-200">
//                                 <thead>
//                                     <tr className="bg-gray-200">
//                                         <th className="border p-2 text-left">User ID</th>
//                                         <th className="border p-2 text-left">User Name</th>
//                                         <th className="border p-2 text-left">Check-In Time</th>
//                                         <th className="border p-2 text-left">Check-Out Time</th>
//                                         <th className="border p-2 text-left">Location</th>
//                                         <th className="border p-2 text-left">Distance to Branch</th>
//                                         <th className="border p-2 text-left">Within 400 Meters</th>
//                                         <th className="border p-2 text-left">Actions</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {checkInPageData.map((checkIn) => (
//                                         <tr key={checkIn.id} className="hover:bg-gray-100">
//                                             <td className="border p-2">{checkIn.user_id}</td>
//                                             <td className="border p-2">{getUserById(checkIn.user_id)?.name || 'Unknown'}</td>
//                                             <td className="border p-2">{new Date(checkIn.check_in_time).toLocaleString()}</td>
//                                             <td className="border p-2">{checkIn.check_out_time ? new Date(checkIn.check_out_time).toLocaleString() : 'N/A'}</td>
//                                             <td className="border p-2">{checkIn.location ? `Lat: ${checkIn.location.latitude}, Lon: ${checkIn.location.longitude}` : 'N/A'}</td>
//                                             <td className="border p-2">{checkIn.distance_to_branch || 'N/A'}</td>
//                                             <td className="border p-2">{checkIn.within_400_meters ? 'Yes' : 'No'}</td>
//                                             <td className="border p-2">
//                                                 <button
//                                                     onClick={() => setSelectedUser(getUserById(checkIn.user_id))}
//                                                     className="px-4 py-2 rounded-md bg-blue-500 text-white"
//                                                 >
//                                                     View More
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                             <Pagination
//                                 currentPage={currentPage}
//                                 totalItems={filteredCheckIns.length}
//                                 itemsPerPage={ITEMS_PER_PAGE}
//                                 onPageChange={setCurrentPage}
//                             />
//                         </div>
//                         <CheckInChart checkIns={filteredCheckIns} />
//                     </div>
//                 );
//             default:
//                 return null;
//         }
//     };

//     return (
//         <div className="flex">
//             <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
//             <main className="ml-64 p-8 flex-1">
//                 {message && (
//                     <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
//                         {message}
//                     </div>
//                 )}
//                 {renderContent()}
//                 {selectedUser && (
//                     <CheckInModal
//                         user={selectedUser}
//                         checkIns={checkIns}
//                         onClose={() => setSelectedUser(null)}
//                     />
//                 )}
//             </main>
//         </div>
//     );
// };

// export default AdminApp;

