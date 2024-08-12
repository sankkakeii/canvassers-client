import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import dayjs from 'dayjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const UserSalesChart = ({ sales, users }) => {
    const [filter, setFilter] = useState('all');

    // Create a mapping of user IDs to user names
    const userIdToNameMap = users.reduce((acc, user) => {
        acc[user.id] = user.name;
        return acc;
    }, {});

    // Filter sales data based on selected filter
    const filteredSales = sales.filter(sale => {
        const saleDate = dayjs(sale.date); // Assuming sale.date is in a valid date format
        const now = dayjs();

        switch (filter) {
            case 'week':
                return saleDate.isAfter(now.subtract(1, 'week'));
            case 'month':
                return saleDate.isAfter(now.subtract(1, 'month'));
            case 'year':
                return saleDate.isAfter(now.subtract(1, 'year'));
            default:
                return true;
        }
    });

    // Create an object to store unique customers per user
    const userSalesCount = filteredSales.reduce((acc, sale) => {
        const { user_id, customer_name } = sale;

        // Ensure each user has a set to store unique customer names
        if (!acc[user_id]) {
            acc[user_id] = new Set();
        }

        // Add the customer name to the user's set (Sets automatically handle uniqueness)
        acc[user_id].add(customer_name);

        return acc;
    }, {});

    // Transform the sets into counts and use user names instead of IDs
    const labels = Object.keys(userSalesCount).map(userId => userIdToNameMap[userId]);
    const data = Object.values(userSalesCount).map(customerSet => customerSet.size);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Number of Unique Customers',
                data,
                backgroundColor: '#36A2EB',
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Number of Unique Customers per User',
            },
        },
    };

    // Calculate the total number of sales
    const totalSales = filteredSales.length;

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2>Total Sales: {totalSales}</h2>
                <div>
                    <label>Filter by: </label>
                    <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                        <option value="all">All Time</option>
                        <option value="week">Last Week</option>
                        <option value="month">Last Month</option>
                        <option value="year">Last Year</option>
                    </select>
                </div>
            </header>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default UserSalesChart;

