import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const UserSalesChart = ({ sales, users }) => {
    // Create a mapping of user IDs to user names
    const userIdToNameMap = users.reduce((acc, user) => {
        acc[user.id] = user.name; // Assuming user object has `id` and `name` fields
        return acc;
    }, {});

    // Create an object to store unique customers per user
    const userSalesCount = sales.reduce((acc, sale) => {
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

    return <Bar data={chartData} options={options} />;
};

export default UserSalesChart;
