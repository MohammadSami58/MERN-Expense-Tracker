import React from 'react'
import { XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts'

const CustomLineChart = ({ data }) => {
    const CustomToolTip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white shadow-md rounded-lg p-2 border border-gray-300">
                    <p className="text-xs font-semibold text-purple-800 mb-1">
                        {payload[0].payload.month}
                    </p>
                    <p className="text-sm text-gray-600">
                        Amount: <span className='text-sm font-medium text-gray-900'>${payload[0].value.toFixed(2)}</span>
                    </p>
                </div>
            )
        }
        return null;
    }

    // Find max amount for better YAxis scaling
    const maxAmount = data && data.length > 0 
        ? Math.max(...data.map(item => item.amount || 0)) 
        : 0;

    return (
        <div className="bg-white">
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#875cf5" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#875cf5" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12, fill: "#555" }} 
                        axisLine={{ stroke: "#d1d5db" }}
                        tickLine={{ stroke: "#d1d5db" }}
                    />
                    <YAxis 
                        tick={{ fontSize: 12, fill: "#555" }} 
                        axisLine={{ stroke: "#d1d5db" }}
                        tickLine={{ stroke: "#d1d5db" }}
                        domain={[0, maxAmount * 1.1]} // Add 10% padding
                        tickFormatter={(value) => {
                            // Handle very small numbers
                            if (value < 0.01) return `$${value.toFixed(4)}`;
                            if (value < 1) return `$${value.toFixed(2)}`;
                            // Format with commas for thousands
                            return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
                        }}
                    />
                    <Tooltip content={<CustomToolTip />} />
                    <Area 
                        type="monotone" 
                        dataKey="amount" 
                        stroke="#875cf5" 
                        fill="url(#incomeGradient)" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: "#875cf5", strokeWidth: 2, stroke: "#fff" }}
                        activeDot={{ r: 6, fill: "#fff", stroke: "#875cf5", strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}

export default CustomLineChart