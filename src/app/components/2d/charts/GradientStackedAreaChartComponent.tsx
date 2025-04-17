'use client';

import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts/core';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components';
import { LineChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { UniversalTransition } from 'echarts/features';

import * as Papa from 'papaparse'; // for CSV parsing

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

interface ChartFromFileProps {
  dataFile: string; // path to CSV or JSON file (public folder)
  title?: string;
}

export default function GradientStackedAreaChartComponent({
  dataFile,
  title = 'Gradient Stacked Area Chart'
}: ChartFromFileProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [option, setOption] = useState<any>(null);

  useEffect(() => {
    const isCSV = dataFile.endsWith('.csv');

    const fetchData = async () => {
      const response = await fetch(dataFile);
      const text = await response.text();

      if (isCSV) {
        Papa.parse(text, {
          header: true,
          complete: (result) => {
            const parsedData = result.data as any[];

            const categories = Object.keys(parsedData[0]).filter(k => k !== 'name');
            const series = parsedData.map((row, i) => {
              const gradientColors = [
                ['rgb(128, 255, 165)', 'rgb(1, 191, 236)'],
                ['rgb(0, 221, 255)', 'rgb(77, 119, 255)'],
                ['rgb(55, 162, 255)', 'rgb(116, 21, 219)'],
                ['rgb(255, 0, 135)', 'rgb(135, 0, 157)'],
                ['rgb(255, 191, 0)', 'rgb(224, 62, 76)']
              ];
              return {
                name: row.name,
                type: 'line',
                stack: 'Total',
                smooth: true,
                lineStyle: { width: 0 },
                showSymbol: false,
                areaStyle: {
                  opacity: 0.8,
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: gradientColors[i % gradientColors.length][0] },
                    { offset: 1, color: gradientColors[i % gradientColors.length][1] }
                  ])
                },
                emphasis: { focus: 'series' },
                label: {
                  show: i === parsedData.length - 1,
                  position: 'top'
                },
                data: categories.map(day => Number(row[day]))
              };
            });

            setOption({
              title: { text: title },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross',
                  label: { backgroundColor: '#6a7985' }
                }
              },
              legend: { data: parsedData.map(d => d.name) },
              toolbox: {
                feature: { saveAsImage: {} }
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: [
                {
                  type: 'category',
                  boundaryGap: false,
                  data: categories
                }
              ],
              yAxis: [{ type: 'value' }],
              series
            });
          }
        });
      } else {
        // JSON structure should be: { categories: [...], series: [ { name, data, gradientFrom, gradientTo } ] }
        const jsonData = JSON.parse(text);
        const series = jsonData.series.map((s: any, i: number) => ({
          ...s,
          type: 'line',
          stack: 'Total',
          smooth: true,
          lineStyle: { width: 0 },
          showSymbol: false,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: s.gradientFrom },
              { offset: 1, color: s.gradientTo }
            ])
          },
          emphasis: { focus: 'series' },
          label: s.showLabel
            ? {
                show: true,
                position: 'top'
              }
            : undefined
        }));

        setOption({
          title: { text: title },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: { backgroundColor: '#6a7985' }
            }
          },
          legend: { data: jsonData.series.map((s: any) => s.name) },
          toolbox: {
            feature: { saveAsImage: {} }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [{ type: 'category', boundaryGap: false, data: jsonData.categories }],
          yAxis: [{ type: 'value' }],
          series
        });
      }
    };

    fetchData();
  }, [dataFile, title]);

  useEffect(() => {
    if (chartRef.current && option) {
      const chartInstance = echarts.init(chartRef.current, 'dark');
      chartInstance.setOption(option);
      return () => chartInstance.dispose();
    }
  }, [option]);

  return <div ref={chartRef} style={{ width: '100%', height: '500px' }} />;
}
