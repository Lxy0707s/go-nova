import React from 'react';
import { RadialBarChart, RadialBar, Legend } from 'recharts';

const FlightLine = ({ data }: any) => {
    return (
        <div style={{ position: 'relative' }}>
            <RadialBarChart width={500} height={500} cx={250} cy={250} innerRadius={100} outerRadius={200} barSize={20} data={data}>
                <RadialBar background dataKey='value' />
                <Legend iconSize={10} layout='vertical' verticalAlign='middle' align='right' />
            </RadialBarChart>
            <div className='arrow' style={{ transform: `rotate(${data[0].value}deg)` }}></div>
        </div>
    );
};

export default FlightLine;
