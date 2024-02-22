import React from 'react';
import {PieChart, Pie, Cell, Tooltip} from 'recharts';

const data = [
    { name: '云原生', value: 28 },
    { name: '分布式', value: 25 },
    { name: '微服务', value: 20 },
    { name: '书法', value: 12 },
    { name: '旅游', value: 33 },
    { name: '唱歌', value: 5 },
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

const RADIAN = Math.PI / 180;

const customizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent,name, value}: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.32;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
        >
            {`${name}${(percent * 100).toFixed(0)}%`}
        </text>
    );
};


const PieContain: React.FC = () => {

    return (
        <PieChart width={window.innerWidth*0.36}  height={280} style={{ margin: '0 auto' }} >
            <Pie
                data={data}
                cx={180}
                cy={130}
                label={customizedLabel}
                innerRadius={50}
                outerRadius={120}
                paddingAngle={1}
                dataKey="value"
                fill="#8884d8"
                className='pie-container'
                labelLine={false}
            >
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <circle cx={185} cy={135} r={132} fill="transparent" stroke="purple" strokeWidth={2} />
        </PieChart>
    );
};

export default PieContain;
