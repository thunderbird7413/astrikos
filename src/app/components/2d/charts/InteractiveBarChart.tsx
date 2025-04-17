'use client';

import * as echarts from 'echarts';
import { useEffect, useRef } from 'react';

export default function InteractiveBarChart({ data }: { data: any[] }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) return;

    const chart = echarts.init(chartRef.current, 'dark');

    const [labelKey, valueKey] = Object.keys(data[0]);
    const dataAxis = data.map((d) => d[labelKey]);
    const values = data.map((d) => +d[valueKey]);

    const yMax = Math.max(...values) * 1.2;
    const dataShadow = new Array(values.length).fill(yMax);

    const options = {
      title: {
        text: 'Interactive Bar Chart',
        subtext: 'Gradient, Shadow, Click Zoom',
        left: 'center',
        textStyle: {
          color: '#fff',
        },
        subtextStyle: {
          color: '#ccc',
        },
      },
      xAxis: {
        data: dataAxis,
        axisLabel: {
          inside: true,
          color: '#fff',
        },
        axisTick: { show: false },
        axisLine: { show: false },
        z: 10,
      },
      yAxis: {
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#ccc' },
      },
      dataZoom: [
        {
          type: 'inside',
        },
      ],
      series: [
        {
          type: 'bar',
          showBackground: true,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#83bff6' },
              { offset: 0.5, color: '#188df0' },
              { offset: 1, color: '#188df0' },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#2378f7' },
                { offset: 0.7, color: '#2378f7' },
                { offset: 1, color: '#83bff6' },
              ]),
            },
          },
          data: values,
        },
      ],
    };

    chart.setOption(options);

    const zoomSize = 6;
    chart.on('click', function (params) {
      chart.dispatchAction({
        type: 'dataZoom',
        startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
        endValue:
          dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)],
      });
    });

    return () => chart.dispose();
  }, [data]);

  return <div ref={chartRef} className="w-full h-[500px] rounded-xl shadow-xl" />;
}
