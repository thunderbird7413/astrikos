"use client";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import Link from "next/link";
import "./page.css";
import SourceDialog from "../components/Map/SourceDialog";
import SourceList from "../components/Map/SourceList";
import MapComponent from "../components/Map/MapComponent";
import FeaturePanel from "../components/Map/FeaturePanel";
import { layerStyles, getSourceColor } from "../../utils/MapUtils";
import { generateGeoJSON, getPointFeatures } from "../../utils/GeoJsonUtils";
import { FiPlus, FiGlobe, FiLayers, FiDatabase, FiArrowRight } from 'react-icons/fi';

export default function Home() {
  const [dataSources, setDataSources] = useState([]);
  const [activeDataSources, setActiveDataSources] = useState({});
  const [realtimeData, setRealtimeData] = useState(null);
  const [disconnectingSource, setDisconnectingSource] = useState(null);

  const [viewState, setViewState] = useState({
    longitude: 77.216721,
    latitude: 28.6448,
    zoom: 4,
  });

  const [newSourceDialogOpen, setNewSourceDialogOpen] = useState(false);
  const [newSource, setNewSource] = useState({ id: "", url: "", name: "" });

  const [socket, setSocket] = useState(null);

  const subscribeToSource = (sourceId) => {
    if (socket && !activeDataSources[sourceId]) {
      console.log(`Subscribing to source: ${sourceId}`);
      socket.emit("subscribe-source", { sourceId });
    }
  };

  const unsubscribeFromSource = (sourceId) => {
    if (socket && activeDataSources[sourceId]) {
      console.log(`Unsubscribing from source: ${sourceId}`);

      setDisconnectingSource(sourceId);

      setActiveDataSources((prev) => {
        const newSources = { ...prev };
        delete newSources[sourceId];
        return newSources;
      });

      socket.emit("unsubscribe-source", { sourceId });

      setTimeout(() => {
        setDisconnectingSource(null);
      }, 500);
    }
  };

  const addNewSource = () => {
    if (socket && newSource.id && newSource.url && newSource.name) {
      socket.emit("add-source", newSource);
      setNewSourceDialogOpen(false);
      setNewSource({ id: "", url: "", name: "" });
    }
  };

  const deleteSource = (sourceId) => {
    if (socket) {
      socket.emit("delete-source", { sourceId });

      // If the source is active, unsubscribe from it
      if (activeDataSources[sourceId]) {
        unsubscribeFromSource(sourceId);
      }
    }
  };

  const focusOnFeature = (feature) => {
    if (!feature || !feature.geometry) return;

    if (feature.geometry.type === "Point") {
      setViewState({
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        zoom: 14,
      });
    } else if (feature.geometry.type === "LineString") {
      const midIndex = Math.floor(feature.geometry.coordinates.length / 2);
      setViewState({
        longitude: feature.geometry.coordinates[midIndex][0],
        latitude: feature.geometry.coordinates[midIndex][1],
        zoom: 12,
      });
    } else if (feature.geometry.type === "Polygon") {
      setViewState({
        longitude: feature.geometry.coordinates[0][0][0],
        latitude: feature.geometry.coordinates[0][0][1],
        zoom: 11,
      });
    } else if (feature.geometry.type === "MultiPolygon") {
      setViewState({
        longitude: feature.geometry.coordinates[0][0][0][0],
        latitude: feature.geometry.coordinates[0][0][0][1],
        zoom: 11,
      });
    }
  };

  useEffect(() => {
    const newSocket = io("http://localhost:4000");
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
    });

    newSocket.on("available-sources", (sources) => {
      setDataSources(sources);
    });

    newSocket.on("realtime-data", (response) => {
      const { sourceId, data, sourceName } = response;
      if (disconnectingSource === sourceId) {
        console.log(
          `Ignoring data for source ${sourceId} as it's being disconnected`
        );
        return;
      }

      setActiveDataSources((prev) => ({
        ...prev,
        [sourceId]: data,
      }));

      setRealtimeData(data);
    });

    newSocket.on("error", (error) => {
      console.error("Socket error:", error);
      alert(`Error: ${error.message}`);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [disconnectingSource]);

  const geojsonData = generateGeoJSON(activeDataSources);
  const pointFeatures = getPointFeatures(geojsonData);

  return (
    <main className="h-screen flex flex-col bg-[#030915] text-neutral-200 overflow-hidden">
      {/* New source dialog */}
      <SourceDialog
        isOpen={newSourceDialogOpen}
        onClose={() => setNewSourceDialogOpen(false)}
        newSource={newSource}
        setNewSource={setNewSource}
        onAddSource={addNewSource}
      />

      <div className="bg-[#030915] p-4 border-b border-gray-700 flex justify-between items-center shadow-lg">
        <div className="flex items-center space-x-3">
          <FiGlobe className="text-blue-400 text-2xl" />
          <h1 className="text-xl font-bold text-blue-100 tracking-wide">
            GeoSpatial Data Viewer
          </h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setNewSourceDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <FiPlus className="text-white" />
            <span>Add New Source</span>
          </button>
        </div>
      </div>

      {/* Status bar - connection indicator */}
      <div className="bg-[#0a1023] px-4 py-1 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center">
            <div className={`h-2 w-2 rounded-full mr-2 ${socket ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className="text-gray-400">{socket ? 'Connected to server' : 'Disconnected'}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {Object.keys(activeDataSources).length > 0 
            ? `${Object.keys(activeDataSources).length} active source${Object.keys(activeDataSources).length > 1 ? 's' : ''}` 
            : 'No active sources'}
        </div>
      </div>

      {/* Main two-panel layout */}
      <div className="flex flex-row flex-1 overflow-hidden">
        {/* Left panel - Data Sources */}
        <div className="w-64 border-r border-gray-800 flex flex-col bg-[#050b1f] shadow-lg">
          <div className="p-3 border-b border-gray-800 bg-[#071029] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FiDatabase className="text-blue-400" />
              <h2 className="font-medium text-sm uppercase tracking-wider text-blue-200">Data Sources</h2>
            </div>
            <span className="bg-gray-700 px-2 py-0.5 rounded-full text-xs">{dataSources.length}</span>
          </div>
          <SourceList
            dataSources={dataSources}
            activeDataSources={activeDataSources}
            disconnectingSource={disconnectingSource}
            subscribeToSource={subscribeToSource}
            unsubscribeFromSource={unsubscribeFromSource}
            deleteSource={deleteSource}
          />
        </div>

        {/* Center panel - Map */}
        <div className="flex-1 relative bg-[#040d20]">
          {Object.keys(activeDataSources).length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#030915] bg-opacity-90">
              <div className="text-center p-6 max-w-md">
                <FiLayers className="mx-auto text-5xl text-blue-400 mb-4" />
                <h3 className="text-xl font-medium text-blue-100 mb-2">No Active Data Sources</h3>
                <p className="text-gray-400 mb-4">Subscribe to data sources from the left panel to visualize them on the map.</p>
                <FiArrowRight className="mx-auto text-2xl text-blue-500 animate-pulse" />
              </div>
            </div>
          )}
          <MapComponent
            viewState={viewState}
            setViewState={setViewState}
            geojsonData={geojsonData}
            pointFeatures={pointFeatures}
            layerStyles={layerStyles}
          />
        </div>

        {/* Right panel - Features */}
        <div className="w-72 border-l border-gray-800 flex flex-col bg-[#050b1f] shadow-lg">
          <div className="p-3 border-b border-gray-800 bg-[#071029] flex items-center space-x-2">
            <FiLayers className="text-blue-400" />
            <h2 className="font-medium text-sm uppercase tracking-wider text-blue-200">Features</h2>
          </div>
          <FeaturePanel
            activeDataSources={activeDataSources}
            dataSources={dataSources}
            focusOnFeature={focusOnFeature}
          />
        </div>
      </div>
    </main>
  );
}