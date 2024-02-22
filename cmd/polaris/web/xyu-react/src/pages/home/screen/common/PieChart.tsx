import React, {useEffect} from 'react';
import {PieChart, Pie, Cell, Legend, Tooltip, Label} from 'recharts';

const data = [
    { name: '分类-1', value: 28 },
    { name: '分类-2', value: 25 },
    { name: '分类-3', value: 20 },
    { name: '分类-4', value: 12 },
    { name: '分类-5', value: 33 },
    { name: '分类-6', value: 5 },
];

const COLORS = ['#6395f9', '#75cbed', '#9a90ec', '#f6c02d', '#647797', '#65daab'];

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip">
                <p className="label">{`${payload[0].name} : ${payload[0].value}`}</p>
            </div>
        );
    }

    return null;
};


// const RADIAN = Math.PI / 180;

// const customizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent,name, value}: any) => {
//     const radius = innerRadius + (outerRadius - innerRadius) * 0.32;
//     const x = cx + radius * Math.cos(-midAngle * RADIAN);
//     const y = cy + radius * Math.sin(-midAngle * RADIAN);
//     return (
//         <text
//             x={x}
//             y={y}
//             fill="white"
//             textAnchor={x > cx ? "start" : "end"}
//             dominantBaseline="central"
//         >
//             {`${(percent * 100).toFixed(0)}%`}
//         </text>
//     );
// };

let total = 0;

const PieCharts: React.FC = () => {
    useEffect(
        ()=>{
            data.forEach((item) => {
                total += item.value;
            });
        },[]
    )
    return (
        <PieChart width={window.innerWidth*0.36} height={280} style={{ margin: '0 auto' }}>
            <Pie
                data={data}
                cx={200}
                cy={130}
                //label={customizedLabel}
                innerRadius={50}
                outerRadius={120}
                paddingAngle={1}
                dataKey="value"
                labelLine={true}
                label={(entry) => `${entry.name}/${entry.value}`}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                <Label
                    value = {`总计: ${total}`}
                    position="center"
                    fontSize={13}
                    fontWeight="bold"
                    fill="#000"
                />
            </Pie>
            <Legend align="right" verticalAlign="middle" layout="vertical" />
            <Tooltip content={<CustomTooltip />} />
        </PieChart>
    );
};

export default PieCharts;
