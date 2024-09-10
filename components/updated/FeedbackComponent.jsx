import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';

const FeedbackComponent = () => {
    const [users, setUsers] = useState([]);
    const [feedbackData, setFeedbackData] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedBranch, setSelectedBranch] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const API_URL = '/api';

    useEffect(() => {
        fetchUsers();
        fetchFeedback();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_URL}/supa/admin/fetch-all-users`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
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

    const fetchFeedback = async () => {
        try {
            const response = await fetch(`${API_URL}/supa/admin/fetch-all-feedbacks`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch feedback data');
            const data = await response.json();
            setFeedbackData(data);
        } catch (error) {
            console.error('Error fetching feedback data:', error);
            setMessage('Error fetching feedback data');
        }
    };

    const getUserById = (id) => users.find(user => user.id === id);

    const filterFeedbackData = () => {
        let filteredData = feedbackData;

        // Filter by date
        if (dateFilter) {
            filteredData = filteredData.filter(
                (feedback) =>
                    new Date(feedback.created_at).toLocaleDateString() === new Date(dateFilter).toLocaleDateString()
            );

            // Remove duplicate feedback entries by text for each user after date filter is applied
            const uniqueFeedback = [];
            const userFeedbackMap = new Map();

            filteredData.forEach(feedback => {
                const userId = feedback.user_id;
                const feedbackText = `${feedback.reason}-${feedback.improvement}-${feedback.extra_feedback}`;

                if (!userFeedbackMap.has(userId)) {
                    userFeedbackMap.set(userId, new Set());
                }

                if (!userFeedbackMap.get(userId).has(feedbackText)) {
                    userFeedbackMap.get(userId).add(feedbackText);
                    uniqueFeedback.push(feedback);
                }
            });

            filteredData = uniqueFeedback;
        }

        // Filter by user name or email
        if (userSearch) {
            filteredData = filteredData.filter((feedback) => {
                const user = getUserById(feedback.user_id);
                return user && (user.name.toLowerCase().includes(userSearch.toLowerCase()) || user.email.toLowerCase().includes(userSearch.toLowerCase()));
            });
        }

        // Filter by branch if selected
        if (selectedBranch) {
            filteredData = filteredData.filter(feedback =>
                feedback.slot_location && feedback.slot_location.toLowerCase().includes(selectedBranch.toLowerCase())
            );
        }

        return filteredData;
    };

    const filteredFeedbackData = filterFeedbackData();

    const renderContent = () => {
        return (
            <div>
                <h2 className="text-2xl font-semibold mb-4">Feedback Data</h2>
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                    <Input
                        type="date"
                        placeholder="Filter by date..."
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="max-w-sm"
                    />
                    <Input
                        placeholder="Search by user name or email..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="max-w-sm"
                    />
                    <Input
                        placeholder="Search by branch..."
                        value={selectedBranch}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                        className="max-w-sm"
                    />
                </div>
                <div className="overflow-x-auto border rounded-lg shadow-sm">
                    {message && <p className="text-red-500 mb-4">{message}</p>}
                    <table className="w-full border-collapse table-auto">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2 text-left">Name</th>
                                <th className="border p-2 text-left">Sales</th>
                                <th className="border p-2 text-left">Reason</th>
                                <th className="border p-2 text-left">Improvement</th>
                                <th className="border p-2 text-left">Extra Feedback</th>
                                <th className="border p-2 text-left">Slot Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFeedbackData.map((feedback) => (
                                <tr key={feedback.id} className="hover:bg-gray-100">
                                    <td className="border p-2">{feedback.name}</td>
                                    <td className="border p-2">{feedback.sales}</td>
                                    <td className="border p-2">{feedback.reason}</td>
                                    <td className="border p-2">{feedback.improvement}</td>
                                    <td className="border p-2">{feedback.extra_feedback}</td>
                                    <td className="border p-2">{feedback.slot_location}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col p-4">
            {renderContent()}
        </div>
    );
};

export default FeedbackComponent;
