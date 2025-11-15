import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const SpendingChart = () => {
  const data = [
    { name: 'Food', value: 345, color: 'hsl(174 77% 45%)' },
    { name: 'Transportation', value: 220, color: 'hsl(213 94% 55%)' },
    { name: 'Entertainment', value: 185, color: 'hsl(160 84% 39%)' },
    { name: 'Shopping', value: 150, color: 'hsl(142 71% 45%)' },
    { name: 'Healthcare', value: 95, color: 'hsl(38 92% 50%)' },
    { name: 'Other', value: 125, color: 'hsl(215 16% 47%)' },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `$${value}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SpendingChart;
