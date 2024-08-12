import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const SalesChart = ({ sales }) => {
    const axaSales = sales.filter(sale => sale.axa_insurance_card_serial).length;
    const otherSales = sales.length - axaSales;

    const data = {
        labels: ['AXA Insurance Card Sales', 'Other Sales'],
        datasets: [
            {
                label: 'Sales Distribution',
                data: [axaSales, otherSales],
                backgroundColor: ['#FFCE56', '#36A2EB'],
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
                text: 'AXA vs. Other Sales',
            },
        },
    };

    return <Pie data={data} options={options} />;
};

export default SalesChart;
