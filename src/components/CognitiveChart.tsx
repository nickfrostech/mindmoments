'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface CognitiveChartProps {
  morningScore: number;
  afternoonScore: number;
  eveningScore: number;
}

export function CognitiveChart({
  morningScore = 94,
  afternoonScore = 48,
  eveningScore = 72,
}: CognitiveChartProps) {
  const data = [
    { time: '6 AM', focus: 35 },
    { time: '8 AM', focus: 75 },
    { time: '10 AM', focus: morningScore },
    { time: '12 PM', focus: 70 },
    { time: '2 PM', focus: afternoonScore },
    { time: '4 PM', focus: 58 },
    { time: '6 PM', focus: eveningScore },
    { time: '8 PM', focus: 65 },
    { time: '10 PM', focus: 40 },
  ];

  return (
    <div className="w-full h-36 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            stroke="#71717A"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#71717A"
            fontSize={10}
            domain={[0, 100]}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#18181B',
              borderColor: '#27272A',
              borderRadius: '0.75rem',
              fontSize: '11px',
              color: '#F4F4F5',
            }}
            formatter={(value: any) => [`${value}% Focus`, 'Energy Level']}
          />
          <Area
            type="monotone"
            dataKey="focus"
            stroke="#3B82F6"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#focusGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

