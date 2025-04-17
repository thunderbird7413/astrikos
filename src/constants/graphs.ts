import BarChartComponent from '../../src/app/components/2d/charts/BarChartComponent';
import Line from '../../src/app/components/2d/charts/Line';
import LineChartComponent from '../../src/app/components/2d/charts/LineChartComponent';
import BarChartColorComponent from '../../src/app/components/2d/charts/BarChartColorComponent';
import RadialPolarBarChart from '../../src/app/components/2d/charts/RadialPolarBarChart';
import InteractiveBarChart from '../../src/app/components/2d/charts/InteractiveBarChart';
import AnimatedBarChartComponent from '../../src/app/components/2d/charts/AnimatedBarChartComponent';
import LargeDataBarChartComponent from '../../src/app/components/2d/charts/LargeDataBarChartComponent';
import ScatterChartUploadComponent from '../../src/app/components/2d/charts/ScatterChartUploadComponent';
import PolarBarChartComponent from '../../src/app/components/2d/charts/PolarBarChartComponent';
import PieChartComponent from '../../src/app/components/2d/charts/PieChartComponent';
import CustomPieChartComponent from '../../src/app/components/2d/charts/CustomPieChartComponent';
export const chartComponentsMap: { [key: string]: React.FC<any> } = {
  'bar-simple': BarChartComponent,
  'line': Line,
  'line-chart': LineChartComponent,
   'bar-data-color':BarChartColorComponent,
   'bar-polar-label-radial':RadialPolarBarChart, 
   'bar-gradient':InteractiveBarChart, 
   'bar-animation-delay':AnimatedBarChartComponent,
   'bar-large':LargeDataBarChartComponent, 
   'scatter-simple' :ScatterChartUploadComponent,
   'polar-endAngle':PolarBarChartComponent,
   'pie-simple':PieChartComponent, 
   'pie-custom':CustomPieChartComponent
};
