'use client';
import * as echarts from 'echarts';
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useRef, useState } from 'react';
import Papa from 'papaparse';
import UploadCard from './UploadCard';
import DoneButton from './DoneButton';
import { chartTemplates } from '../../../constants/chartTemplates';
import TemplateCard from './TemplateCard';
import { chartComponentsMap } from '../../../constants/graphs'; 

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer,
]);

export default function DataUploadChart() {
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(''); 
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [fileData, setFileData] = useState<any[]>([]);
  const [showChart, setShowChart] = useState(false);

  const templatesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(chartTemplates.length / templatesPerPage);
  const paginatedTemplates = chartTemplates.slice(
    (currentPage - 1) * templatesPerPage,
    currentPage * templatesPerPage
  );

  const handleFileUpload = (file: File) => {
    setUploadStatus('uploading');
    const formData = new FormData();
    console.log("formData", formData);
    formData.append('file', file);

    fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === 'File uploaded successfully') {
          handleParseFile(file);
          setUploadStatus('success');

        } else {
          setUploadStatus('error');
        }
      })
      .catch(() => setUploadStatus('error'));
  };

  const handleParseFile = (file: File) => {
    if (file.type === 'text/csv') {
      Papa.parse(file, {
        complete: (result) => {
          const cleanedData = result.data.filter((row: any) =>
            Object.values(row).some((value) => value !== null && value !== '')
          );
          setFileData(cleanedData);
          console.log('Parsed file data:', cleanedData);
        },
        header: true,
      });
    }
  };

  const showGraph = () => {
    if (fileData.length === 0) {
      alert('Please upload a valid CSV file.');
      return;
    }
    setShowChart(true);
  };

  const renderChartComponent = () => {
    console.log('Selected Template:', selectedTemplate);
    const SelectedChartComponent = chartComponentsMap[selectedTemplate] || chartComponentsMap['generic'];
    console.log('Selected Chart Component:', SelectedChartComponent);

    if (!SelectedChartComponent) {
      return <div>No chart available for this template</div>;
    }

    return <SelectedChartComponent data={fileData} />;
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen flex flex-col items-center text-white">
      <h2 className='text-4xl mb-10'>Data Visualization</h2>
      <div className="mb-6 w-full max-w-md">
        <UploadCard onFileDrop={handleFileUpload} />
        {uploadStatus === 'uploading' && <p className="text-blue-500 mt-2">Uploading...</p>}
        {uploadStatus === 'success' && <p className="text-green-500 mt-2">✅ File uploaded successfully!</p>}
        {uploadStatus === 'error' && <p className="text-red-500 mt-2">❌ File upload failed.</p>}
      </div>

      <div className="text-center mb-8">
        <p className="text-lg text-blue-500 font-semibold mb-4">Select a Chart Template:</p>
        <div className="w-full flex justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {paginatedTemplates.map((template) => (
              <TemplateCard
                key={template.type}
                template={template}
                selected={selectedTemplate}
                onSelect={setSelectedTemplate}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-blue-800 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            ← Previous
          </button>
          <span className="font-medium text-blue-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-800 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>

      <button
        className="px-6 py-2 bg-blue-500 cursor-pointer text-white rounded-lg hover:bg-blue-600 transition duration-300"
        onClick={showGraph}
      >
        Show Results
      </button>

      {showChart && (
        <div className="mt-8 w-full max-w-4xl">
          {renderChartComponent()} 
        </div>
      )}
    </div>
  );
}
