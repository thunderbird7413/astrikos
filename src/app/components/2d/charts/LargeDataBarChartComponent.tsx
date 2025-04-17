import * as echarts from 'echarts/core';
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components';
import { BarChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { useEffect, useRef } from 'react';

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  BarChart,
  CanvasRenderer
]);

type ChartData = {
  categoryData: string[];
  valueData: number[];
};

type Props = {
  data: ChartData;
};

const LargeDataBarChartComponent = ({ data }: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || !data || !data.categoryData || !data.valueData) return;

    const chart = echarts.init(chartRef.current);

    const option: echarts.EChartsOption = {
      title: {
        text: `${echarts.format.addCommas(data.valueData.length)} Records`,
        left: 10,
        textStyle: {
          color: '#fff',
        },
      },
      toolbox: {
        feature: {
          dataZoom: {
            yAxisIndex: false,
          },
          saveAsImage: {
            pixelRatio: 2,
          },
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        bottom: 90,
      },
      dataZoom: [
        {
          type: 'inside',
        },
        {
          type: 'slider',
        },
      ],
      xAxis: {
        name: 'Time',
        data: data.categoryData,
        silent: false,
        splitLine: {
          show: false,
        },
        splitArea: {
          show: false,
        },
        axisLabel: {
          color: '#ccc',
        },
        nameTextStyle: {
          color: '#ccc',
        },
      },
      yAxis: {
        name: 'Value',
        splitArea: {
          show: false,
        },
        axisLabel: {
          color: '#ccc',
        },
        nameTextStyle: {
          color: '#ccc',
        },
      },
      series: [
        {
          type: 'bar',
          data: data.valueData,
          large: true, // Optimizing for large data set
        },
      ],
    };

    chart.setOption(option);

    return () => chart.dispose();
  }, [data]);

  return <div ref={chartRef} className="w-full h-[500px] rounded-xl shadow-xl" />;
};

export default LargeDataBarChartComponent;
