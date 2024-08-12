import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UserChart = ({ users }) => {
    const activeUsers = users.filter(user => user.active).length;
    const inactiveUsers = users.length - activeUsers;

    const data = {
        labels: ['Active Users', 'Inactive Users'],
        datasets: [
            {
                label: 'User Status',
                data: [activeUsers, inactiveUsers],
                backgroundColor: ['#4CAF50', '#F44336'],
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
                text: 'User Activity Overview',
            },
        },
    };

    return <Bar data={data} options={options} />;
};

export default UserChart;
