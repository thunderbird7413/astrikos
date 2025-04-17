'use client';

import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

export default function BarChartColorComponent({ data }: { data: any[] }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return;

    const chart = echarts.init(chartRef.current, 'dark');

    const [labelKey, valueKey] = Object.keys(data[0]);
    const categories = data.map((d) => d[labelKey]);
    const values = data.map((d, index) => {
      if (index === 1) {
        return {
          value: +d[valueKey],
          itemStyle: { color: '#a90000' },
        };
      }
      return +d[valueKey];
    });

    const options = {
      title: {
        text: 'Custom Colored Bar Chart',
        left: 'center',
        textStyle: {
          fontSize: 20,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: categories,
        axisLabel: {
          rotate: 45,
          color: '#ccc',
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#ccc',
        },
      },
      series: [
        {
          name: valueKey,
          data: values,
          type: 'bar',
          barWidth: '60%',
        },
      ],
    };

    chart.setOption(options);
    return () => chart.dispose();
  }, [data]);

  return <div ref={chartRef} className="w-full h-[500px] rounded-xl shadow-xl" />;
}
