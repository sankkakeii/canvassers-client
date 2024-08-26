import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const CheckInChart = ({ checkIns }) => {
    const labels = checkIns?.map(checkIn => new Date(checkIn.check_in_time).toLocaleDateString());
    const dataPoints = checkIns?.map(checkIn => checkIn.user_id);

    const data = {
        labels,
        datasets: [
            {
                label: 'Check-Ins Over Time',
                data: dataPoints,
                borderColor: '#2196F3',
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
                text: 'Check-Ins Over Time',
            },
        },
    };

    return <Line data={data} options={options} />;
};

export default CheckInChart;
