import React, { useState, useEffect } from 'react'
import { prepareExpenseBarChartData } from '../../utils/helper';
import CustomBarChart from '../Charts/CustomBarChart';

const Last30DaysExpenses = ({ data }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        console.log("Received raw data:", data);
        const result = prepareExpenseBarChartData(data);
        console.log("Processed chart data:", result);
        setChartData(result);
    }, [data]);

    console.log("Chart data to pass to component:", chartData);

    return (
        <div className="card col-span-1">
            <div className="flex items-center justify-between">
                <h5 className="text-lg">Last 30 Days Expenses</h5>
            </div>
            <CustomBarChart data={chartData} />  {/* Fixed: data not Data */}
        </div>
    );
};
export default Last30DaysExpenses;