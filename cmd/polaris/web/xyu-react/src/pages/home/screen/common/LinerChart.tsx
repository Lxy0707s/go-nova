import React from 'react';
import {AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Dot} from 'recharts';

const data = [
    { name: 'Jan', traffic: 200 },
    { name: 'Feb', traffic: 150 },
    { name: 'Mar', traffic: 175 },
    { name: 'Apr', traffic: 280 },
    { name: 'May', traffic: 200 },
];

const CustomDot = (props:any) => {
    const { cx, cy, stroke } = props;
    return (
        <Dot cx={cx} cy={cy} r={4}  key={cx} stroke={stroke} fill="#5b8ff9" />
    );
};

const LineChart = () => {
    return (
        <AreaChart width={window.innerWidth * 0.40} height={150} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis/>
            <Tooltip/>
            <Legend/>
            <Area type="monotone" dataKey="traffic" stroke="#5b8ff9" fill="url(#colorGradient)" dot = {CustomDot} />
            <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5b8ff9" stopOpacity={1} />
                    <stop offset="100%" stopColor="#5b8ff9" stopOpacity={0.1} />
                </linearGradient>
            </defs>
        </AreaChart>
    );
};

export default LineChart;
