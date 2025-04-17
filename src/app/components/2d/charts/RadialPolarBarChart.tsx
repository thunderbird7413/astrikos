'use client';
import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

export default function RadialPolarBarChart({ data }: { data: any[] }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return;

    const chart = echarts.init(chartRef.current, 'dark');

    const [labelKey, valueKey] = Object.keys(data[0]);
    const categories = data.map((d) => d[labelKey]);
    const values = data.map((d) => +d[valueKey]);

    const options = {
      title: {
        text: 'Radial Polar Bar Chart',
        left: 'center',
        textStyle: {
          fontSize: 18,
        },
      },
      polar: {
        radius: [30, '80%'],
      },
      radiusAxis: {
        max: Math.max(...values) * 1.2,
        axisLabel: {
          color: '#ccc',
        },
      },
      angleAxis: {
        type: 'category',
        data: categories,
        startAngle: 75,
        axisLabel: {
          color: '#ccc',
        },
      },
      tooltip: {},
      series: [
        {
          type: 'bar',
          data: values,
          coordinateSystem: 'polar',
          label: {
            show: true,
            position: 'middle',
            formatter: (_: any, index: number) =>
              `${categories[index]}: ${values[index]}`,
            color: '#fff',
          },
          itemStyle: {
            borderRadius: 6,
          },
        },
      ],
      animation: false,
    };

    chart.setOption(options);
    return () => chart.dispose();
  }, [data]);

  return <div ref={chartRef} className="w-full h-[500px] rounded-xl shadow-xl" />;
}
