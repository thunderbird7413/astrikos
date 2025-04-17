'use client';

import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

export default function AnimatedBarChartComponent() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current, 'dark');

    // 🔸 Dummy Data
    const xAxisData = ['Jan', 'Feb', 'Mar', 'Apr'];
    const data1 = [120, 200, 150, 80];
    const data2 = [90, 180, 130, 70];

    const options: echarts.EChartsOption = {
      title: {
        text: 'Bar Animation Delay',
        left: 'center',
        textStyle: {
          color: '#fff',
        },
      },
      tooltip: {},
      legend: {
        data: ['Sales 2023', 'Sales 2024'],
        textStyle: {
          color: '#fff',
        },
        top: 30,
      },
      toolbox: {
        feature: {
          magicType: { type: ['stack'] },
          dataView: {},
          saveAsImage: { pixelRatio: 2 },
        },
      },
      xAxis: {
        name: 'Month',
        nameLocation: 'middle',
        nameGap: 30,
        data: xAxisData,
        splitLine: { show: false },
        axisLabel: { color: '#ccc' },
        nameTextStyle: { color: '#ccc' },
      },
      yAxis: {
        name: 'Revenue',
        nameLocation: 'middle',
        nameGap: 50,
        axisLabel: { color: '#ccc' },
        nameTextStyle: { color: '#ccc' },
      },
      series: [
        {
          name: 'Sales 2023',
          type: 'bar',
          data: data1,
          emphasis: { focus: 'series' },
          animationDelay: (idx: number) => idx * 10,
        },
        {
          name: 'Sales 2024',
          type: 'bar',
          data: data2,
          emphasis: { focus: 'series' },
          animationDelay: (idx: number) => idx * 10 + 100,
        },
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx: number) => idx * 5,
    };

    chart.setOption(options);

    return () => chart.dispose();
  }, []);

  return <div ref={chartRef} className="w-full h-[500px] rounded-xl shadow-xl" />;
}
