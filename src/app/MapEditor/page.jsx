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
    <main className="h-screen flex flex-col bg-gray-950 text-neutral-200 overflow-hidden">
      {/* New source dialog */}
      <SourceDialog
        isOpen={newSourceDialogOpen}
        onClose={() => setNewSourceDialogOpen(false)}
        newSource={newSource}
        setNewSource={setNewSource}
        onAddSource={addNewSource}
      />

      <div className="bg-gray-950 p-2 border-b border-gray-700 flex justify-between items-center">
        <h1 className="text-xl font-bold text-neutral-200">
          GeoSpatial Data Viewer
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setNewSourceDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition-colors text-sm"
          >
            Add New Source
          </button>
        </div>
      </div>

      {/* Main two-panel layout */}
      <div className="flex flex-row flex-1 overflow-hidden">
        {/* Left panel - Data Sources */}
        <SourceList
          dataSources={dataSources}
          activeDataSources={activeDataSources}
          disconnectingSource={disconnectingSource}
          subscribeToSource={subscribeToSource}
          unsubscribeFromSource={unsubscribeFromSource}
          deleteSource={deleteSource}
        />

        {/* Center panel - Map */}
        <MapComponent
          viewState={viewState}
          setViewState={setViewState}
          geojsonData={geojsonData}
          pointFeatures={pointFeatures}
          layerStyles={layerStyles}
        />

        {/* Right panel - Features */}
        <FeaturePanel
          activeDataSources={activeDataSources}
          dataSources={dataSources}
          focusOnFeature={focusOnFeature}
        />
      </div>
    </main>
  );
}
