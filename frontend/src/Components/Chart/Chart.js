import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useGlobalContext } from '../../context/globalContext';
import { dateFormat } from '../../utils/dateFormat';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const TradingStyleChart = () => {
  const { incomes, expenses } = useGlobalContext();

  const chartData = useMemo(() => {
    const transactions = [...incomes, ...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));
    let balance = 0;
    const balances = [];
    const labels = [];
    const colors = [];
    const transactionDetails = [];

    transactions.forEach((transaction, index) => {
      const amount = transaction.amount * (incomes.includes(transaction) ? 1 : -1);
      balance += amount;
      balances.push(balance);
      labels.push(dateFormat(transaction.date));
      
      if (index === 0) {
        colors.push('rgba(75, 192, 192, 0.6)');
      } else {
        colors.push(balance > balances[index - 1] ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)');
      }

      transactionDetails.push({
        type: incomes.includes(transaction) ? 'Income' : 'Expense',
        category: transaction.category,
        amount: transaction.amount
      });
    });

    return { balances, labels, colors, transactionDetails };
  }, [incomes, expenses]);

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Balance',
        data: chartData.balances,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(75, 192, 192, 0.4)');
          gradient.addColorStop(1, 'rgba(75, 192, 192, 0)');
          return gradient;
        },
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: chartData.colors,
        pointBorderColor: 'white',
        pointBorderWidth: 2,
        tension: 0.1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          title: (context) => `Date: ${context[0].label}`,
          label: (context) => {
            const transactionDetail = chartData.transactionDetails[context.dataIndex];
            return [
              `Balance: ₹${context.raw.toFixed(2)}`,
              `${transactionDetail.type}: ₹${transactionDetail.amount.toFixed(2)}`,
              `Category: ${transactionDetail.category}`
            ];
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        title: {
          display: true,
          text: 'Balance',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
        beginAtZero: true,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    hover: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div style={{ height: '400px', width: '100%', position: 'relative' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default TradingStyleChart;