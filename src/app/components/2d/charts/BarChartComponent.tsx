'use client';
import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

export default function BarChartComponent({ data }: { data: any[] }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return;

    const chart = echarts.init(chartRef.current);

    const [labelKey, valueKey] = Object.keys(data[0]);
    const categories = data.map((d) => d[labelKey]);
    const values = data.map((d) => +d[valueKey]);

    const options = {
      title: {
        text: `${valueKey} by ${labelKey}`,
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        backgroundColor: '#333',
        textStyle: {
          color: '#fff',
        },
      },
      legend: {
        top: 30,
        data: [valueKey],
      },
      grid: {
        top: 80,
        left: 60,
        right: 30,
        bottom: 60,
      },
      xAxis: {
        type: 'category',
        data: categories,
        name: labelKey,
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: {
          rotate: 0,
        },
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 13,
        },
        axisLine: { lineStyle: { color: '#888' } },
      },
      yAxis: {
        type: 'value',
        name: valueKey,
        nameLocation: 'middle',
        nameGap: 45,
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 13,
        },
        axisLine: { lineStyle: { color: '#888' } },
        splitLine: {
          lineStyle: { type: 'dashed', color: '#ddd' },
        },
      },
      series: [
        {
          name: valueKey,
          type: 'bar',
          data: values,
          itemStyle: {
            color: '#73C0DE',
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 8,
          },
          barWidth: '50%',
        },
      ],
    };

    chart.setOption(options);

    return () => chart.dispose();
  }, [data]);

  return <div ref={chartRef} className="w-full h-[500px] rounded-xl shadow-lg" />;
}
