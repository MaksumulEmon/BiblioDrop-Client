"use client";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const COLORS = [
    "#8b5cf6",
    "#22c55e",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
];

export default function LibrarianOverviewChart({ stats }) {

    const data = [
        {
            name: "Total Books",
            value: stats.totalBooks,
        },
        {
            name: "Published",
            value: stats.publishedBooks,
        },
        {
            name: "Pending",
            value: stats.pendingBooks,
        },
        {
            name: "Deliveries",
            value: stats.totalDeliveries,
        },
        {
            name: "Earnings",
            value: stats.totalEarnings,
        },
    ];

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

            <h2 className="text-2xl font-bold text-white mb-6">
                Library Analytics
            </h2>

            <ResponsiveContainer
                width="100%"
                height={400}
            >
                <PieChart>

                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={140}
                        paddingAngle={5}
                        isAnimationActive
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={index}
                                fill={
                                    COLORS[
                                    index % COLORS.length
                                    ]
                                }
                            />
                        ))}
                    </Pie>

                    <Tooltip />

                    <Legend />

                </PieChart>
            </ResponsiveContainer>

        </div>
    );
}