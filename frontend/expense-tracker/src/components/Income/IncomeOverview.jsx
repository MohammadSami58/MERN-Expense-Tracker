import React, { useEffect, useState } from 'react';
import { LuPlus } from "react-icons/lu";
import CustomBarChart from '../Charts/CustomBarChart';

const IncomeOverview = ({ transactions, onAddIncome }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        if (transactions && Array.isArray(transactions)) {
            const formattedData = transactions.map(item => ({
                name: item.source || 'Income',
                amount: Number(item.amount) || 0,
            }));
            setChartData(formattedData);
        }
    }, [transactions]);

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between">
                <div className="">
                    <h5 className="text-lg font-semibold">Income Overview</h5>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Track your earnings over time and analyze your income trends
                    </p>
                </div>

                <button className="add-btn" onClick={onAddIncome}>
                    <LuPlus className="text-lg" />
                    Add Income
                </button>
            </div>

            <div className="mt-10 h-[350px]">
                <CustomBarChart data={chartData} />
            </div>
        </div>
    );
};

export default IncomeOverview;