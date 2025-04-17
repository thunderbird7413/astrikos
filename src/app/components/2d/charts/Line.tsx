'use client';

import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

export default function LineChartComponent({ data }: { data: any[] }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const keys = Object.keys(data[0]);
    if (keys.length < 2) return;

    const [xKey, yKey] = keys; 
    const xData = data.map((d) => d[xKey]);
    const yData = data.map((d) => +d[yKey]);

    const options = {
      title: {
        text: `${yKey} vs ${xKey}`,
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#333',
        borderColor: '#777',
        borderWidth: 1,
        textStyle: { color: '#fff' },
      },
      legend: {
        data: [yKey],
        top: 30,
        textStyle: { fontSize: 12 },
      },
      grid: {
        top: 80,
        left: 60,
        right: 30,
        bottom: 60,
      },
      xAxis: {
        type: 'category',
        name: xKey,
        nameLocation: 'middle',
        nameGap: 35,
        data: xData,
        axisLine: { lineStyle: { color: '#888' } },
        axisLabel: { rotate: 0 },
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 13,
        },
      },
      yAxis: {
        type: 'value',
        name: yKey,
        nameLocation: 'middle',
        nameGap: 50,
        axisLine: { lineStyle: { color: '#888' } },
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 13,
        },
        splitLine: {
          lineStyle: { type: 'dashed', color: '#ddd' },
        },
      },
      series: [
        {
          name: yKey,
          data: yData,
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: '#5470C6',
          },
          lineStyle: {
            width: 3,
            color: '#5470C6',
          },
          areaStyle: {
            color: 'rgba(84, 112, 198, 0.2)',
          },
        },
      ],
    };

    chart.setOption(options);

    return () => chart.dispose();
  }, [data]);

  return <div ref={chartRef} className="w-full h-[500px] rounded-xl shadow-lg" />;
}
