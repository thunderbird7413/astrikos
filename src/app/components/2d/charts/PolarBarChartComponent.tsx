'use client';

import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

export default function PolarBarChartComponent({ data }: { data: { S: string[], T: string[], SData: number[], TData: number[] } }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || !chartRef.current) return;

    const chart = echarts.init(chartRef.current, 'dark');

    const options = {
      tooltip: {},
      angleAxis: [
        {
          type: 'category',
          polarIndex: 0,
          startAngle: 90,
          endAngle: 0,
          data: data.S,
        },
        {
          type: 'category',
          polarIndex: 1,
          startAngle: -90,
          endAngle: -180,
          data: data.T,
        }
      ],
      radiusAxis: [{ polarIndex: 0 }, { polarIndex: 1 }],
      polar: [{}, {}],
      series: [
        {
          type: 'bar',
          polarIndex: 0,
          coordinateSystem: 'polar',
          data: data.SData,
        },
        {
          type: 'bar',
          polarIndex: 1,
          coordinateSystem: 'polar',
          data: data.TData,
        }
      ]
    };

    chart.setOption(options);
    return () => chart.dispose();
  }, [data]);

  return <div ref={chartRef} className="w-full h-[500px] rounded-xl shadow-xl" />;
}
