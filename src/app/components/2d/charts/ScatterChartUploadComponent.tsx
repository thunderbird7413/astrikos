git add .
'use client';

import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

export default function ScatterChartComponent({ data }: { data: any[] }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return;

    const chart = echarts.init(chartRef.current, 'dark');

    // Expecting each object to have two numeric keys
    const [xKey, yKey] = Object.keys(data[0]);

    const scatterData = data.map((d) => [parseFloat(d[xKey]), parseFloat(d[yKey])]);

    const options = {
      title: {
        text: 'Scatter Plot',
        left: 'center',
        textStyle: {
          fontSize: 20,
        },
      },
      tooltip: {
        trigger: 'item',
      },
      xAxis: {
        name: xKey,
        type: 'value',
        axisLabel: { color: '#ccc' },
      },
      yAxis: {
        name: yKey,
        type: 'value',
        axisLabel: { color: '#ccc' },
      },
      series: [
        {
          name: `${xKey} vs ${yKey}`,
          type: 'scatter',
          symbolSize: 20,
          data: scatterData,
        },
      ],
    };

    chart.setOption(options);
    return () => chart.dispose();
  }, [data]);

  return <div ref={chartRef} className="w-full h-[500px] rounded-xl shadow-xl" />;
}
