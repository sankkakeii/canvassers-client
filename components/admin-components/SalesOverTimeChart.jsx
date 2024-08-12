import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const SalesOverTimeChart = ({ sales }) => {
    const salesOverTime = sales.reduce((acc, sale) => {
        const date = new Date(sale.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const data = {
        labels: Object.keys(salesOverTime),
        datasets: [
            {
                label: 'Number of Sales',
                data: Object.values(salesOverTime),
                backgroundColor: '#FF6384',
                borderColor: '#FF6384',
                fill: false,
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
                text: 'Sales Over Time',
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default SalesOverTimeChart;
