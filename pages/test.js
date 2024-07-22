// In AdminDashboard.js
import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [sales, setSales] = useState([]);
    const [checkIns, setCheckIns] = useState([]);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        const token = localStorage.getItem('token');
        try {
            const usersResponse = await fetch(`${API_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const salesResponse = await fetch(`${API_URL}/admin/sales`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const checkInsResponse = await fetch(`${API_URL}/admin/check-ins`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (usersResponse.ok && salesResponse.ok && checkInsResponse.ok) {
                setUsers(await usersResponse.json());
                setSales(await salesResponse.json());
                setCheckIns(await checkInsResponse.json());
            }
        } catch (error) {
            console.error('Error fetching admin data:', error);
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <h2>Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name} - {user.email}</li>
                ))}
            </ul>
            <h2>Sales</h2>
            <ul>
                {sales.map(sale => (
                    <li key={sale.id}>{sale.customerName} - {sale.deviceModel} - ${sale.amount}</li>
                ))}
            </ul>
            <h2>Check-Ins</h2>
            <ul>
                {checkIns.map(checkIn => (
                    <li key={checkIn.id}>{checkIn.User.name} - Lat: {checkIn.latitude}, Long: {checkIn.longitude}</li>
                ))}
            </ul>
        </div>
    );
};

export default AdminDashboard;