"use client";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

const UserOverviewChart = ({ stats }) => {

    const data = [
        {
            name: "Books",
            value: stats.totalBooks,
        },
        {
            name: "Spent",
            value: stats.totalSpent,
        },
        {
            name: "Delivered",
            value: stats.completedDeliveries,
        },
        {
            name: "Pending",
            value: stats.pendingDeliveries,
        },
    ];

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">

            <h2 className="text-xl font-bold text-white mb-6">
                Reading Activity Overview
            </h2>

            <ResponsiveContainer
                width="100%"
                height={350}
            >
                <AreaChart data={data}>

                    <defs>
                        <linearGradient
                            id="colorValue"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="#8b5cf6"
                                stopOpacity={0.8}
                            />
                            <stop
                                offset="95%"
                                stopColor="#8b5cf6"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#334155"
                    />

                    <XAxis
                        dataKey="name"
                        stroke="#94a3b8"
                    />

                    <YAxis
                        stroke="#94a3b8"
                    />

                    <Tooltip />

                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#8b5cf6"
                        fillOpacity={1}
                        fill="url(#colorValue)"
                    />

                </AreaChart>
            </ResponsiveContainer>



            

        </div>
    );
};

export default UserOverviewChart;